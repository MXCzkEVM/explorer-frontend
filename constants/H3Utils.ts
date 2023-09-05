

import geojson2h3 from 'geojson2h3';
import { ethers, BigNumber } from 'ethers';
import localforage from 'localforage'
import {getMep1002HexagonName} from './StogeUtils'
import h3, {
    // latLngToCell,
    // gridDisk,
    // cellToBoundary,
    cellToLatLng,
    getResolution,
    // getBaseCellNumber,
    // h3IndexToSplitLong,
} from 'h3-js';
import { GeoJsonTypes } from 'geojson';

export const int2hex = (num_string: string) => {
    const decimalNum = BigNumber.from(num_string);
    let hexNum = decimalNum.toHexString();
    let hexId = hexNum.replace('0x', '');
    return hexId
}

export const getGeoHex = (vertexFeatures: any[]) => {
    const vertex = vertexFeatures.map(item => {
        let hexId = int2hex(item.tokenId)
        let data: any = geojson2h3.h3ToFeature(hexId);
        data.properties.color = '#10c469';
        data.properties.weight = 1;
        data.transactionHash = item['transactionHash']
        return data;
    })
    return vertex
}

export const buildCenterFeatureSimple = (hexId: any, name: string) => {
    let geocoord = cellToLatLng(hexId);
    let coordinates = [geocoord[1], geocoord[0]]
    return {
        id: hexId,
        name,
        coordinates,
    };
};

export const buildCenterFeature = (hexId: any, name: string) => {
    let geocoord = cellToLatLng(hexId);
    let resolution = getResolution(hexId);
    let coordinates = [geocoord[1], geocoord[0]]
    return {
        type: 'Feature' as GeoJsonTypes,
        id: hexId,
        name,
        geometry: {
            type: 'Point' as GeoJsonTypes,
            coordinates,
        },
        properties: {
            title: ((hexId >> 24) & 0xff).toString(16).toUpperCase(),
            resolution,
        },
    };
};


export const getDataMap = async() => {
    let hexagonsName:any = await getMep1002HexagonName(true);

    let ens2loc: any = {}
    let hexId2loc: any = {}
    let name2hexId: any = {}
    let hexId2name: any = {}
    
    hexagonsName.map((item:any) => {
        let coord = item.geometry.coordinates
        ens2loc[item.name] = [coord[1], coord[0]]
        hexId2loc[item.id] = [coord[1], coord[0]]
        name2hexId[item.name] = item.id
        hexId2name[item.id] = item.name
    })
    return {
        ens2loc,
        hexId2loc,
        name2hexId,
        hexId2name
    }
}

