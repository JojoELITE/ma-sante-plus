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

  const codecParam = Array.isArray(searchParams.codec) ? searchParams.codec[0] : searchParams.codec
  const hqParam = Array.isArray(searchParams.hq) ? searchParams.hq[0] : searchParams.hq
  const regionParam = Array.isArray(searchParams.region) ? searchParams.region[0] : searchParams.region

  const codec: 'vp9' | 'vp8' | 'h264' | 'av1' =
    codecParam && isVideoCodec(codecParam) ? codecParam : 'vp9'

  const hq = hqParam === 'true'

  return (
    <PageClientImpl
      roomName={roomName}
      region={regionParam}
      hq={hq}
      codec={codec}
    />
  )
}
