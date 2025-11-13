import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

interface HomeCardProps {
  className: string
  img: string
  title: string
  description: string
  handleClick: () => void
}

const HomeCard = React.memo(({ className, img, title, description, handleClick }: HomeCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div 
      className={cn('px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer', className)} 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image
          src={img}
          alt={title}
          width={27}
          height={27}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">
          {title}
        </h1>
        <p className="text-lg font-normal">
          {description}
        </p>
      </div>
    </div >)
});

HomeCard.displayName = 'HomeCard';

export default HomeCard