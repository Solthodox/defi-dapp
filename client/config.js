import mockComp from './abis/contracts/MockTokens.sol/mockComp.json'
import mockLink from './abis/contracts/MockTokens.sol/mockLink.json'
import mockUsdt from './abis/contracts/MockTokens.sol/mockUsdt.json'
import mockUsdc from './abis/contracts/MockTokens.sol/mockUsdc.json'
import mockChz from './abis/contracts/MockTokens.sol/mockChz.json'

class DoubleMap{
    constructor(arr){
        this.data = new Map()
        arr.map(a=> {
          this.data.set(a[0], [[],[]])
          this.data.set(a[1], [[],[]])
          this.data.set(a[2], [[],[]])
        })
        arr.map(a=>{
          const a0 = a[0].toString()
          const a1 = a[1].toString()
          const a2 = a[2].toString()
          this.data.set(
            a[0], 
            [...this.data.get(a[0]), [a1, a2]      ]
          )
          this.data.set(
            a[1], 
            [...this.data.get(a[1]), [a0, a2]      ]
          )
        })
        
    }

    get(key0, key1){
        const arrayXarray = this.data.get(key0)
        const _array = arrayXarray.find(el => el[0]===key1)
        return _array[1]
    }
   
}




export const dex  = {
    factory : '0xaC46221eB1f4798291aDFa9f7C1467F9923c560a',
    pools : new DoubleMap([
   /**COMP-USDT */ ['0xb3Ea499b10Cc09Eb9e75e269E0C03b3f90aC04BF', '0xb2fc6f780f46205359516a02B85DFA9DaEc29E50', '0x6bBBDb407759637Cb5bdB893B33B3BFEEcC4E478'],
   /**COMP-LINK */ ['0xb3Ea499b10Cc09Eb9e75e269E0C03b3f90aC04BF', '0x0E7A488886e57EE3d7d33d96Cf5fD6BdF070BCdb', '0xf233EBE7849746cEaCfA6E32A377d786770EA857'],
   /**COMP-CHZ  */ ['0xb3Ea499b10Cc09Eb9e75e269E0C03b3f90aC04BF', '0xaC220bDa95B3f97fA812Af0899acC2256752FD1A', '0x069d7721801f9655346a514A332E105277a0cbd2'],
   /**USDT-CHZ  */ ['0xb2fc6f780f46205359516a02B85DFA9DaEc29E50', '0xaC220bDa95B3f97fA812Af0899acC2256752FD1A', '0xb9d48ff72f360838e850DEe5B38bD0E4635164ac'],
   /**LINK-CHZ  */ ['0x0E7A488886e57EE3d7d33d96Cf5fD6BdF070BCdb', '0xaC220bDa95B3f97fA812Af0899acC2256752FD1A', '0xdb931C0E6122969DCF4DBD98E1d4d03B51f5D319'],
   /**LINK-USDT */ ['0x0E7A488886e57EE3d7d33d96Cf5fD6BdF070BCdb', '0xb2fc6f780f46205359516a02B85DFA9DaEc29E50', '0x890637dFE5dDe056729Acc788379b5258D871178']
    ])
        
}
export const stableswap = {
    factory : '0x54Fdd4670e0ceAA801c03E8775C04a4860391644',
    pools : new DoubleMap(['0xb2fc6f780f46205359516a02B85DFA9DaEc29E50','0x8047FD785B4C828fb30B56AafC2dcf5E27CA3780', '0xf5b87A616De1d277668AE2FC5d6b0003566192c6'])
}

export const lending = {
    pool:'0x775C0C0E7E59D97c093005613509fb831A57EBBD'
}

export const tokens = [
    {
        address :'0xaC220bDa95B3f97fA812Af0899acC2256752FD1A' ,
        name : 'CHZ',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4066.png',
        abi: mockChz.abi
    },
    {
        address :'0xb3Ea499b10Cc09Eb9e75e269E0C03b3f90aC04BF' ,
        name : 'COMP',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png',
        abi: mockComp.abi
    },
    {
        address :'0x0E7A488886e57EE3d7d33d96Cf5fD6BdF070BCdb' ,
        name : 'LINK',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
        abi: mockLink.abi
    },
    {
        address :'0xb2fc6f780f46205359516a02B85DFA9DaEc29E50' ,
        name : 'USDT',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        abi: mockUsdt.abi
    },
    {
        address :'0x8047FD785B4C828fb30B56AafC2dcf5E27CA3780' ,
        name : 'USDC',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
        abi: mockUsdc.abi
    }
]

export const stableTokens = [
    {
        address :'0xb2fc6f780f46205359516a02B85DFA9DaEc29E50' ,
        name : 'USDT',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        abi: mockUsdt.abi
    },
    {
        address :'0x8047FD785B4C828fb30B56AafC2dcf5E27CA3780' ,
        name : 'USDC',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
        abi: mockUsdc.abi
    }
]

export const lendingTokens = [
    {
        address :'0xb2fc6f780f46205359516a02B85DFA9DaEc29E50' ,
        name : 'USDT',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        abi: mockUsdt.abi
    },
    {
        address :'0x0E7A488886e57EE3d7d33d96Cf5fD6BdF070BCdb' ,
        name : 'LINK',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
        abi: mockLink.abi
    }
]