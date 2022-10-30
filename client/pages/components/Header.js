
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useWeb3 } from '../../context/Web3Provider'
import {MdDarkMode}  from "react-icons/md"
import {MdLightMode}  from "react-icons/md"
import {SiFoodpanda} from "react-icons/si"
export default function Header(props) {
    const {theme, setTheme} = useTheme()
    const wallet = useWeb3()
    const styles = {
        mainContainer: 'smd:px-48 sm:px-24 w-full sticky top-0 py-2   flex items-center justify-between',
        logo: 'h-12 w-12',
        title: 'font-bold text-2xl' ,
        button: 'dark:bg-l font-bold  bg-d text-l dark:text-d rounded-md px-8 py-4',
        div: 'mx-4 space-x-4 font-semibold ',
        themeIcon: 'h-8 w-8 cursor-pointer'
    }
    const switchTheme =()=>{
        setTheme(theme==='dark'?'light':'dark')
    }

  return (
    <div className={styles.mainContainer}>
        <div className={styles.div + 'flex items-center'}>
            <SiFoodpanda className={styles.logo}/>
            <h1 className={styles.title}>Panda<span className='text-orange-600'>.Fi</span></h1>
        </div>
        {wallet.provider && (
            <div className={styles.div + 'hidden md:flex'}>
                <Link href='/lending'>
                Lending
                </Link>
                <Link href='/swap'>
                Swap
                </Link>
                <Link href='/stableswap'>
                Stableswap
                </Link>
            </div>
        )}
        <div className={styles.div + 'flex items-center'}>
            {theme=='light'
            ? <MdDarkMode  className={styles.themeIcon} onClick={switchTheme}/>
            : <MdLightMode className={styles.themeIcon}  onClick={switchTheme}/>
            }
            {!wallet.provider 
            ? <button className={styles.button} onClick={wallet.connect}>Connect</button>
            : <button className={styles.button} onClick={wallet.forget}>{wallet.address.slice(0,15)}...</button>
            }
        </div>
    </div>
  )
}

