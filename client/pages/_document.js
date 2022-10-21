import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body className='bg-l dark:bg-d text-d dark:text-l'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}