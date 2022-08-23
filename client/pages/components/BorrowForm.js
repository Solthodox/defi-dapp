import  { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import "flowbite-react"
import ERC20 from "../../../src/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json"
import {tokenData , tokensByIndex} from "../../config";
import {ethers} from "ethers"
import { Indexes } from '../../config';
import Skeleton from '@mui/material/Skeleton';



export default function BorrowForm(props) {

    const [formInput , setFormInput] = useState({token :props.selectedSymbol , amount:0 , invalid:false})
    useEffect(()=>{
        if(((props.tokenData[props.selectedSymbol].deposited.value / props.tokenData[props.selectedSymbol].deposited.amount)*(formInput.amount/(10**10))).toFixed(2)*1.25 > (props.collateral.deposited/(10**8)).toFixed(2)) 
        setFormInput({...formInput , invalid:true})
        else{
            setFormInput({...formInput , invalid:false})
        }
    })
  
  return (
    <div className='w-full z-front bg-black/40  h-screen absolute flex flex-col  items-center'>
        <div className='fixed mt-36 pb-8  rounded-md border border-gray-300 z-front bg-white '>
            <div className='m-4 w-full'>
                <CloseIcon
                    onClick={props.close}
                    className='cursor-pointer' />
            </div>
            <h1 className='my-4 mb-16 mx-16 text-4xl font-bold w-full '>Borrow asset</h1>
            {!props.processing? (
                <div className='mx-8'>   
                        <div className='flex space-x-2 items-center'>
                            <img  className="h-6  w-6" src={tokensByIndex[props.selectedSymbol].logo}></img>
                            <p className='w-full my-4 text-black'>
                                { tokensByIndex[props.selectedSymbol].symbol}
                    
                            </p>
                        </div>
                        <p className='text-gray-500 my-2 font-semibold '>Amount:</p>
                        <input 
                        onChange={(e)=>{setFormInput({...formInput , amount:e.target.value})}}
                        type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />        
                  
                        <p className='text-gray-500 my-2 font-semibold'>
                            Borrowing : 
                            <span className='text-black'>
                                {(((props.tokenData[props.selectedSymbol].deposited.value / props.tokenData[props.selectedSymbol].deposited.amount)*formInput.amount)/(10**10)).toFixed(2)} USD
                            </span> 
                        </p>
                        <p className='text-gray-500 my-2 font-semibold'>
                            Collateral : 
                            <span className='text-black'>
                            {(props.collateral.deposited/(10**8)).toFixed(2)} USD
                            </span> 
                        </p>
                        {formInput.invalid && (
                            <p className='text-red-500'>Insufficient collateral</p>
                        )}
                        {!formInput.invalid? (
                            <button
                            onClick={()=>{ props.submit(formInput.token , formInput.amount)}} 
                            className='bg-[#363959] mt-16 text-xl text-white font-semibold hover:bg-[#363959]/80 py-2 px-8 rounded-md w-full'>
                                Borrow
                            </button> 
                        ) : (
                            <button disabled
                        // onClick={()=>{ props.submit(formInput.token , formInput.amount)}} 
                        className=' mt-16 text-xl text-white font-semibold bg-[#363959]/80 py-2 px-8 rounded-md w-full'>
                            Borrow
                        </button> 
                        )}
                        
                            
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

