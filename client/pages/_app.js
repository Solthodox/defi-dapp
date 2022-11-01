import '../styles/globals.css'
import {Web3Provider} from '../context/Web3Provider'
import {ThemeProvider} from 'next-themes'

export default function MyApp({ Component, pageProps }) {
  return (
  <ThemeProvider attribute='class'>
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  </ThemeProvider>
  )
}


