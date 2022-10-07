import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { useLocation } from "react-router-dom";
import useRandomPrompt from "../../../lib/useRandomPrompt";
import styles from "./index.module.css";

const IMAGE_PARTS = 6; //higher number takes longer to split and join anything under 15 seems ok

export default function BlendProcessPage(props: Props) {
  const nftLeftRef = useRef<HTMLDivElement | null>(null);
  const nftBlendRef = useRef<HTMLDivElement | null>(null);
  const nftRightRef = useRef<HTMLDivElement | null>(null);
  const progressPctRef = useRef<HTMLDivElement | null>(null);
  const progressInnerRef = useRef<HTMLDivElement | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [nftLeftLoaded, setNFTLeftLoaded] = useState(false);
  const [nftRightLoaded, setNFTRightLoaded] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [renderSignal, setRenderSignal] = useState(false);
  const [blendImageData, setBlendImageData] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const prompt = useRandomPrompt(5000);

  const {
    image1URI,
    image2URI,
    isScoreReady,
    onBlendComplete,
    onBlendError,
  } = props;

  const handleBlendComplete = useCallback((imageData: string) => {
    setBlendImageData(imageData);
  }, []);

  // Check if blend is completed
  useEffect(() => {
    if (blendImageData !== null && isScoreReady) {
      setIsCompleted(true);
      setTimeout(() => {
        onBlendComplete(blendImageData);
      }, 2000);
    }
  }, [blendImageData, isScoreReady, onBlendComplete])

  // Prepare for blend
  const blendAlreadyPrepared = useRef(false);
  useEffect(() => {
    if (!image1URI || !image2URI) {
      return
    }
    if (blendAlreadyPrepared.current) {
      return;
    }
    blendAlreadyPrepared.current = true;

    //Create Empty IMG's in the Blend wrapper
    for (var i = 0; i < IMAGE_PARTS * IMAGE_PARTS; i++) {
      var img = document.createElement("img");
      img.style.width = `${100 / IMAGE_PARTS}%`;
      img.style.height = `${100 / IMAGE_PARTS}%`;
      nftBlendRef.current!.append(img);
    }

    const leftImage = new Image();
    leftImage.crossOrigin = "anonymous";
    leftImage.onload = () => {
      removeAllDOMChildren(nftLeftRef.current!);
      splitImageIntoImgs(leftImage, nftLeftRef.current!);
      setNFTLeftLoaded(true);
    };
    leftImage.onerror = (err) => {
      onBlendError(err);
    }

    const rightImage = new Image();
    rightImage.crossOrigin = "anonymous";
    rightImage.onload = () => {
      removeAllDOMChildren(nftRightRef.current!);
      splitImageIntoImgs(rightImage, nftRightRef.current!);
      setNFTRightLoaded(true);
    };
    rightImage.onerror = (err) => {
      onBlendError(err);
    }

    leftImage.src = image1URI;
    rightImage.src = image2URI;

    return () => {
      removeAllDOMChildren(nftLeftRef.current!);
      removeAllDOMChildren(nftRightRef.current!);
    };
  }, [image1URI, image2URI]);

  const blendI = useRef(0);
  const useLeft = useRef(true);
  const blend = useCallback(() => {
    const allBlendBlocks = nftBlendRef.current!.querySelectorAll<HTMLImageElement>("img");
    const allLeftBlocks = nftLeftRef.current!.querySelectorAll<HTMLImageElement>("img");
    const leftBlocks = Array.from(nftLeftRef.current!.querySelectorAll<HTMLImageElement>("img")).reduce<HTMLImageElement[]>((result, imgEl) => {
      if (!imgEl.classList.contains(styles.NFTImageFaded)) {
        result.push(imgEl);
      }
      return result;
    }, []);
    const allRightBlocks = nftRightRef.current!.querySelectorAll<HTMLImageElement>("img");

    const randomBlock =
      leftBlocks[Math.floor(Math.random() * leftBlocks.length)];
    const randomPureBlockIndex = Array.from(allLeftBlocks).indexOf(randomBlock);
    allLeftBlocks[randomPureBlockIndex].classList.add(styles.NFTImageFaded);
    allRightBlocks[randomPureBlockIndex].classList.add(styles.NFTImageFaded);

    const imageToUse = useLeft.current
      ? allRightBlocks[randomPureBlockIndex]
      : allLeftBlocks[randomPureBlockIndex];
    useLeft.current = !useLeft.current;
    allBlendBlocks[randomPureBlockIndex].src = imageToUse.src;
    allBlendBlocks[randomPureBlockIndex].classList.add(styles.NFTImageReveal);

    blendI.current += 1;
    const progress = (100 / (IMAGE_PARTS * IMAGE_PARTS)) * blendI.current;
    if (progress > currentProgress) {
      setCurrentProgress(progress);
    }

    if (leftBlocks.length > 1) {
      setTimeout(() => {
        blend();
      }, 7500 / (IMAGE_PARTS * IMAGE_PARTS));
    } else {
      const imageData = generateBlendedImage(nftBlendRef.current!);
      handleBlendComplete(imageData);
    }
  }, [currentProgress, handleBlendComplete]);

  // Blend when everything is ready
  const blendAlreadyStarted = useRef(false);
  useEffect(() => {
    if (!nftLeftLoaded || !nftRightLoaded) {
      return;
    }
    if (blendAlreadyStarted.current) {
      return;
    }
    blendAlreadyStarted.current = true;

    setTimeout(() => {
      blendI.current = 0;
      blend();
    }, 1000);
  }, [nftLeftLoaded, nftRightLoaded, blend]);

  // Automatically advance the progress to provide better UX
  const minProgress = useRef(0);
  const maxProgress = useRef(0);
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (isScoreReady) {
      maxProgress.current = 100;
      setRenderSignal(true);
    }
    if (nftLeftLoaded && nftRightLoaded) {
      maxProgress.current = 99;
      return;
    }
    const progress = () => {
      if (minProgress.current <= 99) {
        minProgress.current += 1;
        maxProgress.current = minProgress.current;
        setRenderSignal(true);
      }
      return setTimeout(() => {
        timeout = progress();
      }, 2000);
    }
    timeout = progress();

    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
    }
  }, [nftLeftLoaded, nftRightLoaded, isScoreReady]);
  // A hack to prevent infinite loop due to setState(state) inside useEffect
  // because state is an dependency and triggers re-render
  useEffect(() => {
    if (renderSignal) {
      setRenderSignal(false);
    }
  }, [renderSignal, setRenderSignal]);

  let progress = Math.ceil(currentProgress);
  if (currentProgress < minProgress.current) {
    progress = minProgress.current;
  } else if (currentProgress > maxProgress.current) {
    progress = maxProgress.current;
  }

  return (
    <div className={styles.Container}>
      {renderSignal ? null : null}
      <div className={styles.ResultContainer}>
        <div className={styles.ResultTitle}>{isCompleted ? 'Blend Completed' : 'Blending'}</div>
        <div className={styles.Result}>
          <div className={styles.ResultNFTContainer}>
            <div ref={nftLeftRef} className={[styles.NFT, styles.NFTLeft].join(' ')}></div>
            <div ref={nftBlendRef} className={[styles.NFT, styles.NFTBlend].join(' ')}></div>
            <div ref={nftRightRef} className={[styles.NFT, styles.NFTRight].join(' ')}></div>
          </div>
        </div>
        <div className={styles.Caption}>{prompt}</div>
        <div className={styles.ProgressContainer}>
          <div className={styles.ProgressTitle}>Progress</div>
          <div className={styles.Progress}>
            {/* <div className={styles.ProgressInner} width="50%"></div> */}
            <div ref={progressInnerRef} className={styles.ProgressInner} style={{
              width: `${100 - progress}%`
            }}></div>
          </div>
          <div ref={progressPctRef} className={styles.ProgressPct}>{progress}%</div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  image1URI?: string;
  image2URI?: string;
  isScoreReady: boolean;
  onBlendComplete: (imageData: string) => void;
  onBlendError: (err: unknown) => void;
}

//Split Each image into imageparts * imageparts
function splitImageIntoImgs(img: HTMLImageElement, el: HTMLDivElement) {
  var sizeOfPiece = img.width / IMAGE_PARTS;
  for (var y = 0; y < IMAGE_PARTS; y++) {
    for (var x = 0; x < IMAGE_PARTS; x++) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 500;
      canvas.height = 500;
      ctx!.drawImage(
        img,
        x * sizeOfPiece,
        y * sizeOfPiece,
        sizeOfPiece,
        sizeOfPiece,
        0,
        0,
        canvas.width,
        canvas.height
      );
      var newImg = document.createElement("img");
      newImg.src = canvas.toDataURL();
      newImg.style.width = `${100 / IMAGE_PARTS}%`;
      newImg.style.height = `${100 / IMAGE_PARTS}%`;
      el.append(newImg);
    }
  }
}

function generateBlendedImage(nftBlendEl: HTMLDivElement) {
  const pixelRatio = window.devicePixelRatio;
  const imgs = nftBlendEl.querySelectorAll("img");
  const size = imgs[0].width * IMAGE_PARTS;
  const sizeOfPiece = (size / IMAGE_PARTS) * pixelRatio;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;

  var i = 0;

  for (let y = 0; y < IMAGE_PARTS; ++y) {
    for (let x = 0; x < IMAGE_PARTS; ++x) {
      ctx!.drawImage(
        imgs[i],
        x * sizeOfPiece,
        y * sizeOfPiece,
        sizeOfPiece,
        sizeOfPiece
      );
      i = i + 1;
    }
  }

  return canvas.toDataURL();
  //UNCOMMENT THE BELOW TO SEE GENERATED IMAGE

  /*var newImg = document.createElement("img");
  newImg.className = "output";
  newImg.src = canvas.toDataURL();
  document.body.append(newImg);*/
}

function removeAllDOMChildren(el: HTMLElement) {
  if (!el) {
    return;
  }
  while (el.firstElementChild) {
    el.firstElementChild.remove();
  }
}