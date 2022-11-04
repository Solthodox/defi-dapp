import { useEffect, useState } from 'react'
import Image from 'next/image'
import { lendingTokens, lending } from '../../config'
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
        userData:' w-full flex flex-col md:flex-row  px-16',
        market : 'w-full px-16 flex flex-col md:flex-row my-16',
        box: 'w-full md:w-1/2 ',
        container:'rounded-md mx-4 px-4 bg-d dark:bg-l py-4 mb-4 md:mb-auto',
        window: 'rounded-md mx-4 px-4 bg-d dark:bg-l py-4',
        button: ' text-d font-bold w-full md:w-auto dark:text-l px-8 py-2 rounded-md dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-500 to-yellow-100',
        buttonDisabled: ' text-d/50 font-bold dark:text-l/50 px-8 py-2 rounded-md bg-l/70 dark:bg-d/70',
        windowButton: 'w-full  text-d font-bold dark:text-l px-8 py-2 rounded-md dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-500 to-yellow-100',
        input:'rounded-md outline-none px-4 dark:bg-l bg-d text-l dark:text-d' ,
        responsiveBox: 'flex flex-col md:flex-row w-full my-2 justify-between items-center ',
        responsiveDetails: 'flex justify-between md:w-full md:px-8 space-x-4 py-4 md:py-auto'
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
        const instance = new ethers.Contract(lending.pool, Lending.abi, wallet.signer)
        const borrowedUsdt = await instance.s_accountToTokenBorrows(wallet.address, lendingTokens[0].address)
        const depositedUsdt = await instance.s_accountToTokenDeposits(wallet.address, lendingTokens[0].address)
        const borrowedLink = await instance.s_accountToTokenBorrows(wallet.address, lendingTokens[1].address)
        const depositedLink = await instance.s_accountToTokenDeposits(wallet.address, lendingTokens[1].address)
        const usdtPrice = 1
        const linkPrice = await instance.getUSDValue(lendingTokens[1].address, ethers.utils.parseEther('1'))
        setAssets([
            [borrowedUsdt.toString(),depositedUsdt.toString(), usdtPrice.toString()], [borrowedLink.toString(),depositedLink.toString(), (linkPrice/(10**8)).toString()]
        ])
        console.log(assets)
        const _health = await instance.healthFactor(wallet.address)
        setHealth(_health.toString())
        setLoadingState('loaded')
    }

    const borrow = async(e) =>{
        e.preventDefault()
        let [instance, borrowToken, amount]  = getTxInputs()
        const approval = await borrowToken.approve(lending.pool,amount )
        await approval.wait()
        const tx = await instance.borrow(formInput.token.address, amount)
        await tx.wait()
        console.log("DONE")
        fetchAssets()
        handleClickBorrow()
    }
    const deposit = async(e) =>{
        e.preventDefault()
        let [instance, depositToken, amount]  = getTxInputs()
        const approval = await depositToken.approve(lending.pool,amount )
        await approval.wait()
        const deposit = await instance.deposit(depositToken.address, amount)
        await deposit.wait()
        console.log("DONE")
        fetchAssets()
        handleClickSupply()
    }
    const repay = async(token,i) =>{
        const instance = new ethers.Contract(lending.pool, Lending.abi, wallet.signer)
        const repayToken = new ethers.Contract(token.address, token.abi, wallet.signer)
        const approval = await repayToken.approve(instance.address, assets[i][0].toString() )
        await approval.wait()
        const tx = await instance.repay(token.address,assets[i][0].toString() )
        await tx.wait()
        fetchAssets()

    }
    const withdraw = async() =>{
        let [instance, widthdrawToken, amount]  = getTxInputs()
        const approval = await widthdrawToken.approve(lending.pool, amount)
        await approval.wait()
        const tx = await instance.withdraw(formInput.token.address, amount)
        await tx.wait()
        console.log("DONE")
        fetchAssets()
        handleClickWithdraw()
    }

    const getTxInputs = () => {
        return [
            new ethers.Contract(lending.pool, Lending.abi, wallet.signer),
            new ethers.Contract(formInput.token.address, formInput.token.abi, wallet.signer),
            ethers.utils.parseEther(formInput.amount)
        ]
        
    }

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
                <div className={styles.window}>
                    <IoMdClose className='cursor-pointer fill-l dark:fill-d' onClick={handleClickBorrow} />
                    <h1 className={styles.title}>Borrow asset</h1>
                    <h2>{formInput.token.name}</h2>
                    <div className='rounded-md flex p-2 border border-l dark:border-d my-4'> 
                        <img src={formInput.token.logo} width={30} height={30} />
                        <input  onChange={e=>setFormInput({...formInput, amount:e.target.value})}  
                        className={styles.input} placeholder='0.00' type='number'></input>
                    </div>
                    <button onClick={borrow} className={styles.windowButton}>Borrow</button>
                </div>
            </div>
        }
        {showWithdraw===true && 
            <div className='min-h-screen absolute flex flex-col items-center justify-center bg-d/70 w-full'>
                <div className={styles.window}>
                    <IoMdClose className='cursor-pointer fill-l dark:fill-d' onClick={handleClickWithdraw} />
                    <h1 className={styles.title}>Withdraw asset</h1>
                    <h2>{formInput.token.name}</h2>
                    <div className='rounded-md flex p-2 border border-l dark:border-d my-4'> 
                        <img src={formInput.token.logo} width={30} height={30} />
                        <input className={styles.input}  onChange={e=>setFormInput({...formInput, amount:e.target.value})} placeholder='0.00' type='number'></input>
                    </div>
                    <button onClick={withdraw} className={styles.windowButton}>Withdraw</button>
                </div>
            </div>
        }
        {showSupply===true && 
            <div className='min-h-screen absolute flex flex-col items-center justify-center bg-d/70 w-full'>
                <div className={styles.window}>
                <IoMdClose className='cursor-pointer fill-l dark:fill-d' onClick={handleClickSupply} />
                <h1 className={styles.title}>Supply asset</h1>
                <h2>{formInput.token.name}</h2>
                <div className='rounded-md flex p-2 border border-l dark:border-d my-4'> 
                        <img src={formInput.token.logo} width={30} height={30} />
                        <input onChange={e=>setFormInput({...formInput, amount:e.target.value})} className={styles.input} placeholder='0.00' type='number'></input>
                </div>
                <button onClick={deposit} className={styles.windowButton}>Supply</button>
                </div>
                
            </div>
        }
        <div className={styles.network}>
            <Image className='rounded-full hideInHeader' src='/ftm.png' height={50} width={50}></Image>
            <h1 className='text-xl font-bold '>Fantom Testnet</h1>
        </div>
        <div className={styles.userData}>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Your supplies</h1>
                    {(assets[0][1]>0 || assets[1][1]>0) 
                    ?lendingTokens.filter((token,i)=>assets[i][1]>0).map((token,i)=>(
                        <div  key={i}className={styles.responsiveBox}>
                            <div className={styles.responsiveDetails}>
                                <img src={token.logo} height={30} width={30} /> 
                                <span className=' text-l hidden md:flex dark:text-d'>{assets[i][1] / (10**18)} {token.name}</span>
                                <span className=' text-l dark:text-d'>{(assets[i][2] * (assets[i][1] / (10**18))).toFixed(2) } USD</span>
                            </div>
                            <button onClick={e=>{
                                handleClickWithdraw(e);
                                setFormInput({...formInput, token})
                            }} className={styles.button}>Withdraw</button>
                        </div>
                    )) 
                   : <p  className='flex w-full my-2 justify-between text-l/30 dark:text-d/70 items-center'>No assets deposited</p>
                }
                </div>
                
            </div>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Your borrows</h1>
                    {(assets[0][0]>0 || assets[1][0]>0) ?lendingTokens.filter((token,i)=>assets[i][0]>0 && assets[i][0]!=0 ).map((token,i)=>(
                        <div key={i} className={styles.responsiveBox}>
                             <div className={styles.responsiveDetails}>
                                <img src={token.logo} height={30} width={30} />
                                <span className='hidden md:flex text-l dark:text-d'>{assets[i][0]/(10**18)} {token.name}</span>
                                <span className=' text-l dark:text-d'>{((assets[i][0]/(10**18)) * assets[i][2]).toFixed(2)} {token.name}</span>
                            </div>
                            <button onClick={e=>repay(token,i)} className={styles.button}>Repay</button>
                        </div>
                    )) : 
                    <p  className='flex w-full my-2 justify-between text-l/30 dark:text-d/70 items-center'>No assets borrowed</p>
                    }
                </div>
                
            </div>

        </div>
        <div className={styles.market}>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Assets to supply</h1>
                    {lendingTokens.map((token,i)=>(
                        <div key={i} className={styles.responsiveBox}>
                            <div className='flex items-center space-x-2 my-4 md:my-auto'>
                                <img src={token.logo} height={30} width={30} />
                                <span className=' text-l dark:text-d'>{token.name}</span>
                            </div>
                            <button onClick={e=>{handleClickSupply(e);setFormInput({...formInput, token});}} className={styles.button}>Supply</button> 
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.box}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Assets to borrow</h1>
                    {lendingTokens.map((token,i)=>(
                        <div key={i} className={styles.responsiveBox}>
                            <div className='flex items-center space-x-2  my-4 md:my-auto'>
                                <img src={token.logo} height={30} width={30} />
                                <span className=' text-l dark:text-d'>{token.name}</span>
                            </div>
                            {
                                (assets[0][1]>0 || assets[1][1]>0)
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

