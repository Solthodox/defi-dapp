import React from 'react'
import {SiFoodpanda} from "react-icons/si"

export default function Footer() {
  const styles = {
    mainContainer: 'header smd:px-48 sm:px-24 w-full sticky top-0 py-2 bg-l/10 dark:bg-d/10 backdrop-blur-lg  flex items-center justify-between',
    logo: 'h-6 w-6',
    title: 'font-bold text-xl' ,
    button: 'dark:bg-l font-bold  bg-d text-l dark:text-d rounded-md px-8 py-4',
    div: 'mx-4 space-x-4 font-semibold ',
    themeIcon: 'h-8 w-8 cursor-pointer'
}
  return (
    <div className='w-full flex  items-center space-x-2 h-full p-16 mt-48  bg-l/50'> 
     <SiFoodpanda className={styles.logo}/>
     <h1 className={styles.title}>Bear Finance</h1>
    </div>
  )
}

