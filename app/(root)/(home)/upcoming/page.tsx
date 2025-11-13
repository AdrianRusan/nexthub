import CallList from "@/components/CallList"
import type { Metadata } from 'next'

// Force dynamic rendering to avoid prerendering issues with auth
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Upcoming Meetings',
  description: 'View and manage your upcoming scheduled meetings and video calls',
  alternates: {
    canonical: '/upcoming'
  }
};

const Upcoming = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Upcoming Calls
      </h1>

      <CallList type="upcoming" />
    </section>
  )
}

export default Upcoming