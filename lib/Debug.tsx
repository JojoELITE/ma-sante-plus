import * as React from 'react';
import { useRoomContext } from '@livekit/components-react';
import { setLogLevel, LogLevel, setLogExtension } from 'livekit-client';
// @ts-expect-error - tinykeys doesn't have type definitions
import { tinykeys } from 'tinykeys';
import { datadogLogs } from '@datadog/browser-logs';

import styles from '../styles/Debug.module.css';

type DatadogSite = 'datadoghq.com' | 'datadoghq.eu' | 'us3.datadoghq.com' | 'us5.datadoghq.com' | 'ap1.datadoghq.com' | 'ddog-gov.com';

export const useDebugMode = ({ logLevel }: { logLevel?: LogLevel }) => {
  const room = useRoomContext();

  React.useEffect(() => {
    setLogLevel(logLevel ?? 'debug');

    if (process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN && process.env.NEXT_PUBLIC_DATADOG_SITE) {
      console.log('setting up datadog logs');
      datadogLogs.init({
        clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
        site: process.env.NEXT_PUBLIC_DATADOG_SITE as DatadogSite,
        forwardErrorsToLogs: true,
        sessionSampleRate: 100,
      });

      setLogExtension((level, msg, context) => {
        switch (level) {
          case LogLevel.debug:
            datadogLogs.logger.debug(msg, context);
            break;
          case LogLevel.info:
            datadogLogs.logger.info(msg, context);
            break;
          case LogLevel.warn:
            datadogLogs.logger.warn(msg, context);
            break;
          case LogLevel.error:
            datadogLogs.logger.error(msg, context);
            break;
          default:
            break;
        }
      });
    }

    // @ts-expect-error - Adding room to window for debugging purposes
    window.__lk_room = room;

    return () => {
      // @ts-expect-error - Cleaning up window reference
      window.__lk_room = undefined;
    };
  }, [room, logLevel]);
};

export const DebugMode = ({ logLevel }: { logLevel?: LogLevel }) => {
  const room = useRoomContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [roomSid, setRoomSid] = React.useState('');

  React.useEffect(() => {
    room.getSid().then(setRoomSid);
  }, [room]);

  useDebugMode({ logLevel });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const unsubscribe = tinykeys(window, {
      'Shift+D': () => {
        setIsOpen((open) => !open);
      },
    });

    // timer to re-render
    const interval = setInterval(() => {
      setIsOpen((open) => open);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [isOpen]);

  if (typeof window === 'undefined' || !isOpen) {
    return null;
  }

  const lp = room.localParticipant;

  return (
    <div className={styles.overlay}>
      <section id="room-info">
        <h3>
          Room Info {room.name}: {roomSid}
        </h3>
      </section>
      <details open>
        <summary>
          <b>Local Participant: {lp.identity}</b>
        </summary>
        <details open className={styles.detailsSection}>
          <summary>
            <b>Published tracks</b>
          </summary>
          <div>
            {Array.from(lp.trackPublications.values()).map((t) => (
              <React.Fragment key={t.trackSid}>
                <div>
                  <i>
                    {t.source.toString()}
                    &nbsp;<span>{t.trackSid}</span>
                  </i>
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td>Kind</td>
                      <td>
                        {t.kind}&nbsp;
                        {t.kind === 'video' && (
                          <span>
                            {t.track?.dimensions?.width}x{t.track?.dimensions?.height}
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </React.Fragment>
            ))}
          </div>
        </details>
      </details>
    </div>
  );
};

// function trackStatus(t: RemoteTrackPublication): string {
//   if (t.isSubscribed) {
//     return 'subscribed';
//   } else if (t.isDesired) {
//     return 'desired';
//   } else {
//     return 'unsubscribed';
//   }
// }
