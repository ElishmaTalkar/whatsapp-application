'use client'

import { FC } from 'react'
import { ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs))
}

interface Props {
    label: string
    classes?: string
}

const MotionButton: FC<Props> = ({ label, classes }) => {
    return (
        <button
            className={cn(
                'group relative h-auto w-64 cursor-pointer rounded-full border-none bg-transparent p-0 outline-none',
                classes
            )}
        >
            <span
                className='absolute left-0 top-1/2 -translate-y-1/2 m-0 block h-12 w-12 bg-white rounded-full duration-500 ease-in-out group-hover:w-full'
                aria-hidden='true'
            ></span>
            <div className='absolute top-1/2 left-3 translate-x-0 -translate-y-1/2 duration-500 ease-in-out group-hover:translate-x-[0.4rem] flex items-center justify-center w-6 h-6'>
                <ArrowRight className='text-black size-5' />
            </div>
            <span className='relative block py-3 pl-12 pr-6 text-white font-bold text-lg tracking-tight whitespace-nowrap duration-500 group-hover:text-black text-left'>
                {label}
            </span>
        </button>
    )
}

export default MotionButton
