'use client'

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner = localParticipant && call?.state.createdBy && localParticipant.userId === call?.state.createdBy.id

  if (!isMeetingOwner) return null

  const endCall = async () => {
    try {
      await call?.endCall();
      router.push('/');
    } catch (error) {
      console.error('Failed to end call:', error);
    } finally {
      setShowConfirm(false);
    }
  }

  return (
    <>
      <Button onClick={() => setShowConfirm(true)} className='bg-red-500' data-testid="end-call-button">
        End call for everyone
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="bg-dark-1 border-dark-3">
          <DialogHeader>
            <DialogTitle className="text-white">End Call for Everyone?</DialogTitle>
            <DialogDescription className="text-gray-300">
              This will end the meeting for all participants. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="border-dark-3 text-white hover:bg-dark-3"
            >
              Cancel
            </Button>
            <Button
              onClick={endCall}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              End Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EndCallButton