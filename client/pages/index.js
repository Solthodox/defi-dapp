import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from './components/Header'

export default function Home() {
  const styles = {
    main: 'dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-500 to-yellow-100 '
  }
  return (
    <div className={styles.main}>
      <Header/>
      <div className='h-screen w-full smd:px-48'></div>
    </div>
   
  )
}
