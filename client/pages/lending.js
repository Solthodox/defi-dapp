import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import LendingInterface from './components/LendingInterface'

function lending() {
  const styles = {
    main: 'w-full h-screen flex flex-col items-center justify-between'
  }
  return (
    <div className={styles.main}>
      <Header/>
      <LendingInterface/>
      <Footer/>
    </div>
  )
}

export default lending