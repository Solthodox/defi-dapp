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
    ['0x9FeFbC7Aa21c7A483ccE3323e1a9b7Cd858E7769', '0x6AFBC0b640eaf1A0Fe57E750a03e6Cb781caD6Ec', '0x125bC53C50aF587A1794007FFE04Fc1449c85ced'],
    ['0x9FeFbC7Aa21c7A483ccE3323e1a9b7Cd858E7769', '0x081fC32CDD9705a6191e41C1B69386876aD6a88E', '0x413b63b1b11183863a5eE7701a7AaFEDE5B139e7'],
    ['0x9FeFbC7Aa21c7A483ccE3323e1a9b7Cd858E7769', '0xF9294ff89d894173D66e2B27f000D836f8aa014d', '0x289A56e04EfdAfAB48aA13eeFB351142DbB4D4A7'],
    ['0x6AFBC0b640eaf1A0Fe57E750a03e6Cb781caD6Ec', '0xF9294ff89d894173D66e2B27f000D836f8aa014d', '0xDb69c7e63445DB3d08A96590F30D9Cd75ebCf810'],
    ['0x081fC32CDD9705a6191e41C1B69386876aD6a88E', '0xF9294ff89d894173D66e2B27f000D836f8aa014d', '0xFb74c2eC012ADc70F48B472968cD3eD612a3aDeC'],
    ['0x081fC32CDD9705a6191e41C1B69386876aD6a88E', '0x6AFBC0b640eaf1A0Fe57E750a03e6Cb781caD6Ec', '0xb9d19eC43fd546009B10c5D75F514505b1Ac99f2']
    ])
        
}
console.log(dex.pools.get('0x9FeFbC7Aa21c7A483ccE3323e1a9b7Cd858E7769','0x6AFBC0b640eaf1A0Fe57E750a03e6Cb781caD6Ec'))

export const tokens = [
    {
        address :'0xF9294ff89d894173D66e2B27f000D836f8aa014d' ,
        name : 'CHZ',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4066.png'
    },
    {
        address :'0x9FeFbC7Aa21c7A483ccE3323e1a9b7Cd858E7769' ,
        name : 'COMP',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png'
    },
    {
        address :'0x081fC32CDD9705a6191e41C1B69386876aD6a88E' ,
        name : 'LINK',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png'
    },
    {
        address :'0x6AFBC0b640eaf1A0Fe57E750a03e6Cb781caD6Ec' ,
        name : 'USDT',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png'
    }
]

