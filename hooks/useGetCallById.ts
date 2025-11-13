import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>()
  const [isCallLoading, setIsCallLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
      try {
        const { calls } = await client.queryCalls({
          filter_conditions: {
            id
          }
        })

        if (calls.length > 0) {
          setCall(calls[0])
        } else {
          // Meeting doesn't exist or user doesn't have access
          toast({
            title: "Meeting Not Found",
            description: "This meeting doesn't exist or you don't have permission to access it.",
            variant: "destructive",
            duration: 5000
          })

          // Redirect to home after a short delay
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }
      } catch (error) {
        console.error('Error loading call:', error)
        toast({
          title: "Error Loading Meeting",
          description: "Failed to load meeting. Please try again or contact support.",
          variant: "destructive",
          duration: 5000
        })

        setTimeout(() => {
          router.push('/')
        }, 2000)
      } finally {
        setIsCallLoading(false)
      }
    }

    loadCall();

  }, [client, id, router, toast]);

  return { call, isCallLoading};

}