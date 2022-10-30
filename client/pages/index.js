import { dex, tokens } from '../config'
import Header from './components/Header'
import Pair from '../abis/contracts/Dex/Pair.sol/Pair.json'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import {MdSwapVert} from "react-icons/md"
import {useWeb3} from "../context/Web3Provider"

export default function Home() {
  const styles = {
    main: 'h-screen w-full',
    container: 'flex flex-col items-center',
    box: 'py-16 px-8 flex flex-col items-center rounded-md bg-d dark:bg-l text-l dark:text-d my-32',
    form: 'rounded-md border border-l/30 dark:border-d/30',
    select:'w-18 bg-d dark:bg-l outline-none cursor-pointer rounded-md px-2 py-4',
    input:'rounded-md outline-none px-4 dark:bg-l bg-d text-l dark:text-d' ,
    option: 'dark:bg-l bg-d text-l dark:text-d',
    button: 'w-full mt-8 text-d dark:text-l px-16 py-4 rounded-md dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-500 to-yellow-100'
  }
  const [selectedTokens, setSelectedTokens] = useState([tokens[1],tokens[3]])
  const [exchangeRate, setExchangeRate] = useState({dy:'0.00', slippage:''})
  const wallet = useWeb3()
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [node, setNode] = useState()
  const [amountIn, setAmountIn] = useState('0.00')
  const [pool, setPool] = useState('0x125bC53C50aF587A1794007FFE04Fc1449c85ced')
  const [_tokens, setTokens] = useState()


  const getData = async()=>{
    const node = new ethers.providers.JsonRpcProvider('https://rpc.testnet.fantom.network')
    setNode(node)
    setTokens(tokens)
    setLoadingState('loaded')
  } 

  const swap = async(token0, token1) => {
    
  } 

  const getPool =  (token0, token1) => {
    setSelectedTokens([token0, token1])
    setPool(dex.pools.get(token0.address, token1.address))
    updateExchangeRate()
  }

  const updateExchangeRate = async() =>{
    if(!parseInt(amountIn)>0){
      return 
    }
    const pairInstance = new ethers.Contract(pool,Pair.abi, node)
    const _r0 = await pairInstance._reserves(selectedTokens[0].address) 
    const _r1 = await pairInstance._reserves(selectedTokens[1].address) 
    const r0 = parseFloat(r0)
    const r1 = parseFloat(r1)
    console.log(r1/r0)
    const dy = r1 * parseInt(amountIn) / (r0 + parseInt(amountIn))
    
   
  }
  const switchSelected= async() => {
    setSelectedTokens(selectedTokens.reverse());  
    setTokens(_tokens.map((t,i) =>_tokens[i]))
  }

  useEffect(()=>{
    getData()
    console.log(selectedTokens)
    console.log(pool)
  },[])
  if(loadingState==='loaded') return (
    <div className={styles.main}>
      <Header />
        <div className={styles.container}>
        <div className={styles.box}>
         <div className={styles.form}>
         <select onChange={e=>getPool(JSON.parse(e.target.value), selectedTokens[1])} className={styles.select}>
            {_tokens.map((token,i) => 
              token === selectedTokens[0] 
              ? <option key={i} value={JSON.stringify(token)} selected className={styles.option}>{token.name}</option>
              :  <option key={i} value={JSON.stringify(token)} className={styles.option}>{token.name}</option>)}

          </select>
          <input onChange={e=>{setAmountIn(e.target.value); updateExchangeRate()}} type='text' placeholder='0.00' className={styles.input}></input>
         </div>
          <MdSwapVert className='h-8 my-4 flex justify-center cursor-pointer w-8' onClick={switchSelected} />
          <div className={styles.form}>
            <select onChange={e=>getPool(selectedTokens[0], JSON.parse(e.target.value))}  className={styles.select}>
            {_tokens.map((token,i) => 
              token === selectedTokens[1]
              ?  <option key={i} value={JSON.stringify(token)} selected className={styles.option}>{token.name}</option>
              :  <option key={i} value={JSON.stringify(token)} className={styles.option}>{token.name}</option>)}

            </select>
            <input type='text' value={exchangeRate.dy} disabled className={styles.input}></input>
          </div>
          <span className='text-l/30'>Slippage: {exchangeRate.dy}%</span>
          {wallet.provider 
          ? <button onClick={()=>swap(selectedTokens[0], selectedTokens[1])} className={styles.button}>Swap</button>
          : <button onClick={wallet.connect} className={styles.button}  >Swap</button>
          }
          

        </div>
      </div>

      
      
    </div>
  )
}
