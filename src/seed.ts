import type { State } from './chat';

const now = Date.now();
const h = 3600_000;

export const seed: State = {
  activeId: null,
  chats: [
    { id: 'c1', name: 'Design Team', avatar: '🎨', online: true, unread: 2, typing: false },
    { id: 'c2', name: 'Lena Huber', avatar: 'LH', online: true, unread: 0, typing: false },
    { id: 'c3', name: 'Max Steiner', avatar: 'MS', online: false, unread: 1, typing: false },
    { id: 'c4', name: 'Release 2.4', avatar: '🚀', online: true, unread: 0, typing: false },
    { id: 'c5', name: 'Sofia Berger', avatar: 'SB', online: false, unread: 0, typing: false },
  ],
  messages: [
    { id: 'm1', chatId: 'c1', author: 'them', text: 'New checkout mockups are in Figma 🎉', at: now - 26 * h },
    { id: 'm2', chatId: 'c1', author: 'me', text: 'Nice! I will start with the mobile flow.', at: now - 25.5 * h, status: 'read' },
    { id: 'm3', chatId: 'c1', author: 'them', text: 'Can you also add the empty states?', at: now - 0.6 * h },
    { id: 'm4', chatId: 'c1', author: 'them', text: 'And dark mode, if it is not too much 🙏', at: now - 0.5 * h },
    { id: 'm5', chatId: 'c2', author: 'me', text: 'PR for the table virtualisation is ready for review.', at: now - 3 * h, status: 'read' },
    { id: 'm6', chatId: 'c2', author: 'them', text: 'Looks great, approved ✅', at: now - 2.8 * h },
    { id: 'm7', chatId: 'c3', author: 'them', text: 'Are we still on for the demo on Friday?', at: now - 5 * h },
    { id: 'm8', chatId: 'c4', author: 'them', text: 'Lighthouse score after the image changes: 98 → 100', at: now - 50 * h },
    { id: 'm9', chatId: 'c5', author: 'me', text: 'Thanks for the feedback on the onboarding!', at: now - 72 * h, status: 'read' },
  ],
};
