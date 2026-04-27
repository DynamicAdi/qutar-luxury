import React from 'react'
import Navbar from '@/components/client/global/Navbar';
import Footer from '@/components/client/global/Footer';

export default function layout({children}:React.PropsWithChildren) {
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  )
}
