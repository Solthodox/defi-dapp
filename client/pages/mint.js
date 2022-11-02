import Header from "./components/Header"
import Footer from './components/Footer'
import { tokens } from "../config"
import { ethers } from "ethers"
import { useWeb3 } from "../context/Web3Provider"
import { useState } from "react"
export default function Mint() {
    const [selected , setSelected] = useState(tokens[0])
    const wallet = useWeb3()
    const styles={
        main: 'w-full h-screen flex flex-col justify-between',
        container: 'flex flex-col items-center mb-36',
        box: 'py-16 px-8 flex flex-col items-center rounded-md bg-d dark:bg-l text-l dark:text-d my-32',
        form: 'rounded-md border border-l/30 dark:border-d/30',
        select:'w-18 bg-d dark:bg-l outline-none cursor-pointer rounded-md px-2 py-4',
        input:'rounded-md outline-none px-4 dark:bg-l bg-d text-l dark:text-d' ,
        option: 'dark:bg-l bg-d text-l dark:text-d rounded-p-4',
        button: 'w-full mt-8 text-d dark:text-l px-16 py-4 rounded-md dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-500 to-yellow-100'      
    }
    const mint = async(e)=>{
        e.preventDefault()
        if(!wallet.provider) wallet.connect();
        const instance = new ethers.Contract(selected.address, selected.abi, wallet.signer)
        console.log(instance)
        const tx = await instance.mint()
        await tx.wait()
    } 
  return (
    <div className={styles.main}>
        <Header/>
        <div className={styles.container}>
            <div className={styles.box}>
            <h1>Get you 20 billion tokens to play around ;)</h1>
                <select onChange={e=>setSelected(JSON.parse(e.target.value))} className={styles.select}>
                    <option value={JSON.stringify(tokens[0])}  className={styles.option}>CHZ</option>
                    <option value={JSON.stringify(tokens[1])}  className={styles.option}>COMP</option>
                    <option value={JSON.stringify(tokens[2])}  className={styles.option}>LINK</option>
                    <option value={JSON.stringify(tokens[3])}  className={styles.option}>USDT</option>
                    <option value={JSON.stringify(tokens[4])}  className={styles.option}>USDC</option>
                </select>
                <button onClick={mint} className={styles.button}>Mint</button>
            </div>
        </div>
        <Footer />
    </div>
  )
}

