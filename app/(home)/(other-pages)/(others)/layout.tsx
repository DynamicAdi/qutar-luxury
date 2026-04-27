import React from 'react'
import Navbar from '../../_components/Navbar'
import Footer from '../../_components/Footer'

export default function layout({children}:React.PropsWithChildren) {
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  )
}
