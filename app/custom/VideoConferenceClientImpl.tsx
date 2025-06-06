// 'use client';

// import { formatChatMessageLinks, LiveKitRoom, VideoConference } from '@livekit/components-react';
// import {
//   ExternalE2EEKeyProvider,
//   LogLevel,
//   Room,
//   RoomConnectOptions,
//   RoomOptions,
//   VideoPresets,
//   type VideoCodec,
// } from 'livekit-client';
// import { DebugMode } from '@/lib/Debug';
// import { useMemo } from 'react';
// import { decodePassphrase } from '@/lib/client-utils';
// import { SettingsMenu } from '@/lib/SettingsMenu';

// export function VideoConferenceClientImpl(props: {
//   liveKitUrl: string;
//   token: string;
//   codec: VideoCodec | undefined;
// }) {
//   const worker =
//     typeof window !== 'undefined' &&
//     new Worker(new URL('livekit-client/e2ee-worker', import.meta.url));
//   const keyProvider = new ExternalE2EEKeyProvider();

//   const e2eePassphrase =
//     typeof window !== 'undefined' ? decodePassphrase(window.location.hash.substring(1)) : undefined;
//   const e2eeEnabled = !!(e2eePassphrase && worker);
//   const roomOptions = useMemo((): RoomOptions => {
//     return {
//       publishDefaults: {
//         videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
//         red: !e2eeEnabled,
//         videoCodec: props.codec,
//       },
//       adaptiveStream: { pixelDensity: 'screen' },
//       dynacast: true,
//       e2ee: e2eeEnabled
//         ? {
//             keyProvider,
//             worker,
//           }
//         : undefined,
//     };
//   }, []);

//   const room = useMemo(() => new Room(roomOptions), []);
//   if (e2eeEnabled) {
//     keyProvider.setKey(e2eePassphrase);
//     room.setE2EEEnabled(true);
//   }
//   const connectOptions = useMemo((): RoomConnectOptions => {
//     return {
//       autoSubscribe: true,
//     };
//   }, []);

//   return (
//     <LiveKitRoom
//       room={room}
//       token={props.token}
//       connectOptions={connectOptions}
//       serverUrl={props.liveKitUrl}
//       audio={true}
//       video={true}
//     >
//       <VideoConference
//         chatMessageFormatter={formatChatMessageLinks}
//         SettingsComponent={
//           process.env.NEXT_PUBLIC_SHOW_SETTINGS_MENU === 'true' ? SettingsMenu : undefined
//         }
//       />
//       <DebugMode logLevel={LogLevel.debug} />
//     </LiveKitRoom>
//   );
// }


import { useMemo } from 'react';
import { formatChatMessageLinks, LiveKitRoom, VideoConference } from '@livekit/components-react';
import {
  ExternalE2EEKeyProvider,
  LogLevel,
  Room,
  RoomConnectOptions,
  RoomOptions,
  VideoPresets,
  type VideoCodec,
} from 'livekit-client';
import { DebugMode } from '@/lib/Debug';
import { decodePassphrase } from '@/lib/client-utils';
import { SettingsMenu } from '@/lib/SettingsMenu';

export function VideoConferenceClientImpl(props: {
  liveKitUrl: string;
  token: string;
  codec: VideoCodec | undefined;
}) {
  const worker = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new Worker(new URL('livekit-client/e2ee-worker', import.meta.url));
    }
    return undefined;
  }, []); // worker ne sera créé qu'une seule fois

  const keyProvider = useMemo(() => new ExternalE2EEKeyProvider(), []);

  const e2eePassphrase =
    typeof window !== 'undefined' ? decodePassphrase(window.location.hash.substring(1)) : undefined;

  const e2eeEnabled = !!(e2eePassphrase && worker);

  const roomOptions = useMemo((): RoomOptions => {
    return {
      publishDefaults: {
        videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
        red: !e2eeEnabled,
        videoCodec: props.codec,
      },
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
      e2ee: e2eeEnabled
        ? {
            keyProvider,
            worker,
          }
        : undefined,
    };
  }, [e2eeEnabled, keyProvider, props.codec, worker]);

  const room = useMemo(() => new Room(roomOptions), [roomOptions]);

  if (e2eeEnabled) {
    keyProvider.setKey(e2eePassphrase);
    room.setE2EEEnabled(true);
  }

  const connectOptions = useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true,
    };
  }, []);

  return (
    <LiveKitRoom
      room={room}
      token={props.token}
      connectOptions={connectOptions}
      serverUrl={props.liveKitUrl}
      audio={true}
      video={true}
    >
      <VideoConference
        chatMessageFormatter={formatChatMessageLinks}
        SettingsComponent={
          process.env.NEXT_PUBLIC_SHOW_SETTINGS_MENU === 'true' ? SettingsMenu : undefined
        }
      />
      <DebugMode logLevel={LogLevel.debug} />
    </LiveKitRoom>
  );
}
