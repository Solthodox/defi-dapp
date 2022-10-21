import '../styles/globals.css'
import {Web3Provider} from '../context/Web3Provider'
import {ThemeProvider} from 'next-themes'

export default function MyApp({ Component, pageProps }) {
  return (
  <Web3Provider>
    <ThemeProvider attribute='class'>
      <Component {...pageProps} />
    </ThemeProvider>
  </Web3Provider>
  )
}


