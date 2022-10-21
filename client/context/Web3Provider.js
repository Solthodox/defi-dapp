import { useContext, createContext } from 'react'
import {useState , useEffect} from 'react'
import { ethers } from 'ethers'
import Web3Modal from  'web3modal'
const Web3Context = createContext()
const CHAIN_ID = '4002'

export function useWeb3(){
    return useContext(Web3Context)
}

export function Web3Provider({children}){
    const [provider, setProvider] = useState()
    const [signer, setSigner] = useState()
    const [address , setAddress] = useState()


    useEffect(()=>{
        if(localStorage.getItem('connected')===true) connect();
        window.ethereum?.on('accountsChanged' , accounts => {connect()})
    },[provider])

    const connect = async()=>{
        if(!window.ethereum){
            alert("Install metamask!")
            throw new Error("Metamask not installed!")
        }
        const w3modal = new Web3Modal()
        const connection = await w3modal.connect()
        const chainId = await window.ethereum.request({
            method: 'eth_chainId',
          });

        if (chainId!=CHAIN_ID) switchNetwork();

        const ethersProvider = new ethers.providers.Web3Provider(connection)
        const ethersSigner = ethersProvider.getSigner()
        const ethersAddress = await ethersSigner.getAddress()

        setProvider(ethersProvider)
        setSigner(ethersSigner)
        setAddress(ethersAddress)

        localStorage.setItem('connected',true)
    }

    const forget =()=> {
        setProvider()
        setSigner()
        setAddress()
        localStorage.setItem('connected', false)
    }

    const switchNetwork = async()=>{
        try{
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: CHAIN_ID }],
            })
            window.location.reload()
        }catch{
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: CHAIN_ID,
                    rpcUrls: ['https://rpc.testnet.fantom.network'],
                    chainName: 'Fantom Testnet',
                    nativeCurrency: {
                        name: 'FTM',
                        symbol: 'FTM',
                        decimals: 18
                    },
                    blockExplorerUrls: ['https://testnet.ftmscan.com']
                }]
            })
        }
    }

    return (
        <Web3Context.Provider value={{connect, forget, provider, signer, address}} >
            {children}
        </Web3Context.Provider>
    )
}


