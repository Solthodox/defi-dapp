
import Header from './components/Header'
import Footer from './components/Footer'
import StableSwapInterface from './components/StableSwapInterface'

export default function StableSwap() {
  const styles = {
    main: ' w-full min-h-screen flex flex-col justify-between',
  }
 

  return (
    <div className={styles.main}>
      <Header />
      <StableSwapInterface />
      <Footer />
    </div>
  )
}
