import { Loader } from 'lucide-react'
import React from 'react'

function LoaderScreen() {
  return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <Loader className="animate-spin text-emerald" size={24} />
      </div>
  )
}

export default LoaderScreen