import CallList from "@/components/CallList"

// Force dynamic rendering to avoid prerendering issues with auth
export const dynamic = 'force-dynamic';

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