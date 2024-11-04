import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { Metadata } from 'next';
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "NextHub",
  description: "NextHub is a video conferencing platform that offers an unparalleled experience in online communication with any number of participants.",
  icons: {
    icon: "/icons/logo.svg",
  }
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='relative'>
      <Navbar />

      <div className='flex'>
        <Sidebar />

        <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14'>
          <div className='w-full '>
            {children}
          </div>
        </section>

      </div>

    </main>
  )
}

export default HomeLayout