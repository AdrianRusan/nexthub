import CallList from "@/components/CallList"
import type { Metadata } from 'next'

// Force dynamic rendering to avoid prerendering issues with auth
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Meeting Recordings',
  description: 'Access and manage your recorded meetings and video calls',
  alternates: {
    canonical: '/recordings'
  }
};

const Recordings = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Recordings
      </h1>

      <CallList type="recordings" />
    </section>)
}

export default Recordings