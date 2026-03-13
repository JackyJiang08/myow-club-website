import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, isRealConfigured } from '../firebase';
import { mockDb } from './mockDb';

// Interface for Club Events stored in Firestore
export interface ClubEvent {
  id: string;
  title: string;
  start: string; // ISO date string
  end?: string;
  location?: string;
  description?: string;
}

// Interface for Announcements stored in Firestore
export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: any; 
  type: 'general' | 'event';
}

export const useUpcomingEvents = (maxEvents = 4) => {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const now = new Date();
        let allEvents: ClubEvent[] = [];

        if (isRealConfigured) {
          // Query events where 'start' is greater than now
          const q = query(collection(db, 'events'), orderBy('start', 'asc'));
          const querySnapshot = await getDocs(q);
          allEvents = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as ClubEvent));
        } else {
          // Use Mock DB
          allEvents = await mockDb.events.getAll();
        }

        // Filter for future events
        const futureEvents = allEvents
          .filter(event => new Date(event.start) >= now)
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
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

export const useAnnouncements = (maxLimit = 2) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        let data: Announcement[] = [];

        if (isRealConfigured) {
          const q = query(collection(db, 'announcements'), orderBy('date', 'desc'));
          const querySnapshot = await getDocs(q);
          data = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          } as Announcement));
        } else {
          // Use Mock DB
          data = await mockDb.announcements.getAll();
        }
        
        setAnnouncements(data.slice(0, maxLimit));
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [maxLimit]);

  return { announcements, loading };
};
