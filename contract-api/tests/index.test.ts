import { ContractFactory, ethers, providers, Wallet } from "ethers"

import * as artifact from "../artifact/NftBlend.json";
import { NftBlend } from "../src";

describe("Contract API integration test", () => {
    let contractAddress: string
    let wallet: Wallet

    beforeEach(async () => {
        let provider = new providers.JsonRpcProvider()

        wallet = Wallet.fromMnemonic("test test test test test test test test test test test junk").connect(provider);

        let contractFactory = new ContractFactory(artifact.abi, artifact.bytecode, wallet)
        let contract = await contractFactory.deploy()

        contractAddress = contract.address

        await contract.deployTransaction.wait()
    })

    it("can register address", async () => {
        let provider: providers.JsonRpcProvider = wallet.provider as providers.JsonRpcProvider
        let signer = provider.getSigner(1)

        let nftBlend = new NftBlend(signer, contractAddress)

        let transaction = await nftBlend.register()
        await transaction.wait()

        let isRegistered = await nftBlend.isRegistered(await signer.getAddress())

        expect(isRegistered).toBe(true)
    })

    it("can deregister address", async () => {
        let provider: providers.JsonRpcProvider = wallet.provider as providers.JsonRpcProvider
        let signer = provider.getSigner(1)

        let nftBlend = new NftBlend(signer, contractAddress)

        let transaction = await nftBlend.register()
        await transaction.wait()

        let isRegistered = await nftBlend.isRegistered(await signer.getAddress())
        expect(isRegistered).toBe(true)

        transaction = await nftBlend.deregister();
        await transaction.wait()

        isRegistered = await nftBlend.isRegistered(await signer.getAddress())
        expect(isRegistered).toBe(false)
    })

    it("can mint tokens", async () => {
        let provider: providers.JsonRpcProvider = wallet.provider as providers.JsonRpcProvider
        let signer1 = provider.getSigner(1)
        let signer2 = provider.getSigner(2)

        let nftBlend1 = new NftBlend(signer1, contractAddress)
        let nftBlend2 = new NftBlend(signer2, contractAddress)

        let transaction = await nftBlend1.register()
        await transaction.wait()

        transaction = await nftBlend2.register()
        await transaction.wait()

        transaction = await nftBlend1.mint(await signer2.getAddress(), 95, "http://localhost:8080/image.jpg")
        let receipt = await transaction.wait() as any as { events: [{ event: string, args: [any] }] }

        let tokenId = receipt.events.find((event) => event.event === "BlendMinted")?.args[0]

        let token = await nftBlend1.token(tokenId)

        expect(token.id).toBe(tokenId)
        expect(token.sourceAddress).toBe(await signer1.getAddress())
        expect(token.targetAddress).toBe(await signer2.getAddress())
        expect(token.score).toBe(95)
        expect(token.uri).toBe("http://localhost:8080/image.jpg")
    })

    it("can get previously minted tokens", async () => {
        let provider: providers.JsonRpcProvider = wallet.provider as providers.JsonRpcProvider

        let signer1 = provider.getSigner(1)
        let signer2 = provider.getSigner(2)
        let signer3 = provider.getSigner(3)
        let signer4 = provider.getSigner(4)

        let nftBlend1 = new NftBlend(signer1, contractAddress)
        let nftBlend2 = new NftBlend(signer2, contractAddress)
        let nftBlend3 = new NftBlend(signer3, contractAddress)
        let nftBlend4 = new NftBlend(signer4, contractAddress)

        let transaction = await nftBlend1.register()
        await transaction.wait()

        transaction = await nftBlend2.register()
        await transaction.wait()

        transaction = await nftBlend3.register()
        await transaction.wait()

        transaction = await nftBlend4.register()
        await transaction.wait()

        transaction = await nftBlend1.mint(await signer2.getAddress(), 95, "http://localhost:8080/image.jpg")
        let receipt = await transaction.wait() as any as { events: [{ event: string, args: [any] }] }
        let tokenId2 = receipt.events.find((event) => event.event === "BlendMinted")?.args[0]

        transaction = await nftBlend1.mint(await signer3.getAddress(), 96, "http://localhost:8080/image.jpg")
        receipt = await transaction.wait() as any as { events: [{ event: string, args: [any] }] }
        let tokenId3 = receipt.events.find((event) => event.event === "BlendMinted")?.args[0]

        transaction = await nftBlend1.mint(await signer4.getAddress(), 97, "http://localhost:8080/image.jpg")
        receipt = await transaction.wait() as any as { events: [{ event: string, args: [any] }] }
        let tokenId4 = receipt.events.find((event) => event.event === "BlendMinted")?.args[0]

        let tokens = await nftBlend1.getPastMintedTokens()

        expect(tokens.length).toBe(3)

        expect(tokens[0].id).toStrictEqual(tokenId2)
        expect(tokens[1].id).toStrictEqual(tokenId3)
        expect(tokens[2].id).toStrictEqual(tokenId4)
    })

    it("can get registered addresses", async () => {
        let provider: providers.JsonRpcProvider = wallet.provider as providers.JsonRpcProvider

        let signer1 = provider.getSigner(1)
        let signer2 = provider.getSigner(2)
        let signer3 = provider.getSigner(3)
        let signer4 = provider.getSigner(4)

        let nftBlend1 = new NftBlend(signer1, contractAddress)
        let nftBlend2 = new NftBlend(signer2, contractAddress)
        let nftBlend3 = new NftBlend(signer3, contractAddress)
        let nftBlend4 = new NftBlend(signer4, contractAddress)

        let transaction = await nftBlend1.register()
        await transaction.wait()

        transaction = await nftBlend2.register()
        await transaction.wait()

        transaction = await nftBlend3.register()
        await transaction.wait()

        transaction = await nftBlend4.register()
        await transaction.wait()

        transaction = await nftBlend3.deregister()
        await transaction.wait()

        let addresses = await nftBlend1.getRegisteredAddresses()

        expect(addresses.length).toBe(3)
        expect(addresses[0]).toBe(await signer1.getAddress())
        expect(addresses[1]).toBe(await signer2.getAddress())
        expect(addresses[2]).toBe(await signer4.getAddress())
    })
})
