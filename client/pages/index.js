import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from "next/link"
import { useState , useEffect } from 'react'
import { useWeb3 } from './Context/Web3Provider'

export default function Home(props) {
  const wallet = useWeb3()
  const [color , setColor] = useState(false)
  
  const changeColor=()=>{
      if(window.scrollY>90){
        setColor(true)
          
      }else{
        setColor(false)
          
      }
  }
  
  useEffect(()=>{
    console.log(localStorage.getItem("isWalletConnected",true))
    wallet.forgetWallet()
    window.addEventListener("scroll" , changeColor) })
  
  

  return(
    <div className='h-screen bg-gradient-to-r from-teal-400 via-purple-500 to-fuchsia-600 '>
      <div className={!color ? "pt-8 flex w-screen py-4 sticky text-white top-0 px-10 justify-between" : "sticky top-0 px-8 flex w-screen py-2 bg-white  justify-between"}>
        <h1 className=' text-inherit font-nunito font-bold text-4xl'>AAFE</h1>
        <Link href="/loans">
          <button
          className={!color ? "bg-white  cursor-pointer text-center text-black font-nunito px-4 rounded-lg " : " cursor-pointer text-center bg-slate-800 mr-4 font-nunito rounded-lg  px-4 text-white"}>
            Launch app
          </button>   
        </Link>
      </div>
      <div className='container  mx-8 md:mx-24 my-16'>
        <img 
        alt="logo"
        src="https://aave.com/aaveGhost.svg"/>
        <h1 className='text-xl mt-8 text-white '>AAFE LIQUIDITY PROTOCOL</h1>
        <h2 className='text-3xl text-white mt-8 font-bold '>Earn interest , borrow assets, and</h2>
        <h2 className='text-3xl text-white font-bold '>build applications</h2>
      </div>
      <div className='w-screen flex  h-screen bg-slate-800'>
        <div className='mx-8 md:mx-24 my-16 space-y-2'>
        <h1 className='text-white  text-2xl md:text-5xl'>$1,00002,272.88</h1>
        <p className='text-white'>of liquidity is locked in Aafe</p>
        </div>
      </div>
      
       
      
    </div>
  )
    
  
}
