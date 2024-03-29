import type CspDev from 'csp-dev';

export function moonchain(): CspDev.DirectiveDescriptor {
    return {
        'connect-src': [
            '*.thirdweb.com',
            '*.thirdwebcdn.com',
            '*.goldsky.com',
            '*.thegraph.com',
            '*.quicknode.pro',
            '*.mxc.com',
            '*.mxc.org',
            '*.quiknode.pro',
            '*.mapbox.com',
            '*.arbitrum.io',
            '*.io',
            '*.com',
            '*.moonchain.com'
        ],
        'img-src': [
            '*.quicknode.pro',
            '*.mxc.com',
            '*.moonchain.com'
        ],
    };
}


