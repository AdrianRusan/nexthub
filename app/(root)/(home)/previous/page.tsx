import CallList from "@/components/CallList"
import type { Metadata } from 'next'

// Force dynamic rendering to avoid prerendering issues with auth
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Previous Meetings',
  description: 'View your past meetings and call history',
  alternates: {
    canonical: '/previous'
  }
};

const Previous = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Previous Calls
      </h1>

      <CallList type="ended" />
    </section>)
}

export default Previous