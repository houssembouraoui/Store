import Head from 'next/head'
import Image from 'next/image'
import HomeProduct from '../componenets/parts/home/products.jsx'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Sghyrna</title>
        <meta name="description" content="Generated by create next app" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <HomeProduct/>
    </div>
  )
}
