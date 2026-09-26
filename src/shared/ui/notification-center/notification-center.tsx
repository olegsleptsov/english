import { useEffect, useRef, useState } from 'react';

import { subscribeNotify, type NotifyMessage } from '@/shared/lib/notify';

import styles from './notification-center.module.css';

type VisibleNotifyMessage = NotifyMessage & {
  isLeaving: boolean;
};

const NOTIFY_EXIT_ANIMATION_MS = 220;
const FIREWORK_SPARKS = Array.from({ length: 18 }, (_, index) => index);
const FIREWORK_GROUPS = [
  styles.fireworkPrimary,
  styles.fireworkSecondary,
  styles.fireworkTertiary,
  styles.fireworkQuaternary,
  styles.fireworkQuinary,
  styles.fireworkSenary,
];

export function NotificationCenter() {
  const [messages, setMessages] = useState<VisibleNotifyMessage[]>([]);
  const timerIds = useRef<number[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeNotify((message) => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          ...message,
          isLeaving: false,
        },
      ]);

      const timerId = window.setTimeout(() => {
        closeNotify(message.id);
      }, message.durationMs);

      timerIds.current.push(timerId);
    });

    return () => {
      unsubscribe();
      timerIds.current.forEach((timerId) => window.clearTimeout(timerId));
      timerIds.current = [];
    };
  }, []);

  function closeNotify(id: string) {
    setMessages((currentMessages) =>
      currentMessages.map((message) =>
        message.id === id
          ? {
              ...message,
              isLeaving: true,
            }
          : message,
      ),
    );

    window.setTimeout(() => {
      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== id),
      );
    }, NOTIFY_EXIT_ANIMATION_MS);
  }

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className={styles.viewport} aria-live="polite" aria-relevant="additions">
      {messages.map((message) => (
        <article
          className={
            message.isLeaving
              ? `${styles.toast} ${styles.toastLeaving}`
              : styles.toast
          }
          data-tone={message.tone}
          key={message.id}
        >
          <div className={styles.fireworks} aria-hidden="true">
            {FIREWORK_GROUPS.map((fireworkGroup) => (
              <div
                className={`${styles.firework} ${fireworkGroup}`}
                key={fireworkGroup}
              >
                {FIREWORK_SPARKS.map((spark) => (
                  <span key={spark} />
                ))}
              </div>
            ))}
          </div>
          <div className={styles.icon} aria-hidden="true">
            ✓
          </div>
          <div className={styles.content}>
            <strong>{message.title}</strong>
            {message.description ? <p>{message.description}</p> : null}
          </div>
          <button
            className={styles.closeButton}
            type="button"
            aria-label="Закрыть уведомление"
            onClick={() => closeNotify(message.id)}
          >
            ×
          </button>
        </article>
      ))}
    </div>
  );
}
