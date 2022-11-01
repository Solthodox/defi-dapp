import React from 'react'
import Header from './components/Header'

function lending() {
  const styles = {
    main: 'w-full h-screen flex flex-col justify-between'
  }
  return (
    <div className={styles.main}>
      <Header/>
    </div>
  )
}

export default lending