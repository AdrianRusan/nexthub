'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { avatarImages } from '@/constants'
import { useToast } from './ui/use-toast'

interface MeetingCardProps {
  title: string
  date: string
  icon: string
  isPreviousMeeting?: boolean;
  buttonIcon1?: string
  buttonText?: string
  handleClick: () => void
  link: string
}

const MeetingCard = ({ title, date, icon, isPreviousMeeting, buttonIcon1, buttonText, handleClick, link }: MeetingCardProps) => {

  const { toast } = useToast()

  return (
    <section className='flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]'>
      <article className='flex flex-col gap-5'>
        <Image src={icon} alt='tbd' width={28} height={28} />
        <div className='flex justify-between'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>{title}</h1>
            <p className='text-base font-normal'>{date}</p>
          </div>
        </div>
      </article>
      <article className={cn('flex justify-center relative', {})}>
        {!isPreviousMeeting && (
          <div className='flex gap-2'>
            <Button onClick={handleClick} className='rounded bg-blue-1 px-6'>
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt='tbd' width={20} height={20} />
              )}
              &nbsp; {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({ title: "Link copied", duration: 5000 })
              }}
              className='bg-dark-4 px-6'
            >
              <Image
                src='/icons/copy.svg'
                alt='tbd'
                width={20}
                height={20}
              />
              &nbsp; Copy link
            </Button>
          </div>
        )}
      </article>
    </section>
  )
}

export default MeetingCard