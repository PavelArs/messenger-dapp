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
    <Card className={isSentByCurrentUser ? 'bg-blue-50' : ''}>
      <CardHeader className="flex justify-between">
        <div>
          <p>
            <strong>From:</strong>{" "}
            <span className={isSentByCurrentUser ? 'text-primary font-medium' : ''}>
              {sender.slice(0, 6)}...{sender.slice(-4)}
              {isSentByCurrentUser && " (You)"}
            </span>
          </p>
          <p>
            <strong>To:</strong>{" "}
            <span className={isReceivedByCurrentUser ? 'text-primary font-medium' : ''}>
              {receiver.slice(0, 6)}...{receiver.slice(-4)}
              {isReceivedByCurrentUser && " (You)"}
            </span>
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="message-content">{content}</p>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <p className="message-meta">
          {new Date(Number(timestamp) * 1000).toLocaleString()}
        </p>
      </CardFooter>
    </Card>
  )
}