import PropertyDetails from '@/pages/client/PropertyDetails'
import React from 'react'


export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = await params
  return <PropertyDetails id={id} />
}

