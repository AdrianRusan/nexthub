import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "NextHub",
  description: "NextHub is a video conferencing platform that offers an unparalleled experience in online communication with any number of participants.",
  icons: {
    icon: "/icons/logo.svg",
  }
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>
        {children}
      </StreamVideoProvider>
    </main>
  )
}

export default RootLayout