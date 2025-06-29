'use client'

import React, { useState } from 'react'
import {
  Sheet, SheetClose, SheetContent, SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { UserButton } from '@clerk/nextjs'

const MobileNav = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const closeMobileNav = () => setIsOpen(false)

  return (
    <div className="flex items-center gap-4 lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-md border border-dark-3 bg-dark-2 hover:bg-dark-3 sm:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </SheetTrigger>
        
        <SheetContent 
          side="left" 
          className="w-[300px] sm:w-[350px] border-none bg-dark-1 p-0"
          aria-describedby="mobile-navigation-description"
        >
          <div id="mobile-navigation-description" className="sr-only">
            Mobile navigation menu with links to different sections of the application
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-dark-3 p-4 sm:p-6">
            <Link 
              href="/" 
              className="flex items-center gap-2"
              onClick={closeMobileNav}
            >
              <Image 
                src="/icons/logo.svg"
                width={32}
                height={32}
                alt="NextHub logo"
                className="h-8 w-8"
              />
              <span className="text-lg sm:text-xl font-bold text-white">
                NextHub
              </span>
            </Link>
            
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`)
                
                return (
                  <SheetClose asChild key={link.route}>
                    <Link
                      href={link.route}
                      className={cn(
                        'flex items-center justify-between rounded-lg p-3 sm:p-4 text-sm font-medium transition-all duration-200',
                        'hover:bg-dark-3 active:bg-dark-4 focus:outline-none focus:ring-2 focus:ring-blue-1 focus:ring-offset-2 focus:ring-offset-dark-1',
                        {
                          'bg-blue-1 text-white shadow-lg': isActive,
                          'text-gray-300 hover:text-white': !isActive,
                        }
                      )}
                      onClick={closeMobileNav}
                    >
                      <div className="flex items-center gap-3">
                        <Image 
                          src={link.imgUrl}
                          alt=""
                          width={20}
                          height={20}
                          className="h-5 w-5 flex-shrink-0"
                        />
                        <span className="truncate">{link.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50 flex-shrink-0" />
                    </Link>
                  </SheetClose>
                )
              })}
            </div>
          </nav>

          {/* Footer with User Info */}
          <div className="border-t border-dark-3 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <UserButton 
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 sm:h-10 sm:w-10",
                    userButtonPopoverCard: "bg-dark-1 border-dark-3",
                    userButtonPopoverActionButton: "text-white hover:bg-dark-3",
                  }
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Account Settings
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Manage your profile
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav