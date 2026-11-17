export type MessageStatus = 'sending' | 'sent' | 'read';
export interface Message { id: string; chatId: string; author: 'me' | 'them'; text: string; at: number; status?: MessageStatus }
export interface Chat { id: string; name: string; avatar: string; online: boolean; unread: number; typing: boolean }
export interface State { chats: Chat[]; messages: Message[]; activeId: string | null }

export type Action =
  | { type: 'open'; chatId: string }
  | { type: 'close' }
  | { type: 'send'; chatId: string; id: string; text: string; at: number }
  | { type: 'status'; id: string; status: MessageStatus }
  | { type: 'typing'; chatId: string; typing: boolean }
  | { type: 'receive'; chatId: string; id: string; text: string; at: number };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return { ...state, activeId: action.chatId, chats: state.chats.map((c) => (c.id === action.chatId ? { ...c, unread: 0 } : c)) };
    case 'close':
      return { ...state, activeId: null };
    case 'send': {
      const text = action.text.trim();
      if (!text) return state;
      return { ...state, messages: [...state.messages, { id: action.id, chatId: action.chatId, author: 'me', text, at: action.at, status: 'sending' }] };
    }
    case 'status':
      return { ...state, messages: state.messages.map((m) => (m.id === action.id ? { ...m, status: action.status } : m)) };
    case 'typing':
      return { ...state, chats: state.chats.map((c) => (c.id === action.chatId ? { ...c, typing: action.typing } : c)) };
    case 'receive': {
      const isOpen = state.activeId === action.chatId;
      return {
        ...state,
        messages: [
          ...state.messages.map((m) => (m.chatId === action.chatId && m.author === 'me' ? { ...m, status: 'read' as const } : m)),
          { id: action.id, chatId: action.chatId, author: 'them', text: action.text, at: action.at },
        ],
        chats: state.chats.map((c) => (c.id === action.chatId ? { ...c, typing: false, unread: isOpen ? 0 : c.unread + 1 } : c)),
      };
    }
  }
}

export function lastMessage(state: State, chatId: string) {
  const list = state.messages.filter((m) => m.chatId === chatId);
  return list[list.length - 1];
}

/** Chats sorted by latest activity, optionally filtered by name or message text. */
export function chatList(state: State, query: string) {
  const q = query.trim().toLowerCase();
  return state.chats
    .filter((c) => !q || c.name.toLowerCase().includes(q) || state.messages.some((m) => m.chatId === c.id && m.text.toLowerCase().includes(q)))
    .sort((a, b) => (lastMessage(state, b.id)?.at ?? 0) - (lastMessage(state, a.id)?.at ?? 0));
}

/** Group messages by calendar day for day separators. */
export function groupByDay(messages: Message[], locale = 'en-GB') {
  const groups: { day: string; items: Message[] }[] = [];
  for (const m of messages) {
    const day = new Date(m.at).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
    const g = groups[groups.length - 1];
    if (g && g.day === day) g.items.push(m); else groups.push({ day, items: [m] });
  }
  return groups;
}

const replies = [
  'Sounds good! 👍', 'Let me check and get back to you.', 'Perfect, thanks for the quick update.',
  'Can we sync on this tomorrow at 10?', 'Great work – shipping it 🚀', 'Haha, fair point 😄',
];
export const pickReply = (seed: number) => replies[seed % replies.length];
