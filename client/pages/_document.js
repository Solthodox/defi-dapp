import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,700;1,200;1,300&display=swap" rel="stylesheet" />
        <script src="../path/to/flowbite/dist/flowbite.js" />
      </Head >
      <body className=' scroll-smooth '>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}