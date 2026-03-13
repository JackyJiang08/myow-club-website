// A simple mock database using localStorage to simulate Firestore
// This allows the app to work locally without Firebase configuration

import en from '../locales/en.json';

const STORAGE_KEYS = {
  ANNOUNCEMENTS: 'mock_db_announcements',
  EVENTS: 'mock_db_events'
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Pre-seed data from translation file
const SEED_ANNOUNCEMENTS = [
  {
    id: 'mock_ann_2',
    title: en.home.announcement_2_title,
    content: `${en.home.announcement_2_line1}\n${en.home.announcement_2_line2}\n${en.home.announcement_2_line3}`,
    date: { seconds: new Date('2026-02-13').getTime() / 1000 },
    type: 'event'
  },
  {
    id: 'mock_ann_1',
    title: en.home.announcement_1_title,
    content: en.home.announcement_1_text,
    date: { seconds: new Date('2026-01-20').getTime() / 1000 },
    type: 'general'
  }
];

// Pre-seed data for events (extracted from previous calendar.ts MOCK_EVENTS)
const SEED_EVENTS = [
  // Upcoming Events from the screenshot/previous context
  { id: '2', start: '2026-02-19T17:00:00', title: 'Pixel Beads Workshop', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '3', start: '2026-02-24T17:00:00', title: 'Stone Clay Sculpture', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '4', start: '2026-03-03T17:00:00', title: 'Stone Clay Sculpture', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '5', start: '2026-03-05T17:00:00', title: 'Pixel Beads Workshop', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '6', start: '2026-03-10T17:00:00', title: 'Stone Clay Sculpture', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '7', start: '2026-03-12T17:00:00', title: 'Pixel Beads Workshop', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '8', start: '2026-03-24T17:00:00', title: 'Stone Clay Sculpture', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '9', start: '2026-03-31T17:00:00', title: 'Stone Clay Sculpture', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '10', start: '2026-04-02T17:00:00', title: 'Pixel Beads Workshop', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '11', start: '2026-04-07T17:00:00', title: 'Stone Clay Sculpture', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '12', start: '2026-04-14T17:00:00', title: 'Stone Clay Sculpture', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '13', start: '2026-04-16T17:00:00', title: 'Pixel Beads Workshop', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '14', start: '2026-04-21T17:00:00', title: 'Stone Clay Sculpture', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '15', start: '2026-04-28T17:00:00', title: 'Stone Clay Sculpture', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '16', start: '2026-04-30T17:00:00', title: 'Pixel Beads Workshop', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '17', start: '2026-05-05T17:00:00', title: 'Stone Clay Sculpture', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
  { id: '18', start: '2026-05-07T17:00:00', title: 'Pixel Beads Workshop', location: 'Grainger Engineering Library Room 401', description: 'Weekly Workshop' },
];

export const mockDb = {
  announcements: {
    add: async (data: any) => {
      await delay(500);
      const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '[]');
      const newItem = { 
        id: 'mock_' + Date.now(), 
        ...data,
        date: { seconds: Date.now() / 1000 } // Simulate Firestore Timestamp
      };
      items.unshift(newItem);
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(items));
      return newItem;
    },
    getAll: async () => {
      await delay(500);
      const stored = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      if (!stored) {
        // First time load: Seed with default data
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
        return SEED_ANNOUNCEMENTS;
      }
      return JSON.parse(stored);
    },
    delete: async (id: string) => {
      await delay(300);
      const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '[]');
      const filtered = items.filter((item: any) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(filtered));
    }
  },
  events: {
    add: async (data: any) => {
      await delay(500);
      const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
      const newItem = { 
        id: 'mock_' + Date.now(), 
        ...data,
        created_at: { seconds: Date.now() / 1000 }
      };
      items.push(newItem);
      // Sort by start date
      items.sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime());
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(items));
      return newItem;
    },
    getAll: async () => {
      await delay(500);
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!stored) {
        // First time load: Seed with default data
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
        return SEED_EVENTS;
      }
      return JSON.parse(stored);
    },
    delete: async (id: string) => {
      await delay(300);
      const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
      const filtered = items.filter((item: any) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filtered));
    }
  }
};
