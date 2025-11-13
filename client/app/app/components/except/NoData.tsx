export default function NoData({ message }: { message: string }) {
  console.log('no data message:', message)
  return <div className="text-center italic text-gray-warm-mid">{message}</div>
}
