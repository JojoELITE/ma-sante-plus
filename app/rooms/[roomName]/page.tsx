import { PageClientImpl } from './PageClientImpl';
import { isVideoCodec } from '@/lib/types';


export default async function page({ params }: { params: Promise<{ roomName: string }> }) {
  
  // Vérifier si l'utilisateur est membre de l'organisation
  const {roomName} = await params
  const url = new URL(process.env.NEXT_PUBLIC_BASE_URL + `/rooms/${roomName}`);
  const searchParams = url.searchParams;

  const codecParam = searchParams.get('codec');
  const hqParam = searchParams.get('hq');
  const regionParam = searchParams.get('region');

  const codec = codecParam && isVideoCodec(codecParam) ? codecParam : 'vp9';
  const hq = hqParam === 'true';

  return (
    <PageClientImpl
      roomName={roomName}
      region={regionParam || undefined}
      hq={hq}
      codec={codec}
    />
  );
}
