
import Header from './components/Header'
import Footer from './components/Footer'
import SwapInterface from './components/SwapInterface'

export default function Home() {
  const styles = {
    main: ' w-full h-screen flex flex-col justify-between',
  }
 

  return (
    <div className={styles.main}>
      <Header />
      <SwapInterface />
      <Footer />
    </div>
  )
}
