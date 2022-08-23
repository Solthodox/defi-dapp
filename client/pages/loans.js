import {ethers} from "ethers"
import Header from "./components/Header"
import Image from "next/image"
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { useEffect , useState } from 'react';
import { lendingAddress , tokenData, tokensByIndex } from "../config";
import Lending from "../../src/artifacts/contracts/Lending.sol/Lending.json"
import ERC20 from "../../src/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json"
import Skeleton from '@mui/material/Skeleton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DepositForm from "./components/DepositForm";
import toast , {Toaster} from  "react-hot-toast"
import BorrowForm from "./components/BorrowForm";
import RepayForm from "./components/RepayForm";
import {useWeb3} from "./Context/Web3Provider";
import Link from "next/dist/client/link";


export default function Loans(){
    const wallet = useWeb3()
    const style = {
        container : "container mx-8 md:mx-24",
        strongButton :"p-2 rounded-md bg-orange-50 border border-gray-200",
        lightButton: "p-2 rounded-md bg-orange-20 border border-gray-200"
    }
    const [processing , setProcessing] = useState(false)
    const [showDepositForm , setShowDepositForm] = useState({show : false , input : ""})
    const [showBorrowForm , setShowBorrowForm] = useState({show : false , input : ""})
    const [showRepayForm , setShowRepayForm] = useState({show : false , input : ""})
    const [showBorrow , setShowBorrow] = useState(true)
    const [showSupply , setShowSupply] = useState(true)
    const [hideHeader , setHideHeader] = useState(false)
    const [dashboard , setDashboard] = useState([])
    const [total , setTotal] = useState({deposited : 0 , borrowed : 0})
    const [loadingState , setLoadingState] = useState("not-loaded")
  
    const ShowHeader=()=>{
        if(window.scrollY>90){
          setHideHeader(true)
            
        }else{
            setHideHeader(false)
            
        }
    }

    function closeForms(){
        setShowDepositForm({state : false , input:""})
        setShowBorrowForm({state : false , input:""})
    }
    

    async function loadLendingData(){
        setLoadingState("not-loaded")
        const instance = new ethers.Contract(lendingAddress , Lending.abi , wallet.signer)
        const totalDeposited = await instance.getAccountCollateralValue(wallet.address)
        const  totalBorrowed = await instance.getAccountBorrowedValue(wallet.address)
        let tokens  = []
        let healthFactor=0

       
        for (const tokenSymbol in tokenData ){
            console.log(typeof tokenSymbol)
            console.log(tokenData[tokenSymbol])
            const depositedAmount = await instance.getDeposited(wallet.address , tokenData[tokenSymbol].tokenAddress);
            const borrowedAmount = await instance.getBorrowed(wallet.address , tokenData[tokenSymbol].tokenAddress);
            
            let depositedValue
            let borrowedValue
            if(depositedAmount==0){
                depositedValue=0
            }else{
                depositedValue = await instance.getTokenValueFromUSD(tokenData[tokenSymbol].tokenAddress , depositedAmount)
                console.log(`${tokenSymbol} : ${depositedValue}`)
               
            }
            
            if(borrowedAmount==0){
                borrowedValue=0
            }else{
                borrowedValue = await instance.getTokenValueFromUSD(tokenData[tokenSymbol].tokenAddress , borrowedAmount)
                healthFactor = await instance.healthFactor(wallet.address)
            }
           
           
            const _tokenData = {
                symbol : tokenData[tokenSymbol].symbol,
                address : tokenData[tokenSymbol].tokenAddress ,
                deposited : {amount : depositedAmount , value : 1/depositedValue } ,
                borrowed : {amount : borrowedAmount , value : 1/borrowedValue }
            }
            tokens.push(_tokenData)
        }
        setDashboard(tokens)
        setTotal({deposited : totalDeposited , borrowed : totalBorrowed , healthFactor : healthFactor/(10**18)})
        setLoadingState("loaded")
        console.log(dashboard)
       
        

    }

    async function deposit(contractInstance , amount){
        try{
            setProcessing(true)
            console.log("Depositing...")

            const instance  = new ethers.Contract(lendingAddress , Lending.abi , wallet.signer)
            const tokenAmount = ethers.utils.parseUnits(amount.toString() ,"ether" )

            const approve = await contractInstance.approve(lendingAddress , tokenAmount)
            await approve.wait()

            const tx = await instance.deposit( contractInstance.address ,  tokenAmount)
            await tx.wait()

            handleSuccess(tokenSymbol , "deposit")
            console.log("Done!")
            closeForms()
            setProcessing(false)
            loadLendingData()


        }catch(e){
            console.log("Error ==>> ", e)
            setProcessing(false)
            handleError()
            

        }
    }

    async function borrow(tokenSymbol , amount){
        try{
            setProcessing(true)
            console.log("Borrowing...")

            const instance  = new ethers.Contract(lendingAddress , Lending.abi , wallet.signer)
            const tokenAmount = ethers.utils.parseUnits(amount.toString() ,"ether" )

            const tx = await instance.borrow( tokensByIndex[tokenSymbol].tokenAddress, tokenAmount)
            await tx.wait()

            handleSuccess(tokensByIndex[tokenSymbol].symbol , "borrow")
            console.log("Done!")
            closeForms()
            setProcessing(false)
            loadLendingData()


        }catch(e){
            console.log("Error ==>> ", e)
            setProcessing(false)
            handleError()
        }

    }

    async function withdraw(tokenAddress , amount){
        
        try{
            console.log("Withdrawing...")
            const instance  = new ethers.Contract(lendingAddress , Lending.abi , wallet.signer)
            const tx = await instance.withdraw( tokenAddress, amount)
            await tx.wait()
            console.log("Done!")
            handleSuccess( "", "withdraw")
            await loadLendingData()


        }catch(e){
            console.log("Error =>> ", e)
            handleError()
            

        }
    }

    

    const handleSuccess = (symbol , action ,  toastHandler = toast)=>{
       
            if(action == "deposit"){
                 toastHandler.success(
                `${symbol} successfully deposited!` ,
                {style : {
                  background : '#fff',
                  color : '#04111d'
                }}
              )
            }
            else if(action == "borrow"){
                toastHandler.success(
               `${symbol} successfully borrowed!` ,
               {style : {
                 background : '#fff',
                 color : '#04111d'
               }}
             )
           }
           else if(action == "withdraw"){
            toastHandler.success(
           `${symbol} successfully withdrawed!` ,
           {style : {
             background : '#fff',
             color : '#04111d'
           }}
         )
       }
            
        
        
    
    }
    const handleError= ( toastHandler = toast)=>{
    
        toastHandler.error(
            "Oops! Something went wrong...",
          {style : {
            background : '#fff',
            color : '#04111d'
          }}
        )
    
      }
  
    useEffect(()=>{
        if(wallet.provider && tokenData){
            loadLendingData()
            console.log(dashboard)
        }
    } , [wallet.provider])

    useEffect(()=>{window.addEventListener("scroll" , ShowHeader)})


    
    return(
        <div className={`bg-[#363959] h-screen ${(showBorrowForm.show || showDepositForm.show) && 'lock-scroll' }`}>
            {showDepositForm.show ?
                <DepositForm 
                selectedSymbol={showDepositForm.input}
                processing={processing}
                close={closeForms}
                submit={(address , amount)=>{deposit(address, amount)}}
                tokens={dashboard}
                /> 
            : showBorrowForm.show ? 
                <BorrowForm
                collateral={total}
                tokenData={dashboard}
                processing={processing}
                close={closeForms}
                selectedSymbol={showBorrowForm.input}
                submit={(address , amount)=>{borrow(address, amount)}}
                />
            : showRepayForm.show ? (
                <RepayForm
                collateral={total}
                tokenData={dashboard}
                processing={processing}
                close={closeForms}
                selectedSymbol={showBorrowForm.input}
                submit={(address , amount)=>{repay(address, amount)}}
                />
            ) : (<></>)

            }
            
            {
            !hideHeader &&  
                <Header
                selected="Loans"
                />
            }
            <div className={style.container}>
            
                <div className="flex items-end mt-16 space-x-4">
                    <Image className="rounded-full" width={30} height={30} src="/eth-logo.png" />
                    <h1 className="text-white text-4xl font-bold">Avalanche testnet</h1>
                </div>
                <div className="flex w-full space-x-8">
                <div className="flex items-end mt-8 space-x-4">
                    <div className="p-2 bg-[#4d4e5d] rounded-xl border border-gray-500">
                        <AccountBalanceWalletIcon
                         sx={{ color: "gray"}}
                         className="w-6 h-6"
                            />
                    </div>
                    
                    <div className="h-full">
                        <p className="text-gray-500">Net Worth</p>
                        {loadingState==="loaded" ? (
                            <p className="text-white font-bold">
                                USD {          
                                     ( (total.deposited - total.borrowed)/(10**8) ).toFixed(2)
                                }
                            </p>
                        ) : (
                             <Skeleton className="h-12 w-16" variant="text" sx={{ fontSize: '1rem' , heigth :"10px" , width:"50px"}} />
                        )}
                    </div>
                   
                </div>

                <div className="flex items-end mt-8 space-x-4">
                    <div className="p-2 bg-[#4d4e5d] rounded-xl border border-gray-500">
                        <SignalCellularAltIcon
                         sx={{ color: "gray"}}
                         className="w-6 h-6"
                            />
                    </div>
                    
                    <div className="h-full">
                        <p className="text-gray-500">Net APY</p>
                        {loadingState==="loaded" ? (
                            <p className="text-white font-bold">0 %</p>
                        ) : (
                             <Skeleton className="h-12 w-16" variant="text" sx={{ fontSize: '0.5rem' }} />
                        )}
                        
                    </div>
                   
                </div>
                </div>
     
            </div>
            
            <div className='w-full mt-24 flex justify-center bg-orange-50 h-screen'>
                {wallet.provider ? (
                    <div className="w-10/12 flex">
                        <div className="flex flex-col items-center  w-1/2 p-2">
                            <div className="w-full relative bottom-12 rounded-md  border border-gray-300  bg-white">
                                <h2 className="w-full text-xl font-semibold m-4">Your supplies</h2>
                                <table className="w-full">
                                    <tr className="w-full flex justify-between px-8">
                                        <th className="text-sm text-gray-400">Assets</th>
                                        <th className="text-sm text-gray-400">Amount</th>
                                        <th className="text-sm text-gray-400">Value</th>
                                        <th className="text-sm text-gray-400"></th>
                                    </tr>
                                {dashboard && dashboard
                                    .filter(token => (parseInt(token.deposited.amount)/(10**18)).toFixed(2) >0)
                                    .map((token , i) => (
                                        <tr key={i} className="border-t border-gray-200 flex justify-between p-4 items-center " >
                                            <td className="flex items-center">
                                                <img className="h-10 w-10 mr-4 rounded-full" src={tokensByIndex[i].logo} />
                                                <p className="font-semibold">{token.symbol}</p>
                                            </td>
                                            <td><p>{(parseInt(token.deposited.amount)/(10**18)).toFixed(2)}</p></td>
                                            <td><p>USD {(parseInt(token.deposited.value)*100).toFixed(2)}</p></td>
                                            <td>
                                                <button 
                                                onClick={()=>{withdraw(token.address , token.deposited.amount )}}
                                                className={style.strongButton}>
                                                    Withdraw
                                                </button>
                                            </td>
                                            

                                        </tr>
                                    ))
                                }
                                </table>
                            </div>
                            <div className="w-full border relative bottom-8 border-gray-300 bg-white">
                            {showSupply ? (
                                    <div
                                    onClick={()=>setShowSupply(false)}
                                    className="flex cursor-pointer p-4 justify-between items-center">
                                        <h2 className="w-full text-xl font-semibold">Assets to supply</h2>
                                        <p className="text-gray-500 flex">Hide <RemoveIcon/> </p>
                                    </div>
                                ): (
                                    <div
                                    onClick={()=>setShowSupply(true)}
                                    className="flex cursor-pointer p-4 justify-between items-center">
                                        <h2 className="w-full text-xl font-semibold">Assets to supply</h2>
                                        <p className="text-gray-500 flex">Show <AddIcon/> </p>
                                    </div>
                                )}
                                {showSupply && dashboard.map( (token , i)=>(
                                    <div key={i} className="w-full flex justify-between items-center p-4">
                                        <div className="flex  items-center">
                                            <img className="h-10 w-10 mr-4 rounded-full" src={tokenData[dashboard[i].symbol].logo} />
                                            <p className="font-semibold">{token.symbol}</p>
                                        </div>
                                        <div className="flex space-x-4">
                                            <button 
                                                onClick={()=>{
                                                    setShowDepositForm({show : true , input:token.symbol})
                                                    console.log(showDepositForm)
                                                }}
                                                className={style.strongButton}>Supply</button>
                                            <button className={style.lightButton}>Details</button>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-1/2 p-2">
                            <div className="w-full relative bottom-12  rounded-md  border border-gray-300  bg-white"> 
                                <div className="w-full flex justify-between items-center">
                                    <h2 className="text-xl font-semibold m-4">Your Debts</h2>
                                    {(loadingState=="loaded" && total.borrowed>0) &&
                                    (<>
                                        {total.healthFactor>=2 ? 
                                        (
                                            <h2 className="text-gray-500 mx-4">Health Factor : <span className="font-bold text-green-500">Good</span> </h2>
                                        ) : 1.5<=total.healthFactor<=2 ? 
                                        (
                                            <h2 className="text-gray-500 mx-4">Health Factor : <span className="font-bold text-orange-500">Moderate</span> </h2>
                                            
                                        ) : (<h2 className="text-gray-500 mx-4">Health Factor : <span className="font-bold text-red-500">Liquidation danger</span> </h2>)
                                        
                                            }
                                    </>)}

                                </div>
                                
                                {dashboard && dashboard
                                    .filter ((token )=>(parseInt(token.borrowed.amount)/(10**18)).toFixed(2) >0)
                                    .map((token , i) => (
                                        <div key={i} className="w-full border-t border-gray-300 flex justify-between items-center p-4">
                                            <img className="h-10 w-10 mr-4 rounded-full" src={tokenData[dashboard[i].symbol].logo} />
                                            <p className="font-semibold">{token.symbol}</p>
                                            <p>{(parseInt(token.borrowed.amount)/(10**18)).toFixed(2)}</p>
                                            <p>USD {(parseInt(token.borrowed.value)/(10**18)).toFixed(2)}</p>
                                            <button 
                                            onClick={()=>setShowRepayForm({show:true , input:token.symbol})}
                                            className={style.strongButton}>
                                                Repay
                                            </button>

                                        </div>
                                        

                                    ))}
                            </div>
                            <div className="w-full border  relative bottom-8 border-gray-300 bg-white">
                                {showBorrow ? (
                                    <div
                                    onClick={()=>setShowBorrow(false)}
                                    className="flex cursor-pointer p-4 justify-between items-center">
                                        <h2 className="w-full text-xl font-semibold">Assets to borrow</h2>
                                        <p className="text-gray-500 flex">Hide <RemoveIcon/> </p>
                                    </div>
                                ): (
                                    <div
                                    onClick={()=>setShowBorrow(true)}
                                    className="flex cursor-pointer p-4 justify-between items-center">
                                        <h2 className="w-full text-xl font-semibold">Assets to borrow</h2>
                                        <p className="text-gray-500 flex">Show <AddIcon/> </p>
                                    </div>
                                )}
                                
                                
                                {showBorrow && 
                                dashboard.map( (token , i)=>(
                                    <div key={i} className="w-full flex justify-between items-center p-4">
                                    <div className="flex  items-center">
                                        <img className="h-10 w-10 mr-4 rounded-full" src={tokenData[dashboard[i].symbol].logo} />
                                        <p className="font-semibold">{token.symbol}</p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button 
                                            onClick={()=>setShowBorrowForm({show : true , input:i})}
                                            className={style.strongButton}>Borrow</button>
                                        <Link href={`/details/${token.symbol}`}><button className={style.lightButton}>Details</button></Link>
                                    </div>
                                </div>

                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-10/12 flex  p-2">
                        <div className="container justify-center items-center flex w-full relative bottom-12 bg-white  border border-gray-300 rounded-md">
                            <button 
                            onClick={()=>wallet.connect()}
                            className="cursor-pointer r px-3 text-white font-semibold hover:bg-white rounded-md py-1 bg-gradient-to-r from-teal-400 via-purple-500 to-fuchsia-600">
                                Connect wallet
                            </button>
                        </div>
                    </div>
                )}
                
            </div>
            <Toaster />
            
        </div>
        
    )

}
