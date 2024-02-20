

import localforage from 'localforage'
import { instanceMep1002, instanceMep1004, CONTRACTS_MAP } from './Address'
import { PROVIDER } from './Network'



export const mep1004NewLocationProofEvent = async() => {
    const saveName = 'MEP1004NewLocationProof'
    const blockName = 'MEP1004NewLocationProof__blocksNum'

    let blockStart: number = await localforage.getItem(blockName) || CONTRACTS_MAP.MEP1004NewLocationProofBlockNumber
    let mep1004 = instanceMep1004()
    let latestBlock = await PROVIDER.getBlockNumber();
    const eventFilter = mep1004.filters.NewLocationProof()
    let events: any = await mep1004.queryFilter(
        eventFilter,
        blockStart,
        latestBlock
    )
    events = events.map((item:any)=>{
        let tokenId = item.args?.MEP1002TokenId._hex
        let nft = item.args?.item
        let timestamp = item.args?.locationProof?.timestamp.toString()
        return { tokenId, nft, timestamp }
    })
    let orgEvents: any = await localforage.getItem(saveName) || []
    let newEvents = orgEvents.concat(events)
    await localforage.setItem(blockName, latestBlock)
    await localforage.setItem(saveName, newEvents)
    return newEvents
}

export const mep1004RemoveFromMEP1002SlotEvent = async() => {
    const saveName = 'MEP1004RemoveFromMEP1002Slot'
    const blockName = 'MEP1004RemoveFromMEP1002Slot__blocksNum'

    let blockStart: number = await localforage.getItem(blockName) || CONTRACTS_MAP.MEP1004RemoveFromMEP1002SlotBlockNumber
    let mep1004 = instanceMep1004()
    let latestBlock = await PROVIDER.getBlockNumber();
    const eventFilter = mep1004.filters.RemoveFromMEP1002Slot()
    let events: any = await mep1004.queryFilter(
        eventFilter,
        blockStart,
        latestBlock
    )
    events = events.map((item:any)=>{
        let tokenId = item.args?.MEP1002TokenId._hex
        const transactionHash = item?.args && item['transactionHash']
        let MEP1004TokenId = item.args?.MEP1004TokenId.toString()
        let slotIndex = item.args?.slotIndex.toString()
        let SNCodeType = item.args?.SNCodeType.toString()
        return { tokenId, transactionHash, MEP1004TokenId, slotIndex, SNCodeType }
    })
    let orgEvents: any = await localforage.getItem(saveName) || []
    let newEvents = orgEvents.concat(events)
    await localforage.setItem(blockName, latestBlock)
    await localforage.setItem(saveName, newEvents)
    return newEvents
}

export const mep1004InsertToMEP1002SlotEvent = async() => {
    const saveName = 'MEP1004InsertToMEP1002Slot'
    const blockName = 'MEP1004InsertToMEP1002Slot__blocksNum'

    let blockStart: number = await localforage.getItem(blockName) || CONTRACTS_MAP.MEP1004InsertToMEP1002SlotBlockNumber
    let mep1004 = instanceMep1004()
    let latestBlock = await PROVIDER.getBlockNumber();
    const eventFilter = mep1004.filters.InsertToMEP1002Slot()
    let events: any = await mep1004.queryFilter(
        eventFilter,
        blockStart,
        latestBlock
    )
    events = events.map((item:any)=>{
        let tokenId = item.args?.MEP1002TokenId._hex
        const transactionHash = item?.args && item['transactionHash']
        let MEP1004TokenId = item.args?.MEP1004TokenId.toString()
        let slotIndex = item.args?.slotIndex.toString()
        let SNCodeType = item.args?.SNCodeType.toString()
        return { tokenId, transactionHash, MEP1004TokenId, slotIndex, SNCodeType }
    })
    let orgEvents: any = await localforage.getItem(saveName) || []
    let newEvents = orgEvents.concat(events)
    await localforage.setItem(blockName, latestBlock)
    await localforage.setItem(saveName, newEvents)
    return newEvents
}

export const mep1002TransferEvent = async (readCache=false) => {
    const saveName = 'MEP1002Transfer'
    const blockName = 'MEP1002Transfer__blocksNum'
    if(readCache) {
        let orgEvents: any = await localforage.getItem(saveName) || []
        return orgEvents
    }

    let blockStart: number = await localforage.getItem(blockName) || CONTRACTS_MAP.MEP1002TransferStart
    let mep1002 = instanceMep1002()
    let latestBlock = await PROVIDER.getBlockNumber();
    const eventFilter = mep1002.filters.Transfer()
    
    let events: any = []
    if (latestBlock > blockStart) {
      events = await mep1002.queryFilter(
        eventFilter,
        blockStart,
        latestBlock
      )
    }

    events = events.map((item:any)=>{
        const tokenId = item?.args && item.args['tokenId'].toString();
        const transactionHash = item?.args && item['transactionHash']
        return { tokenId, transactionHash }
    })
    let orgEvents: any = await localforage.getItem(saveName) || []
    let newEvents = orgEvents.concat(events)
    await localforage.setItem(blockName, latestBlock)
    await localforage.setItem(saveName, newEvents)
    return newEvents
}


export const mep1002SetNameEvent = async (readCache=false) => {
    const saveName = 'MEP1002TokenUpdateName'
    const blockName = 'MEP1002TokenUpdateName__blocksNum'

    if(readCache) {
        let orgEvents: any = await localforage.getItem(saveName) || []
        return orgEvents
    }

    let blockStart: number = await localforage.getItem(blockName) || CONTRACTS_MAP.MEP1002TokenUpdateNameStart
    let mep1002 = instanceMep1002()
    let latestBlock = await PROVIDER.getBlockNumber();
    const eventFilter = mep1002.filters.MEP1002TokenUpdateName()
    let events: any = await mep1002.queryFilter(
        eventFilter,
        blockStart,
        latestBlock
    )
    events = events.map((item:any)=>{
        const tokenId = item.args?.tokenId._hex
        const hexId = tokenId.replace('0x', '');
        let name = item.args?.name
        let st = ""
        for (let i in name) {
            if (name[i].match(/[a-zA-Z0-9]/)) {
                st = st + name[i]
            } else {
                st = st + "."
            }
        }
        if (st.length > 0) {
            if (st[0] == '.') {
                st = st.slice(1, st.length - 1)
            }
            if (st[st.length - 1] == '.') {
                st = st.slice(0, st.length - 2)
            }
        }
        name = st.replace(".mxc", "")
        return {
            hexId,
            name
        }
    })
    let orgEvents: any = await localforage.getItem(saveName) || []
    let newEvents = orgEvents.concat(events)
    await localforage.setItem(blockName, latestBlock)
    await localforage.setItem(saveName, newEvents)
    return newEvents
}
