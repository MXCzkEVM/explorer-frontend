


import localforage from 'localforage'
import {
    mep1002SetNameEvent, mep1002TransferEvent, mep1004InsertToMEP1002SlotEvent,
    mep1004RemoveFromMEP1002SlotEvent, mep1004NewLocationProofEvent
} from './Events'
import { buildCenterFeature, int2hex } from 'constants/H3Utils'
import { instanceMep1004 } from './Address'
import { ThirdwebSDK } from '@thirdweb-dev/sdk/evm';
import { NETWORK } from './Network'
import { ABI, CONTRACTS_MAP, dataVersion } from './Address'
import appConfig from 'configs/app';


const filterLeverl = 90

export const getMep1004 = async () => {
    await mep1004InsertToMEP1002SlotEvent()
    await mep1004RemoveFromMEP1002SlotEvent()
    await mep1004NewLocationProofEvent()
}

export const getNFTMetadata = async (collectionId: string) => {
    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(
        collectionId,
        ABI.collection
    );
    return contract

}

export const getMep1004Miners = async (tatHexId: string) => {
    let soltEvents: any = await localforage.getItem('MEP1004InsertToMEP1002Slot') || []
    let removeEvents: any = await localforage.getItem('MEP1004RemoveFromMEP1002Slot') || []

    // let miner: any = {}
    // soltEvents.map((item:any) => {
    //     const { MEP1004TokenId, slotIndex, SNCodeType, tokenId, transactionHash } = item
    //     const hexId = tokenId.replace('0x', '');
    //     // 1002 =>  slotType => slotIndex
    //     miner[hexId] = miner[hexId] || {}
    //     miner[hexId][SNCodeType] = miner[hexId][SNCodeType] || {}
    //     miner[hexId][SNCodeType][slotIndex] = miner[hexId][SNCodeType][slotIndex] || {}
    //     miner[hexId][SNCodeType][slotIndex] = {
    //         MEP1004TokenId,
    //         transactionHash
    //     }
    // })
    // removeEvents.map((item:any) => {
    //     const {  slotIndex, SNCodeType, tokenId } = item
    //     const hexId = tokenId.replace('0x', '');
    //     // 1002 =>  slotType => slotIndex
    //     miner[hexId] = miner[hexId] || {}
    //     miner[hexId][SNCodeType] = miner[hexId][SNCodeType] || {}
    //     miner[hexId][SNCodeType][slotIndex] = miner[hexId][SNCodeType][slotIndex] || {}
    //     delete miner[hexId][SNCodeType][slotIndex]
    // })

    let miner: any = {}
    soltEvents.map((item: any) => {
        const { MEP1004TokenId, slotIndex, SNCodeType, tokenId, transactionHash } = item
        const hexId = tokenId.replace('0x', '');
        if (hexId == tatHexId) {
            // 1002 =>  slotType => slotIndex
            miner[SNCodeType] = miner[SNCodeType] || {}
            miner[SNCodeType][slotIndex] = miner[SNCodeType][slotIndex] || {}
            miner[SNCodeType][slotIndex] = {
                MEP1004TokenId,
                transactionHash
            }
        }
    })
    removeEvents.map((item: any) => {
        const { slotIndex, SNCodeType, tokenId } = item
        const hexId = tokenId.replace('0x', '');
        if (hexId == tatHexId) {
            // 1002 =>  slotType => slotIndex
            miner[SNCodeType] = miner[SNCodeType] || {}
            miner[SNCodeType][slotIndex] = miner[SNCodeType][slotIndex] || {}
            delete [SNCodeType][slotIndex]
        }
    })

    let miners = []
    for (let SNCodeType in miner) {
        for (let slotIndex in miner[SNCodeType]) {
            let item = miner[SNCodeType][slotIndex]
            let minerId = item['MEP1004TokenId']
            let transactionHash = item['transactionHash']
            let SNCode = item['SNCode']
            // if (!name) {
            //     let mep1004 = await getContract(MEP1004ContractAddr, mep1004abi)
            //     name = await mep1004.tokenNames(minerId)
            //     item['name'] = name
            // }
            if (!SNCode) {
                let mep1004 = await instanceMep1004()
                SNCode = await mep1004.getSNCode(minerId)
                item['SNCode'] = SNCode
            }
            miners.push({
                minerId,
                // name,
                SNCode,
                transactionHash
            })
        }
    }
    return miners
}

export const getNFTProof = async (tatHexId: string) => {
    let proofEvents: any = await localforage.getItem('MEP1004NewLocationProof') || []

    let nftItems: any = {}
    for (let index in proofEvents) {
        const item = proofEvents[index]
        const { tokenId, nft } = item
        const hexId = tokenId.replace('0x', '');
        if (tatHexId !== hexId) {
            continue
        }
        const spl = nft.split("-")
        if (spl.length !== 2) {
            continue
        }
        // console.log(spl)
        const collectIds = spl[0] as string
        const nftItem = spl[1]

        let collects = nftItems[collectIds] || [];
        collects.push(nftItem);
        const uniqueArr = Array.from(new Set(collects));
        nftItems[collectIds] = uniqueArr;
    }

    let nfts: any = []
    if (Object.keys(nftItems).length) {
        for (let collection in nftItems) {
            let collectionTokens = nftItems[collection]
            const collectionData = await getNFTMetadata(collection)

            for (let item in collectionTokens) {
                const tokenId = parseInt(collectionTokens[item])
                let nft: any = await collectionData.erc721.get(collectionTokens[item])
                nfts.push({
                    tokenId,
                    name: nft.metadata.name,
                    link: `${CONTRACTS_MAP.collectBase}/collection/${collection}/${tokenId}`
                })
            }
        }
    }
    return nfts
}

export const getGeoHexagon = async () => {
    let events = await mep1002TransferEvent()
    let filterData = Object.values(events.reduce((acc: any, event: any) => {
        acc[event.tokenId] = {
            tokenId: event.tokenId,
            transactionHash: event.transactionHash
        };
        return acc;
    }, {}));

    let id2ens: any = {}
    let names: any = await localforage.getItem('MEP1002TokenUpdateName') || []
    for (let index in names) {
        let item = names[index]
        if (!item.name) {
            continue
        }
        id2ens[item.hexId] = 1
    }

    if (!appConfig.chain.isTestnet) {
        return filterData
    }

    filterData = filterData.filter((item: any) => {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        let hexId = int2hex(item.tokenId)
        return randomNumber > filterLeverl || id2ens[hexId]
    })
    return filterData;
}

export const getGeoHexagonCache = async () => {
    let events = await mep1002TransferEvent(true)
    let filterData = Object.values(events.reduce((acc: any, event: any) => {
        acc[event.tokenId] = {
            tokenId: event.tokenId,
            transactionHash: event.transactionHash
        };
        return acc;
    }, {}));

    return filterData;
}


const getMep1002 = async (readCache = false) => {
    let events = await mep1002SetNameEvent(readCache)
    let filterData = Object.values(events.reduce((acc: any, event: any) => {
        acc[event.name] = {
            hexId: event.hexId,
            name: event.name
        };
        return acc;
    }, {}));
    filterData = filterData.filter((item: any) => item.name.length)
    return filterData;
}

export const getMep1002HexagonName = async (readCache = false) => {
    const filterData = await getMep1002(readCache)
    const hexagonsName = filterData.map((item: any) => {
        return buildCenterFeature(item.hexId, item.name)
    })
    return hexagonsName;
}


export const dataInit = async () => {
    let version = await localforage.getItem('version')
    if (!version || version !== dataVersion) {
        await localforage.clear()
        await localforage.setItem('version', dataVersion)
    }
}
