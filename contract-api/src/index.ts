import { BigNumber, Contract, providers, Signer, Event } from "ethers"
import { Result } from "ethers/lib/utils";

import * as artifact from "../artifact/NftBlend.json";

interface Token {
    id: BigNumber,
    sourceAddress: string,
    targetAddress: string,
    score: number,
    uri: string,
}

// A class to interact with `NftBlend` contract
export class NftBlend {
    provider: Signer | providers.Provider
    contract: Contract

    // Creates a new instance of `NftBlend`
    constructor(provider: Signer | providers.Provider, contractAddress: string) {
        this.provider = provider
        this.contract = new Contract(contractAddress, artifact.abi, this.provider)
    }

    // Registers an address
    async register(): Promise<providers.TransactionResponse> {
        return (await this.contract.register())
    }

    // Checks is an address is registered
    async isRegistered(address: string): Promise<boolean> {
        let isRegistered = await this.contract.isRegistered(address)
        return isRegistered
    }

    // De-registers an address
    async deregister(): Promise<providers.TransactionResponse> {
        return (await this.contract.deregister())
    }

    // Mints a new blend with given target address, score and image uri
    async mint(targetAddress: string, score: number, uri: string): Promise<providers.TransactionResponse> {
        return (await this.contract.mint(targetAddress, score, uri))
    }

    // Returns the token with given token id
    async token(tokenId: BigNumber): Promise<Token> {
        let response = await this.contract.getMetadata(tokenId)

        return {
            id: tokenId,
            sourceAddress: response[0],
            targetAddress: response[1],
            score: response[2],
            uri: response[3],
        }
    }

    // Returns blend tokens minted in past
    async getPastMintedTokens(fromBlockOrBlockhash?: string | number | undefined, toBlockOrBlockHash?: string | number | undefined): Promise<Array<Token>> {
        let events = await this.contract.queryFilter("BlendMinted", fromBlockOrBlockhash, toBlockOrBlockHash)
        return events.filter((event) => event.args !== undefined).map((event) => {
            let args = event.args as Result

            return {
                id: args["_tokenId"],
                sourceAddress: args["_sourceAddress"],
                targetAddress: args["_targetAddress"],
                score: args["_score"],
                uri: args["_uri"]
            }
        })
    }

    // Returns currently registered addresses
    async getRegisteredAddresses(): Promise<Array<string>> {
        let addresses = new Set<string>()

        let registeredFilter = this.contract.filters.AddressRegistered()
        let deregisteredFilter = this.contract.filters.AddressDeregistered()

        let topics: Array<string> = (registeredFilter.topics as Array<string>).concat(deregisteredFilter.topics as Array<string>)

        let filter = {
            address: this.contract.address,
            topics: [topics]
        }

        let events = await this.contract.queryFilter(filter)

        for (let i = 0; i < events.length; i++) {
            let receipt = await events[i].getTransactionReceipt()

            if (events[i].topics[0] === (registeredFilter.topics as Array<string>)[0]) {
                addresses.add(receipt.from)
            } else {
                addresses.delete(receipt.from)
            }
        }

        return Array.from(addresses)
    }
}
