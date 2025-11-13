// @ts-nocheck

'use client'

import { useGetCalls } from '@/hooks/useGetCalls';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { useToast } from './ui/use-toast';
import NextMeeting from './NextMeeting';

const formatMeetingDate = (dateInput) => {
  const date = new Date(dateInput);
  let formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  // Capitalize the first letter of each word in the date
  formattedDate = formattedDate
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  let formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date).toUpperCase();

  return `${formattedDate} - ${formattedTime}`;
};

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'upcomingHome' | 'recordings' }) => {
  const { toast } = useToast();

  const { endedCalls, upcomingCalls, upcomingHomeCalls, callRecordings, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([])

  const router = useRouter();

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      case 'upcomingHome':
        return upcomingHomeCalls;
      default:
        return [];
    }
  }

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No previous calls';
      case 'recordings':
        return 'No recordings available';
      case 'upcoming' || 'upcomingHome':
        return 'No upcoming calls';
      default:
        return '';
    }
  }

  useEffect(() => {
    const fetchRecordings = async () => {

      try {
        const callData = await Promise.all(callRecordings.map((meeting) => meeting.queryRecordings()))

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap(call => call.recordings)

        setRecordings(recordings)
      } catch (err) {
        toast({ title: 'Try again later', status: 'error', duration: 5000 })
      }

    }

    if (type === 'recordings') fetchRecordings();

  }, [type, callRecordings, toast])

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />

  return (
    <>
      {type === 'upcomingHome' && (
        <h2 className='text-3xl font-bold'>Upcoming Calls</h2>
      )}
      {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
        <>
          {type === 'upcomingHome' ? (
            <div className='flex flex-col'>
              <NextMeeting
                key={meeting?.id}
                title={meeting.state?.custom?.description?.substring(0, 25) || meeting?.filename?.substring(0, 20) || 'My Room'}
                date={formatMeetingDate(meeting.state?.startsAt || meeting.start_time)}
                icon={
                  type === 'ended'
                    ? '/icons/previous.svg'
                    : type === 'upcomingHome'
                      ? '/icons/upcoming.svg'
                      : '/icons/recordings.svg'
                }
                isPreviousMeeting={type === 'ended'}
                buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                buttonText={type === 'recordings' ? 'Play' : 'Start'}
                handleClick={type === 'recordings' ? () => router.push(`${meeting.url}`) : () => router.push(`/meeting/${meeting.id}`)}
                link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
              />
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
              <MeetingCard
                key={meeting?.id}
                title={meeting.state?.custom?.description?.substring(0, 25) || meeting?.filename?.substring(0, 20) || 'My Room'}
                date={formatMeetingDate(meeting.state?.startsAt || meeting.start_time)}
                icon={
                  type === 'ended'
                    ? '/icons/previous.svg'
                    : type === 'upcomingHome'
                      ? '/icons/upcoming.svg'
                      : '/icons/recordings.svg'
                }
                isPreviousMeeting={type === 'ended'}
                buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                buttonText={type === 'recordings' ? 'Play' : 'Start'}
                handleClick={type === 'recordings' ? () => window.open(`${meeting.url}`, '_blank') : () => window.open(`/meeting/${meeting.id}`)}
                link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
              />
            </div>
          )}
        </>
      )) : (
        <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
          <div className="mb-6 rounded-full bg-dark-3 p-8 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className='text-2xl font-semibold mb-3 text-white'>{noCallsMessage}</h2>
          <p className='text-gray-400 text-base max-w-md'>
            {type === 'upcoming' && 'Schedule your first meeting to get started with video conferencing'}
            {type === 'ended' && 'Your previous meetings will appear here once you\'ve completed some calls'}
            {type === 'recordings' && 'Recordings of your meetings will be available here after they are processed'}
          </p>
        </div>
      )}
    </>
  )
}

export default CallList