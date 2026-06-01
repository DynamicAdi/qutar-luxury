import Editor from '@/components/client/admins/BlogsEditor'
import { ArrowRight, LucideEdit2 } from 'lucide-react'
import React from 'react'

function page() {
  return (
    <div className="w-full h-screen p-5">
        <h1 className="text-2xl font-semibold">Blogs</h1>
        <p>Manage all your blogs and posts.</p>

    <div className="w-full h-[90%] mt-4 flex justify-between items-start gap-3">
        <div className="w-1/3 h-full flex flex-col gap-2">
            <div className="w-full h-16 bg-gray-100 flex  justify-between items-center px-5">
                <h1 className="text-lg font-medium">Create New Blog</h1>
                <LucideEdit2 className="h-4 w-4" />
            </div>
            <hr />

        <div className="w-full h-16 hover:bg-gray-100 cursor-pointer flex  justify-between items-center px-5 pl-2">
                <div className="flex items-start gap-1.5">
                <div className="w-12 h-12 bg-accent-foreground"></div>
                <div className="">
                <h1 className="text-lg font-medium">Create New Blog</h1>
                <p className="text-xs text-gray-400 line-clamp-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, nam.</p>
                </div>
                </div>
                <ArrowRight className="h-5 w-5" />
            </div>
        </div>

    <Editor 
    
    />

    </div>

    </div>
  )
}

export default page