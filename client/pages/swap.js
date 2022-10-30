import React from 'react'
import { dex } from '../config'
import { FactoryV1 } from "../abis/contracts/FactoryV1.sol/FactoryV1.json"
import Header from './components/Header'
import { useEffect, useState } from 'react'
import {MdSwapVert} from "react-icons/md"
import {useWeb3} from "../context/Web3Provider"
import { ethers } from 'ethers'
function swap() {
  const styles = {
    main: 'h-screen w-full',
    container: 'flex flex-col items-center',
    box: 'py-16 px-8 rounded-md bg-d dark:bg-l text-l dark:text-d my-32',
    select:'w-full outline-none',
    option: 'dark:bg-l bg-d',
    button: 'w-full text-d dark:text-l px-16 py-4 rounded-md dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-500 to-yellow-100'
  }
  const wallet = useWeb3()
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [pairs, setPairs] = useState()

  const getData = async()=>{
    const instance = new ethers.Contract(dex.factory , FactoryV1.abi , wallet.signer);
    const pairs = await instance.getAllPairs()
    setPairs(pairs)

  } 

  useEffect(()=>{
    getData()
  })

  return (
    <div className={styles.main}>
      <Header />
      {loadingState ==='loaded' && (
        <div className={styles.container}>
        <div className={styles.box}>
          <h1>Swap</h1>
          {pairs.map(p=> <h1>{p}</h1>)}
          
          <MdSwapVert />
          
          <button className={styles.button}>Swap</button>

        </div>
      </div>

      )}
      
    </div>
  )
}

export default swap