import { useEffect, useReducer, useRef, useState } from 'react';
import { pickReply, reducer, type State } from './chat';
import { seed } from './seed';
import { ChatList } from './components/ChatList';
import { Thread } from './components/Thread';

function load(): State {
  try {
    const raw = localStorage.getItem('relay-chat');
    if (raw) return { ...(JSON.parse(raw) as State), activeId: null };
  } catch { /* storage unavailable */ }
  return seed;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [query, setQuery] = useState('');
  const counter = useRef(0);
  const active = state.chats.find((c) => c.id === state.activeId) ?? null;

  useEffect(() => { try { localStorage.setItem('relay-chat', JSON.stringify(state)); } catch { /* ignore */ } }, [state]);

  // Simulate the other side: a message arrives in another chat after a while.
  useEffect(() => {
    const id = setTimeout(() => dispatch({ type: 'receive', chatId: 'c4', id: `in-${Date.now()}`, text: 'Build #812 passed – ready to deploy?', at: Date.now() }), 9000);
    return () => clearTimeout(id);
  }, []);

  const send = (text: string) => {
    if (!active) return;
    const chatId = active.id;
    const id = `m-${Date.now()}`;
    const n = ++counter.current;
    dispatch({ type: 'send', chatId, id, text, at: Date.now() });
    setTimeout(() => dispatch({ type: 'status', id, status: 'sent' }), 600);
    setTimeout(() => dispatch({ type: 'typing', chatId, typing: true }), 1200);
    setTimeout(() => dispatch({ type: 'receive', chatId, id: `r-${Date.now()}`, text: pickReply(n + text.length), at: Date.now() }), 2800);
  };

  return (
    <div className={`app ${active ? 'app--thread' : ''}`}>
      <ChatList state={state} query={query} onQuery={setQuery} onOpen={(id) => dispatch({ type: 'open', chatId: id })} />
      {active ? (
        <Thread chat={active} messages={state.messages.filter((m) => m.chatId === active.id)} onBack={() => dispatch({ type: 'close' })} onSend={send} />
      ) : (
        <section className="placeholder"><p>Select a conversation to start chatting.</p><small>Demo – replies are simulated in the browser.</small></section>
      )}
    </div>
  );
}
