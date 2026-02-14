import { useState, useEffect } from 'react';

// TODO: To make this work with real Google Calendar data:
// 1. Make your calendar "Public" in Google Calendar settings.
// 2. Get a Google Calendar API Key from Google Cloud Console.
// 3. Replace 'YOUR_API_KEY' below with your actual key.

const GOOGLE_CALENDAR_ID = 'c_84c7a88801d3f777c9d8919feac1f66eea1a56d837a9d7a86706fe930586d4d5@group.calendar.google.com';
const API_KEY = ''; // Leave empty to use mock data, or fill in to fetch real data

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  location?: string;
}

// FULL SCHEDULE based on the provided screenshots
const MOCK_EVENTS: CalendarEvent[] = [
  // Past events
  { id: '1', date: '2026-02-13T17:00:00', title: 'Pipe Cleaners Crafting' },

  // Upcoming Events
  { id: '2', date: '2026-02-19T17:00:00', title: 'Pixel Beads Workshop' },
  { id: '3', date: '2026-02-24T17:00:00', title: 'Stone Clay Sculpture' },
  { id: '4', date: '2026-03-03T17:00:00', title: 'Stone Clay Sculpture' },
  { id: '5', date: '2026-03-05T17:00:00', title: 'Pixel Beads Workshop' },
  { id: '6', date: '2026-03-10T17:00:00', title: 'Stone Clay Sculpture' },
  { id: '7', date: '2026-03-12T17:00:00', title: 'Pixel Beads Workshop' },
  { id: '8', date: '2026-03-24T17:00:00', title: 'Stone Clay Sculpture' },
  { id: '9', date: '2026-03-31T17:00:00', title: 'Stone Clay Sculpture' },
  { id: '10', date: '2026-04-02T17:00:00', title: 'Pixel Beads Workshop' },
  { id: '11', date: '2026-04-07T17:00:00', title: 'Stone Clay Sculpture' },
  { id: '12', date: '2026-04-14T17:00:00', title: 'Stone Clay Sculpture' },
  { id: '13', date: '2026-04-16T17:00:00', title: 'Pixel Beads Workshop' },
  { id: '14', date: '2026-04-21T17:00:00', title: 'Stone Clay Sculpture' },
  { id: '15', date: '2026-04-28T17:00:00', title: 'Stone Clay Sculpture' },
  { id: '16', date: '2026-04-30T17:00:00', title: 'Pixel Beads Workshop' },
  { id: '17', date: '2026-05-05T17:00:00', title: 'Stone Clay Sculpture' },
  { id: '18', date: '2026-05-07T17:00:00', title: 'Pixel Beads Workshop' },
];

export const useUpcomingEvents = (maxEvents = 4) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let allEvents = [...MOCK_EVENTS];

        if (API_KEY) {
          // API fetch logic (omitted for brevity)
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const futureEvents = allEvents
          .filter(event => new Date(event.date) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, maxEvents);

        setEvents(futureEvents);
        
      } catch (err) {
        console.error('Error in event fetching:', err);
        setError('Could not load events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [maxEvents]);

  return { events, loading, error };
};
