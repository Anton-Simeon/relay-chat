import { describe, expect, it } from 'vitest';
import { chatList, groupByDay, reducer, type State } from './chat';

const base: State = {
  activeId: null,
  chats: [
    { id: 'a', name: 'Alice', avatar: 'A', online: true, unread: 3, typing: false },
    { id: 'b', name: 'Bob', avatar: 'B', online: false, unread: 0, typing: false },
  ],
  messages: [
    { id: '1', chatId: 'a', author: 'them', text: 'hello', at: 1000 },
    { id: '2', chatId: 'b', author: 'them', text: 'release notes', at: 2000 },
  ],
};

describe('reducer', () => {
  it('opening a chat clears its unread counter', () => {
    const s = reducer(base, { type: 'open', chatId: 'a' });
    expect(s.activeId).toBe('a');
    expect(s.chats[0].unread).toBe(0);
  });

  it('sends optimistically and ignores empty messages', () => {
    const s = reducer(base, { type: 'send', chatId: 'a', id: 'x', text: '  hi  ', at: 3000 });
    expect(s.messages[2]).toEqual({ id: 'x', chatId: 'a', author: 'me', text: 'hi', at: 3000, status: 'sending' });
    expect(reducer(base, { type: 'send', chatId: 'a', id: 'y', text: '   ', at: 3000 })).toBe(base);
  });

  it('a reply marks my messages as read and counts unread for closed chats', () => {
    let s = reducer(base, { type: 'send', chatId: 'b', id: 'x', text: 'ping', at: 3000 });
    s = reducer(s, { type: 'receive', chatId: 'b', id: 'r', text: 'pong', at: 4000 });
    expect(s.messages.find((m) => m.id === 'x')?.status).toBe('read');
    expect(s.chats.find((c) => c.id === 'b')?.unread).toBe(1);
  });
});

describe('selectors', () => {
  it('sorts chats by latest message and searches message text', () => {
    expect(chatList(base, '').map((c) => c.id)).toEqual(['b', 'a']);
    expect(chatList(base, 'release').map((c) => c.id)).toEqual(['b']);
  });

  it('groups messages by day', () => {
    const day = 86_400_000;
    const groups = groupByDay([
      { id: '1', chatId: 'a', author: 'me', text: 'x', at: day * 10 },
      { id: '2', chatId: 'a', author: 'me', text: 'y', at: day * 10 + 60_000 },
      { id: '3', chatId: 'a', author: 'me', text: 'z', at: day * 12 },
    ]);
    expect(groups.length).toBe(2);
    expect(groups[0].items.length).toBe(2);
  });
});
