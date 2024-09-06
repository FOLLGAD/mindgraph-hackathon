import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import SearchBar from './SearchBar'
import Link from 'next/link'

export default function Navbar() {
    return (
        <div className='flex justify-between items-center p-2 bg-[#1C1C1C] text-white mt-2'>

            <div className='flex w-full justify-start items-center space-x-2 ml-2'>
                <Link href="/">
                    <Image src="/logo.svg" alt="Logo" width={25} height={25} />
                </Link>
                <div className='flex w-4/12 mx-4 relative'>
                    <SearchBar />
                </div>
                <div className='flex items-start space-x-2 mr-2'>
                    <Button
                        size='sm'
                        variant='ghost'
                        className='text-white bg-[#333333]'
                    >
                        Discovery
                    </Button>
                    <Button
                        size='sm'
                        variant='ghost'
                        className='text-[#888888] bg-[#252525]'
                    >
                        Quiz
                    </Button>
                </div>
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
