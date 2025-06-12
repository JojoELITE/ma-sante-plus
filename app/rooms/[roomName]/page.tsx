import { PageClientImpl } from './PageClientImpl';
import { isVideoCodec } from '@/lib/types';

export default function Page({ params }: { params: { roomName: string } }) {
  const url = new URL(process.env.NEXT_PUBLIC_BASE_URL + `/rooms/${params.roomName}`);
  const searchParams = url.searchParams;

  const codecParam = searchParams.get('codec');
  const hqParam = searchParams.get('hq');
  const regionParam = searchParams.get('region');

  const codec = codecParam && isVideoCodec(codecParam) ? codecParam : 'vp9';
  const hq = hqParam === 'true';

  return (
    <PageClientImpl
      roomName={params.roomName}
      region={regionParam || undefined}
      hq={hq}
      codec={codec}
    />
  );
}
