import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'

interface MessageCardProps {
  sender: string
  receiver: string
  content: string
  timestamp: bigint
  currentAddress?: string
}

export function MessageCard({ 
  sender, 
  receiver, 
  content, 
  timestamp,
  currentAddress 
}: MessageCardProps) {
  const isSentByCurrentUser = currentAddress?.toLowerCase() === sender.toLowerCase()
  const isReceivedByCurrentUser = currentAddress?.toLowerCase() === receiver.toLowerCase()
  
  return (
    <Card className={`message-item hover:shadow-elevation-2 transition-all duration-300 ${isSentByCurrentUser ? 'bg-blue-50 border-blue-100' : ''}`}>
      <CardHeader className="flex justify-between">
        <div>
          <p className="mb-1">
            <strong className="text-gray-700">From:</strong>{" "}
            <span className={`font-medium ${isSentByCurrentUser ? 'text-primary-600' : 'text-gray-900'}`}>
              {sender.slice(0, 6)}...{sender.slice(-4)}
              {isSentByCurrentUser && " (You)"}
            </span>
          </p>
          <p className="mb-0">
            <strong className="text-gray-700">To:</strong>{" "}
            <span className={`font-medium ${isReceivedByCurrentUser ? 'text-primary-600' : 'text-gray-900'}`}>
              {receiver.slice(0, 6)}...{receiver.slice(-4)}
              {isReceivedByCurrentUser && " (You)"}
            </span>
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="p-3 bg-gray-100 rounded-lg my-2 break-words">
          {content}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <p className="text-xs text-gray-500 italic">
          {new Date(Number(timestamp) * 1000).toLocaleString()}
        </p>
      </CardFooter>
    </Card>
  )
}