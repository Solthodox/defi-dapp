import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import "flowbite-react"
import ERC20 from "../../../src/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json"
import { tokenData } from '../../config';
import {ethers} from "ethers"
import Skeleton from '@mui/material/Skeleton';
import {useWeb3} from '../Context/Web3Provider';
export default function DepositForm(props) {
    const wallet = useWeb3()
    const [formInput , setFormInput] = useState({token : props.selectedSymbol , amount:0})
    const [balance , setBalance] = useState(0)
    const [loadingState , setLoadingState] = useState("not-loaded")
    const [tokenContract , setTokenContract] = useState()

    async function getBalance(tokenSymbol){
        const data = tokenData
        setLoadingState("not-loaded")
        console.log("Fetching balance...")

        const tokenAddress = data[tokenSymbol].tokenAddress
        console.log(tokenAddress)
        const token = new ethers.Contract(tokenAddress , ERC20.abi , wallet.signer)

        const _balance = await token.balanceOf(wallet.address)


        setBalance(_balance/(10**18))
        setTokenContract(token)
        console.log(`Balance : ${_balance/(10**18)} ${tokenSymbol}`)
        setLoadingState("loaded")

    }

    useEffect(()=>{
        getBalance(props.selectedSymbol)
    },[props.selectedSymbol])
return (
    <div className='w-full z-front bg-black/40  h-screen absolute flex flex-col  items-center'>
        <div className='fixed mt-36 pb-8  rounded-md border border-gray-300 z-front bg-white '>
            <div className='m-4 w-full'>
                <CloseIcon
                    onClick={props.close}
                    className='cursor-pointer' />
            </div>
            <h1 className='my-4 mb-16 mx-16 text-4xl font-bold w-full '>Deposit supply</h1>
            {!props.processing? (
                <div className='mx-8'>   
                        <select 
                        className="block p-2 mb-6 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e)=>{setFormInput({...formInput , token : e.target.value}); getBalance(e.target.value)}}
                        >
                            {props.tokens.map((token , i ) => (
                                token.symbol==props.selectedSymbol ? <option selected>{token.symbol}</option> : <option >{token.symbol}</option>
                            ))}
                        </select>  
                            
                        <input 
                        onChange={(e)=>setFormInput({...formInput , amount:e.target.value})}
                        type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />        
                        <p className='font-semibold text-gray-400'>
                            Balance : {loadingState=="loaded" ? <span className="text-black">{balance.toFixed(2)}</span> : <span><Skeleton className="h-12 w-16" variant="text" sx={{ fontSize: '1rem' , heigth :"10px" , width:"50px"}}/> </span>} 
                        </p>
                        <button
                        onClick={()=> props.submit(tokenContract , formInput.amount)} 
                        className='bg-[#363959] mt-16 text-xl text-white font-semibold hover:bg-[#363959]/80 py-2 px-8 rounded-md w-full'>
                            Deposit
                        </button> 
                            
                </div>
            ):(
                <div className='mx-8'>   
                    <select disabled  className="block p-2 mb-6 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </select>     
                    <input disabled type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />        
                    <button disabled className=' mt-16 text-xl text-white font-semibold bg-[#363959]/80 py-2 px-8 rounded-md w-full'>Depositar</button> 
            
                </div>
            )}

        </div>
        
    </div>
  )
}



