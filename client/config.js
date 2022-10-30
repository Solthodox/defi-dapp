import mockComp from './abis/contracts/MockTokens.sol/mockComp.json'
import mockChz from './abis/contracts/MockTokens.sol/mockChz.json'
import mockLink from './abis/contracts/MockTokens.sol/mockLink.json'
import mockUsdt from './abis/contracts/MockTokens.sol/mockComp.json'
export class DoubleMap{
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
    factory : '0xe7f944a75c1A6E5Ce5130CD6Cd7495354f0E2ACc',
    pools : new DoubleMap([
    ['0x9FeFbC7Aa21c7A483ccE3323e1a9b7Cd858E7769', '0xDd5f149f7bD9d0aA32C38B9588138edF380E9F9B', '0xB911f76D4f6A7763e3Fb22977CAF7021707bd4d0'],
    ['0x9FeFbC7Aa21c7A483ccE3323e1a9b7Cd858E7769', '0xBb8b6E03E34CfDBF2324C47d959C7Ef6Ad9d3425', '0x196F8710a2CA2b926574374E8DB8e53Aef60cDFC'],
    ['0x9FeFbC7Aa21c7A483ccE3323e1a9b7Cd858E7769', '0xF9294ff89d894173D66e2B27f000D836f8aa014d', '0x28a66fd26ad3d9fB84008fdFD3b6f4534fA4c633'],
    ['0xDd5f149f7bD9d0aA32C38B9588138edF380E9F9B', '0xF9294ff89d894173D66e2B27f000D836f8aa014d', '0x677E28BE2b8561dB253206de271602cB6Fd0d31C'],
    ['0xBb8b6E03E34CfDBF2324C47d959C7Ef6Ad9d3425', '0xF9294ff89d894173D66e2B27f000D836f8aa014d', '0xd815814Fb4f61FF25e0c942d82989AaAEC2c4564'],
    ['0xBb8b6E03E34CfDBF2324C47d959C7Ef6Ad9d3425', '0xDd5f149f7bD9d0aA32C38B9588138edF380E9F9B', '0x14A4f52Ea87bc0DceF81aeCB07b80c6A3dde6793']
    ])
        
}


export const tokens = [
    {
        address :'0xF9294ff89d894173D66e2B27f000D836f8aa014d' ,
        name : 'CHZ',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4066.png',
        abi: mockChz.abi
    },
    {
        address :'0x9FeFbC7Aa21c7A483ccE3323e1a9b7Cd858E7769' ,
        name : 'COMP',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png',
        abi: mockComp.abi
    },
    {
        address :'0xBb8b6E03E34CfDBF2324C47d959C7Ef6Ad9d3425' ,
        name : 'LINK',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
        abi: mockLink.abi
    },
    {
        address :'0xDd5f149f7bD9d0aA32C38B9588138edF380E9F9B' ,
        name : 'USDT',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        abi: mockUsdt.abi
    }
]

