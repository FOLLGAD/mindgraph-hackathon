import React from 'react'
import Image from 'next/image'
import { Input } from './ui/input'
import { Button } from './ui/button'
import SearchBar from './SearchBar'

export default function Navbar() {
    return (
        <div className='flex justify-between items-center p-2 bg-[#1C1C1C] text-white mt-2'>
            <div className='flex items-center space-x-2 ml-2'>
                <Image src="/logo.svg" alt="Logo" width={25} height={25} />
            </div>
            <div className='flex-grow mx-4 relative'>
                <SearchBar />
            </div>
            <div className='flex items-center space-x-2 mr-2'>
                <Button
                    size='sm'
                    variant='ghost'
                    className='text-white bg-[#6677FF]'
                >
                    Share
                </Button>
                {/* <Image src="/login.svg" alt="Logo" width={35} height={35} /> */}
            </div>
        </div>
    )
}
