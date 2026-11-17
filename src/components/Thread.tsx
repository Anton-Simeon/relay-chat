import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { groupByDay, type Chat, type Message } from '../chat';

interface Props { chat: Chat; messages: Message[]; onBack: () => void; onSend: (text: string) => void }

const ticks = { sending: '🕓', sent: '✓', read: '✓✓' } as const;

export function Thread({ chat, messages, onBack, onSend }: Props) {
  const [text, setText] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length, chat.typing]);
  useEffect(() => { input.current?.focus(); }, [chat.id]);

  const submit = () => { if (!text.trim()) return; onSend(text); setText(''); };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  return (
    <section className="thread" aria-label={`Chat with ${chat.name}`}>
      <header className="thread__head">
        <button className="back" onClick={onBack} aria-label="Back to chats">←</button>
        <span className="avatar">{chat.avatar}</span>
        <div>
          <strong>{chat.name}</strong>
          <small>{chat.typing ? 'typing…' : chat.online ? 'online' : 'last seen recently'}</small>
        </div>
      </header>
      <div className="messages" role="log" aria-live="polite">
        {groupByDay(messages).map((g) => (
          <div key={g.day}>
            <p className="day"><span>{g.day}</span></p>
            {g.items.map((m) => (
              <div key={m.id} className={`bubble bubble--${m.author}`}>
                <p>{m.text}</p>
                <small>
                  {new Date(m.at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  {m.status && <span className={`tick tick--${m.status}`} aria-label={m.status}> {ticks[m.status]}</span>}
                </small>
              </div>
            ))}
          </div>
        ))}
        {chat.typing && <div className="bubble bubble--them typing" aria-label="typing"><i /><i /><i /></div>}
        <div ref={end} />
      </div>
      <footer className="composer">
        <textarea ref={input} rows={1} placeholder="Write a message…" title="Enter to send, Shift+Enter for a new line" value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={onKey} aria-label="Message" />
        <button className="send" onClick={submit} disabled={!text.trim()} aria-label="Send">➤</button>
      </footer>
    </section>
  );
}
