import MeetingClient from "./MeetingClient";
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  return {
    title: 'Join Meeting',
    description: `Join video meeting ${id}`,
    robots: {
      index: false,
      follow: false
    }
  };
}

const Meeting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <MeetingClient id={id} />;
};

export default Meeting;