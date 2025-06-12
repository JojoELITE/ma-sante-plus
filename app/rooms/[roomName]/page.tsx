// app/rooms/[roomName]/page.tsx

import { PageClientImpl } from './PageClientImpl'
import { isVideoCodec } from '@/lib/types'

export default async function Page({
  params,
  searchParams,
}: {
  params: { roomName: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { roomName } = params

  const codecParam = searchParams.codec
  const hqParam = searchParams.hq
  const regionParam = searchParams.region

  const codec = codecParam && isVideoCodec(codecParam as string) ? codecParam : 'vp9'
  const hq = hqParam === 'true'

  return (
    <PageClientImpl
      roomName={roomName}
      region={regionParam as string | undefined}
      hq={hq}
      codec={"vp9"}
    />
  )
}
