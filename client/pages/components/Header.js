
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
        mainContainer: 'header smd:px-48 sm:px-24 w-full sticky top-0 py-2 bg-l/10 dark:bg-d/10 backdrop-blur-lg  flex items-center justify-between',
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
            <Link  href='/'>
                <div className={styles.div + 'flex items-center cursor-pointer'}>
                    <SiFoodpanda className={styles.logo}/>
                    <h1 className={styles.title}>Bear Finance</h1>
                </div>
            </Link>
        {wallet.provider && (
            <div className={styles.div + 'hidden md:flex'}>
                <Link href='/'>
                Swap
                </Link>
                <Link href='/lending'>
                Lending
                </Link>
                <Link href='/stableswap'>
                Stableswap
                </Link>
                <Link href='/mint'>
                Mint
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

