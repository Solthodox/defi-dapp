import { useEffect, useState } from 'react'
import Image from 'next/image'
import { lendingTokens, tokens } from '../../config'
import Lending from '../../abis/contracts/Lending/Lending.sol/Lending.json'
import { ethers } from 'ethers'
import { useWeb3 } from '../../context/Web3Provider'
export default function LendingInterface() {
    const wallet = useWeb3()
    const [assets, setAssets] = useState({})
    const [loadingState, setLoadingState] = useState('not-loaded')
    const styles = {
        network: 'flex space-x-2 items-center my-8 justify-start w-full px-32 rounded-md',
        title: 'font-bold text-2xl',
        userData:' w-full flex flex-wrap',
        market : 'w-full flex flex-wrap my-16',
        box: 'w-1/2 ',
        container:'rounded-md mx-4 px-4 bg-l dark:bg-d py-2',
        button: 'font-bold rounded-md px-8 py-2 bg-d/50 dark:bg-l/50'
    }

    const fetchAssets =async () => {
        const instance = new ethers.Contract('0x775C0C0E7E59D97c093005613509fb831A57EBBD', Lending.abi, wallet.signer)
        
        setAssets(instance)
        setLoadingState('loaded')
    }

    useEffect(()=>{
        fetchAssets()
    },[])

    
    if(loadingState==='loaded') return (
    <>
        <div className={styles.network}>
            <Image className='rounded-full' src='/ftm.png' height={50} width={50}></Image>
            <h1 className={styles.title}>Fantom Testnet</h1>
        </div>
        <div className={styles.userData}>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Your supplies</h1>
                    {lendingTokens.map((asset, i) => (
                        <div>{asset.name}</div>
                     ))
                    }
                </div>
                
            </div>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Your borrows</h1>
                </div>
                
            </div>

        </div>
        <div className={styles.market}>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Assets to supply</h1>
                    {lendingTokens.map(token=>(
                        <div className='flex w-full my-2 justify-between items-center'>
                            <img src={token.logo} height={30} width={30} />
                            <span className='font-bold'>{token.name}</span>
                            <button className={styles.button}>Supply</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Assets to borrow</h1>
                    {lendingTokens.map(token=>(
                        <div className='flex w-full my-2 justify-between items-center'>
                            <img src={token.logo} height={30} width={30} />
                            <span className='font-bold'>{token.name}</span>
                            <button className={styles.button}>Borrow</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
  )
}

