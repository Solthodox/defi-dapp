import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body className='dark:text-l text-d dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-500 to-yellow-100 '>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}