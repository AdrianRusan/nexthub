import React from 'react'
import CallList from './CallList'
import { Button } from './ui/button';
import Image from 'next/image';
import { useToast } from './ui/use-toast';

interface MeetingCardProps {
  title: string
  date: string
  buttonIcon1?: string
  buttonText?: string
  handleClick: () => void
  link: string
}


const NextMeeting = ({ title, date, buttonIcon1, buttonText, handleClick, link }: MeetingCardProps) => {

  const { toast } = useToast()


  return (
    <div className='flex flex-col xl:flex-row justify-start items-center gap-5'>
      <h2 className='glassmorphism rounded-xl p-2 text-center text-base font-normal w-3/3' >{title} - {date}</h2>
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
            toast({ title: "Link Copied", duration: 5000 })
          }}
          className='bg-dark-4 px-6'
        >
          <Image
            src='/icons/copy.svg'
            alt='tbd'
            width={20}
            height={20}
          />
          &nbsp; Copy Link
        </Button>
      </div>
    </div>
  )
}

export default NextMeeting