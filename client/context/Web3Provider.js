import {useState, useEffect, useContext, createContext} from "react"
import Web3Modal from 'web3modal'
import {ethers} from "ethers"
import React from "react"
const Web3Context = createContext()

export function useWeb3(){
    return useContext(Web3Context)
}

export function Web3Provider({children}) {
  const [provider , setProvider] = useState()
  const [signer , setSigner] = useState()
  const [address , setAddress] = useState()

  const connect = async() => {
    if(window.ethereum){
      try{
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });
        console.log(chainId)
        if(chainId!='0xfa2'){

          try{
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xfa2' }],
              });
              window.location.reload();
          }catch{
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                  chainId: "0xfa2",
                  rpcUrls: ["https://rpc.testnet.fantom.network"],
                  chainName: "Fantom Testnet",
                  nativeCurrency: {
                      name: "FTM",
                      symbol: "FTM",
                      decimals: 18
                  },
                  blockExplorerUrls: ["https://testnet.ftmscan.com"]
              }]
            })
          }
         
        }

        const ethersProvider = new ethers.providers.Web3Provider(connection)
        const ethersSigner = ethersProvider.getSigner()
        const ethersAccount = await ethersSigner.getAddress()
        
        
        setProvider(ethersProvider)
        setSigner(ethersSigner)
        setAddress(ethersAccount)
        
        localStorage.setItem("isWalletConnected",true)
        console.log("Connected")
      }catch(e){
        console.log(e)
      }
    }else alert("Please install Metamask")
  }

  const forget = async() => {
    setProvider()
    setAddress()
    setSigner()
    localStorage.setItem("isWalletConnected",false)
  }

  useEffect(()=>{

    if(!provider && localStorage?.getItem("isWalletConnected",true)==='true') connect()
    
    window.ethereum?.on("accountsChanged" , (accounts)=>{
      connect()
    })

  },[provider])
    
  return (
    <Web3Context.Provider value={{connect, signer, provider, address, forget}}>
      {children}
    </Web3Context.Provider>
  )
}