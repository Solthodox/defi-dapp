import {useState, useEffect , createContext, useContext} from "react"
import {ethers} from "ethers"
import Web3Modal from 'web3modal'


const Web3Context = createContext()

export  function useWeb3() {
    return useContext(Web3Context)
}
export  function Web3Provider({children}) {

    const [provider , setProvider] = useState()
    const [signer , setSigner] = useState()
    const [address , setAddress] = useState()


    async function connect() {
        console.log("Connecting...")
        try{
          const web3Modal = new Web3Modal()
          const connection = await web3Modal.connect()
          const ethersProvider = new ethers.providers.Web3Provider(connection)
          const ethersSigner = ethersProvider.getSigner()
          const ethersAccount = await ethersSigner.getAddress()
          
          console.log("Success! Connected!")
          setProvider(ethersProvider)
          setSigner(ethersSigner)
          setAddress(ethersAccount)
          localStorage.setItem("isWalletConnected",true)
         
        }catch{
          
        }
    }

    function forgetWallet(){
        setProvider()
        setAddress()
        setSigner()
        localStorage.setItem("isWalletConnected",false)
        
    
      }
      
     
    
    useEffect(()=>{
      if(!provider && localStorage?.getItem("isWalletConnected",true)==='true'){
        connect()
      }
      provider?.on("accountsChanged" , (accounts)=>{
        connect()
      })

    },[provider])
    
    return (
        <Web3Context.Provider value={{provider , signer , address , connect , forgetWallet}}>
            {children}
        </Web3Context.Provider>
      
    )
}

