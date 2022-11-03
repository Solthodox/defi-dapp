import { useEffect, useState } from 'react'
import Image from 'next/image'
import { lendingTokens, tokens } from '../../config'
import Lending from '../../abis/contracts/Lending/Lending.sol/Lending.json'
import { ethers } from 'ethers'
import {IoMdClose} from 'react-icons/io'
import { useWeb3 } from '../../context/Web3Provider'
export default function LendingInterface() {
    const wallet = useWeb3()
    const [assets, setAssets] = useState({})
    const [showBorrow, setShowBorrow] = useState(false)
    const [showSupply, setShowSupply] = useState(false)
    const [showWithdraw, setShowWithdraw] = useState(false)
    const [health, setHealth] = useState()
    const [formInput, setFormInput] = useState({token:'', amount:'0.00'})
    const [loadingState, setLoadingState] = useState('not-loaded')
    const styles = {
        network: 'flex space-x-2 items-center my-8 justify-start w-full px-32 rounded-md',
        title: 'font-bold text-2xl text-l dark:text-d',
        userData:' w-full flex flex-wrap px-16',
        market : 'w-full px-16 flex flex-wrap my-16',
        box: 'w-1/2 ',
        container:'rounded-md mx-4 px-4 bg-d dark:bg-l py-4',
        button: ' text-d font-bold dark:text-l px-8 py-2 rounded-md dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-500 to-yellow-100',
        buttonDisabled: ' text-d/50 font-bold dark:text-l/50 px-8 py-2 rounded-md bg-l/70 dark:bg-d/70',
        windowButton: 'w-full  text-d font-bold dark:text-l px-8 py-2 rounded-md dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-500 to-yellow-100',
        input:'rounded-md outline-none px-4 dark:bg-l bg-d text-l dark:text-d' ,
    }
    const handleClickBorrow = e => {
        e?.preventDefault()
        setShowBorrow(!showBorrow)
    }

    const handleClickSupply = e => {
        e?.preventDefault()
        setShowSupply(!showSupply)
    }

    const handleClickWithdraw = e => {
        e?.preventDefault()
        setShowWithdraw(!showWithdraw)
    }

    const fetchAssets =async () => {
        const instance = new ethers.Contract('0x775C0C0E7E59D97c093005613509fb831A57EBBD', Lending.abi, wallet.signer)
        const borrowedUsdt = await instance.s_accountToTokenBorrows(wallet.address, lendingTokens[0].address)
        const depositedUsdt = await instance.s_accountToTokenDeposits(wallet.address, lendingTokens[0].address)
        const borrowedLink = await instance.s_accountToTokenBorrows(wallet.address, lendingTokens[1].address)
        const depositedLink = await instance.s_accountToTokenDeposits(wallet.address, lendingTokens[1].address)
        setAssets([
            [parseFloat(borrowedUsdt),parseFloat(depositedUsdt)], [parseFloat(borrowedLink),parseFloat(depositedLink)]
        ])
        const _health = await instance.healthFactor(wallet.address)
        setHealth(parseInt(_health))
        setLoadingState('loaded')
    }

    const borrow = async(e) =>{
        e.preventDefault()
    }
    const deposit = async(e) =>{
        e.preventDefault()
    }
    const repay = async() =>{}
    const withdraw = async() =>{}

    useEffect(()=>{
        fetchAssets()
        window.ethereum.on('accountsChanged',  accounts=> {
            setLoadingState('not-loaded')
            fetchAssets()
        })
    },[])

    
    if(loadingState==='loaded') return (
    <>
        {showBorrow===true && 
            <div className='min-h-screen absolute flex flex-col items-center justify-center bg-d/70 w-full'>
                <div className={styles.container}>
                    <IoMdClose className='cursor-pointer fill-l dark:fill-d' onClick={handleClickBorrow} />
                    <h1 className={styles.title}>Borrow asset</h1>
                    <h2>{formInput.token.name}</h2>
                    <div className='rounded-md flex p-2 border border-l dark:border-d my-4'> 
                        <img src={formInput.token.logo} width={30} height={30} />
                        <input className={styles.input} placeholder='0.00' type='number'></input>
                    </div>
                    <button onClick={borrow} className={styles.windowButton}>Borrow</button>
                </div>
            </div>
        }
        {showWithdraw===true && 
            <div className='min-h-screen absolute flex flex-col items-center justify-center bg-d/70 w-full'>
                <div className={styles.container}>
                    <IoMdClose className='cursor-pointer fill-l dark:fill-d' onClick={handleClickWithdraw} />
                    <h1 className={styles.title}>Withdraw asset</h1>
                    <h2>{formInput.token.name}</h2>
                    <div className='rounded-md flex p-2 border border-l dark:border-d my-4'> 
                        <img src={formInput.token.logo} width={30} height={30} />
                        <input className={styles.input} placeholder='0.00' type='number'></input>
                    </div>
                    <button onClick={withdraw} className={styles.windowButton}>Withdraw</button>
                </div>
            </div>
        }
        {showSupply===true && 
            <div className='min-h-screen absolute flex flex-col items-center justify-center bg-d/70 w-full'>
                <div className={styles.container}>
                <IoMdClose className='cursor-pointer fill-l dark:fill-d' onClick={handleClickSupply} />
                <h1 className={styles.title}>Supply asset</h1>
                <h2>{formInput.token.name}</h2>
                <div className='rounded-md flex p-2 border border-l dark:border-d my-4'> 
                        <img src={formInput.token.logo} width={30} height={30} />
                        <input className={styles.input} placeholder='0.00' type='number'></input>
                </div>
                <button onClick={deposit} className={styles.windowButton}>Supply</button>
                </div>
                
            </div>
        }
        <div className={styles.network}>
            <Image className='rounded-full' src='/ftm.png' height={50} width={50}></Image>
            <h1 className='text-xl font-bold '>Fantom Testnet</h1>
        </div>
        <div className={styles.userData}>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Your supplies</h1>
                    {lendingTokens.filter((token,i)=>assets[i][1]>0).map((token,i)=>(
                        <div  key={i}className='flex w-full my-2 justify-between items-center'>
                            <img src={token.logo} height={30} width={30} />
                            <span className=' text-l dark:text-d'>{parseFloat((assets[i][1])/(10**18))} {token.name}</span>
                            <button onClick={e=>{
                                handleClickWithdraw(e);
                                setFormInput({...formInput, token})
                            }} className={styles.button}>Withdraw</button>
                        </div>
                    ))}
                </div>
                
            </div>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Your borrows</h1>
                    {lendingTokens.filter((token,i)=>assets[i][0]>0).map((token,i)=>(
                        <div key={i} className='flex w-full my-2 justify-between items-center'>
                            <img src={token.logo} height={30} width={30} />
                            <span className=' text-l dark:text-d'>{parseFloat((assets[i][0])/(10**18)).toFixed(8)} {token.name}</span>
                            <button className={styles.button}>Repay</button>
                        </div>
                    ))}
                </div>
                
            </div>

        </div>
        <div className={styles.market}>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Assets to supply</h1>
                    {lendingTokens.map((token,i)=>(
                        <div key={i} className='flex w-full my-2 justify-between items-center'>
                            <img src={token.logo} height={30} width={30} />
                            <span className=' text-l dark:text-d'>{token.name}</span> 
                            <button onClick={e=>{handleClickSupply(e);setFormInput({...formInput, token});}} className={styles.button}>Supply</button> 
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Assets to borrow</h1>
                    {lendingTokens.map((token,i)=>(
                        <div key={i} className='flex w-full my-2 justify-between items-center'>
                            <img src={token.logo} height={30} width={30} />
                            <span className=' text-l dark:text-d'>{token.name}</span>
                            {
                                assets[i][1]>0 
                                ?<button onClick={e=>{handleClickBorrow(e);setFormInput({...formInput, token});}} className={styles.button}>Borrow</button> 
                                :<button disabled className={styles.buttonDisabled}>Borrow</button>
                            }
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
  )
}

