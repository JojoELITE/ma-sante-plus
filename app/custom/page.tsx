'use client';

import { useEffect, useState } from 'react';
import { videoCodecs } from 'livekit-client';
import { VideoConferenceClientImpl } from './VideoConferenceClientImpl';
import { isVideoCodec } from '@/lib/types';

export default function CustomRoomPage() {
  const [searchParams, setSearchParams] = useState<{
    liveKitUrl: string | null;
    token: string | null;
    codec: string | undefined;
  }>({ liveKitUrl: null, token: null, codec: undefined });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams({
      liveKitUrl: params.get('liveKitUrl'),
      token: params.get('token'),
      codec: params.get('codec') || undefined,
    });
  }, []);

  const { liveKitUrl, token, codec } = searchParams;
  
  if (liveKitUrl === null || token === null) {
    return <h2>Loading...</h2>;
  }

  if (codec !== undefined && !isVideoCodec(codec)) {
    return <h2>Invalid codec, if defined it has to be [{videoCodecs.join(', ')}].</h2>;
  }

  return (
    <main data-lk-theme="default" style={{ height: '100%' }}>
      <VideoConferenceClientImpl liveKitUrl={liveKitUrl} token={token} codec={codec} />
    </main>
  );
}
