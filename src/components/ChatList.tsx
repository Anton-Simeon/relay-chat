import type { State } from '../chat';
import { chatList, lastMessage } from '../chat';

interface Props { state: State; query: string; onQuery: (q: string) => void; onOpen: (id: string) => void }

const time = (at: number) => {
  const d = new Date(at);
  return Date.now() - at < 86_400_000 ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export function ChatList({ state, query, onQuery, onOpen }: Props) {
  const list = chatList(state, query);
  return (
    <aside className="list" aria-label="Conversations">
      <header className="list__head">
        <h1>Relay</h1>
        <input type="search" placeholder="Search chats and messages" value={query} onChange={(e) => onQuery(e.target.value)} aria-label="Search" />
      </header>
      <ul>
        {list.map((c) => {
          const last = lastMessage(state, c.id);
          return (
            <li key={c.id}>
              <button className={`chat-item ${state.activeId === c.id ? 'chat-item--active' : ''}`} onClick={() => onOpen(c.id)}>
                <span className="avatar">{c.avatar}{c.online && <i className="dot" aria-label="online" />}</span>
                <span className="chat-item__body">
                  <span className="chat-item__top"><strong>{c.name}</strong>{last && <small>{time(last.at)}</small>}</span>
                  <span className="chat-item__bottom">
                    <span className="preview">{c.typing ? <em>typing…</em> : `${last?.author === 'me' ? 'You: ' : ''}${last?.text ?? ''}`}</span>
                    {c.unread > 0 && <span className="unread" aria-label={`${c.unread} unread`}>{c.unread}</span>}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
        {list.length === 0 && <li className="none">No chats found.</li>}
      </ul>
    </aside>
  );
}
