import MeetingClient from "./MeetingClient";

const Meeting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  return <MeetingClient id={id} />;
};

export default Meeting;