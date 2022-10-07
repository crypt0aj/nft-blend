import { useState, useEffect, useRef } from 'react';

const PROMPTS = [
    "Blend it like Beckham",
    "What do Cronos Cruisers eat for dessert? Apple CROmble",
    "What's the best dating app for NFTs? Mintinder",
    "Friends that blend together stay together",
    "when life gives you lemons, buy a blender",
    "Mind blending chemistry",
    "So is this an influencer or a friend?",
    "Just a dApp playing at CROpid",
    "star CROssed soulmates meet through NFTs",
    "calculating CROmpatibility",
    "CROwling the blockchain data",
    "CROwdsourcing analysis of your wallet contents",
]
export function randomPrompt(): string {
    return PROMPTS[Math.trunc(Math.random() * PROMPTS.length)];
}

export default function useRandomPrompt(intervalMillisecond?: number) {
  const [prompt, setPrompt] = useState(randomPrompt());

  useEffect(() => {
    if (!intervalMillisecond) {
        return;
    }

    const generatePromptRegularly = () => {
      setPrompt(randomPrompt()); 
      setTimeout(() => {
        generatePromptRegularly();
      }, intervalMillisecond);
    };
    generatePromptRegularly();
  }, [intervalMillisecond]);

  return prompt;
}