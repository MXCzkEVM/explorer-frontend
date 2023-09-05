

import { ethers } from 'ethers'
import mep1002 from './abi/mep/mep1002'
import mep1004 from './abi/mep/mep1004'
import collection from './abi/MXCCollectionV2Upgrade'
import { PROVIDER } from './Network'

const CHAIN_ID = process.env.NEXT_PUBLIC_NETWORK_ID || ""

const contracts: any = {
    18686: {
        collectBase: 'https://nft.mxc.com',

        MEP1002Token: "0x068234de9429FaeF2585A6eD9A52695cDa78aFE1",
        MEP1002BlockNumber: 340,
        MEP1002TokenUpdateNameStart: 3719,
        MEP1002TransferStart: 3719,

        MEP1004Token: "0x8Ff08F39B1F4Ad7dc42E6D63fd25AeE47EA801Ce",
        MEP1004BlockNumber: 345,
        MEP1004InsertToMEP1002SlotBlockNumber: 3719,
        MEP1004RemoveFromMEP1002SlotBlockNumber: 3719,
        MEP1004NewLocationProofBlockNumber: 3719
    },
    5167003: {
        collectBase: 'https://wannsee-nft.mxc.com',

        MEP1002Token: "0xFf3159E5779C61f5d2965305DC1b9E8a1E16a39c",
        MEP1002BlockNumber: 356,
        MEP1002TokenUpdateNameStart: 645464,
        MEP1002TransferStart: 61546,

        MEP1004Token: "0x5CE293229a794AF03Ec3c95Cfba6b1058D558026",
        MEP1004BlockNumber: 370,
        MEP1004InsertToMEP1002SlotBlockNumber: 649235,
        MEP1004RemoveFromMEP1002SlotBlockNumber: 649235,
        MEP1004NewLocationProofBlockNumber: 650598
    },
}

export const ABI = {
    mep1002,
    mep1004,
    collection
}

export const dataVersion = "V2"

export const CONTRACTS_MAP = contracts[CHAIN_ID]


export const instanceMep1002 = () => {
    return new ethers.Contract(CONTRACTS_MAP.MEP1002Token, ABI.mep1002, PROVIDER)
}

export const instanceMep1004 =  () => {
    return new ethers.Contract(CONTRACTS_MAP.MEP1004Token, ABI.mep1004, PROVIDER)
}