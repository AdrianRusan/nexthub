import CallList from '@/components/CallList';
import DateTime from '@/components/DateTime';
import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-row items-center justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          <DateTime />
          <div className='flex flex-col gap-5 w-2/3'>
            <CallList type='upcomingHome' />
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  )
}

export default Home