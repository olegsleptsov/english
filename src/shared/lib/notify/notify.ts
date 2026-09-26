export type NotifyTone = 'success' | 'info';

export type NotifyMessage = {
  id: string;
  title: string;
  description?: string;
  durationMs: number;
  tone: NotifyTone;
};

export type ShowNotifyParams = {
  title: string;
  description?: string;
  durationMs?: number;
  tone?: NotifyTone;
};

const NOTIFY_EVENT_NAME = 'polyglot:notify';
const DEFAULT_NOTIFY_DURATION_MS = 4200;
const notifyTarget = new EventTarget();

export function showNotify({
  description,
  durationMs = DEFAULT_NOTIFY_DURATION_MS,
  title,
  tone = 'info',
}: ShowNotifyParams) {
  const message: NotifyMessage = {
    description,
    durationMs,
    id: createNotifyId(),
    title,
    tone,
  };

  notifyTarget.dispatchEvent(
    new CustomEvent<NotifyMessage>(NOTIFY_EVENT_NAME, {
      detail: message,
    }),
  );

  return message.id;
}

export function subscribeNotify(
  listener: (message: NotifyMessage) => void,
) {
  function handleNotify(event: Event) {
    listener((event as CustomEvent<NotifyMessage>).detail);
  }

  notifyTarget.addEventListener(NOTIFY_EVENT_NAME, handleNotify);

  return () => {
    notifyTarget.removeEventListener(NOTIFY_EVENT_NAME, handleNotify);
  };
}

function createNotifyId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
