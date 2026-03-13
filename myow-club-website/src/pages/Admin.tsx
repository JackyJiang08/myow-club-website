import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  Calendar as CalendarIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  MousePointerClick,
  MapPin,
  TrendingUp,
  PieChart as PieChartIcon
} from 'lucide-react';
import { db, isRealConfigured } from '../firebase';
import { mockDb } from '../utils/mockDb';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp
} from 'firebase/firestore';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { format } from 'date-fns';

// --- Types ---
interface Announcement {
  id: string;
  title: string;
  content: string;
  date: any; // Firestore Timestamp
  type: 'general' | 'event';
}

interface ClubEvent {
  id: string;
  title: string;
  start: string; // ISO string for form
  end?: string;
  location: string;
  description: string;
}

// --- Constants ---
const UIUC_LOCATIONS = [
  "Grainger Engineering Library, Room 401",
  "Grainger Engineering Library, Room 429",
  "Illini Union, Room A",
  "Illini Union, Room B",
  "Siebel Center for Design, Room 1002",
  "Activities and Recreation Center (ARC)",
  "Main Quad",
  "Japan House"
];

const WORKSHOP_TYPES = [
  "Pixel Beads Workshop",
  "Stone Clay Sculpture",
  "Sealing Wax Workshop",
  "Pipe Cleaners Crafting"
];

// --- Analytics Data ---
const VISITOR_DATA = [
  { date: '2026-03-01', count: 45 },
  { date: '2026-03-02', count: 52 },
  { date: '2026-03-03', count: 38 },
  { date: '2026-03-04', count: 65 },
  { date: '2026-03-05', count: 48 },
  { date: '2026-03-06', count: 59 },
  { date: '2026-03-07', count: 85 },
];

const ACTIVITY_DISTRIBUTION = [
  { name: 'Pixel Beads', value: 35, color: '#8884d8' },
  { name: 'Stone Clay', value: 30, color: '#82ca9d' },
  { name: 'Sealing Wax', value: 20, color: '#ffc658' },
  { name: 'Pipe Cleaners', value: 15, color: '#ff8042' },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'calendar' | 'dashboard'>('announcements');
  const [loading, setLoading] = useState(false);
  const currentUserEmail = localStorage.getItem('adminUserEmail');
  
  // Analytics state
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  // --- Data State ---
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<ClubEvent[]>([]);

  // --- Form State ---
  const [newAnnouncement, setNewAnnouncement] = useState({ content: '', type: 'general' });
  const [newEvent, setNewEvent] = useState({ 
    title: WORKSHOP_TYPES[0], 
    date: '', 
    startTime: '', 
    endTime: '', 
    location: '', 
    description: '' 
  });

  // --- Fetch Data ---
  useEffect(() => {
    fetchAnnouncements();
    fetchEvents();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      if (isRealConfigured) {
        const q = query(collection(db, 'announcements'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
        setAnnouncements(data);
      } else {
        const data = await mockDb.announcements.getAll();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      if (isRealConfigured) {
        const q = query(collection(db, 'events'), orderBy('start', 'asc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClubEvent));
        setEvents(data);
      } else {
        const data = await mockDb.events.getAll();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // --- Handlers ---
  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const now = new Date();
    const title = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    try {
      const payload = {
        title,
        content: newAnnouncement.content,
        type: newAnnouncement.type,
        date: serverTimestamp() 
      };

      if (isRealConfigured) {
        await addDoc(collection(db, 'announcements'), payload);
      } else {
        await mockDb.announcements.add(payload);
      }
      
      setNewAnnouncement({ content: '', type: 'general' });
      fetchAnnouncements();
      alert('Announcement posted successfully!');
    } catch (error) {
      console.error("Error adding announcement:", error);
      alert('Failed to post announcement.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      if (isRealConfigured) {
        await deleteDoc(doc(db, 'announcements', id));
      } else {
        await mockDb.announcements.delete(id);
      }
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const startDateTime = new Date(`${newEvent.date}T${newEvent.startTime}`);
    let endDateTimeStr = '';
    if (newEvent.endTime) {
      endDateTimeStr = new Date(`${newEvent.date}T${newEvent.endTime}`).toISOString();
    }

    const payload = {
      title: newEvent.title,
      start: startDateTime.toISOString(),
      end: endDateTimeStr,
      location: newEvent.location,
      description: newEvent.description,
      created_at: serverTimestamp()
    };

    try {
      if (isRealConfigured) {
        await addDoc(collection(db, 'events'), payload);
      } else {
        await mockDb.events.add(payload);
      }

      setNewEvent({ 
        title: WORKSHOP_TYPES[0], 
        date: '', 
        startTime: '', 
        endTime: '', 
        location: '', 
        description: '' 
      });
      fetchEvents();
      alert('Event added to schedule!');
    } catch (error) {
      console.error("Error adding event:", error);
      alert('Failed to add event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      if (isRealConfigured) {
        await deleteDoc(doc(db, 'events', id));
      } else {
        await mockDb.events.delete(id);
      }
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminUserEmail');
    window.location.href = '/login';
  };

  const upcomingEvents = events.filter(e => new Date(e.start) >= new Date());

  // --- Render Components ---

  const renderDashboard = () => (
    <div className="space-y-8 animate-fadeIn pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Traffic Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Visitor Traffic
            </h3>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    timeRange === range 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VISITOR_DATA}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => format(new Date(str), 'MMM d')}
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVisits)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-indigo-500" />
            Activity Popularity
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ACTIVITY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ACTIVITY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Insights</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <MousePointerClick className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-xl font-bold text-gray-900">12,453</p>
                </div>
              </div>
              <span className="text-green-500 text-sm font-bold">+18%</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Events Hosted</p>
                  <p className="text-xl font-bold text-gray-900">{events.length}</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">All time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fadeIn">
      {/* Form - Larger (60%) */}
      <div className="lg:col-span-3">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Post Announcement</h3>
          <p className="text-sm text-gray-500 mb-4">
            The title will be automatically set to today's date: <span className="font-bold text-gray-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </p>
          <form onSubmit={handleAddAnnouncement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[200px]"
                rows={8}
                placeholder="Write your announcement here..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Posting...' : <><Plus className="w-4 h-4" /> Post Announcement</>}
            </button>
          </form>
        </div>
      </div>

      {/* List - Smaller (40%) */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Active Announcements</h3>
        {announcements.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
            No announcements yet.
          </div>
        ) : (
          announcements.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group relative hover:shadow-md transition-shadow">
              <button 
                onClick={() => handleDeleteAnnouncement(item.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <h4 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h4>
              <p className="text-gray-600 mb-3 whitespace-pre-wrap">{item.content}</p>
              <p className="text-xs text-gray-400 border-t pt-3 mt-3">
                Posted on {item.date?.seconds ? new Date(item.date.seconds * 1000).toLocaleDateString() : 'Just now'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fadeIn">
      {/* Form - Larger (60%) */}
      <div className="lg:col-span-3">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Add Event</h3>
          <div className="text-sm text-gray-500 mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="font-semibold text-blue-700 mb-1">Adding an event here will:</p>
            <ul className="list-disc list-inside text-blue-600 space-y-1">
              <li>Update the user's schedule</li>
              <li>Simulate a Google Calendar entry</li>
            </ul>
          </div>
          
          <form onSubmit={handleAddEvent} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Name</label>
                <select
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  required
                >
                  {WORKSHOP_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2 relative">
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    list="locations"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search for a location (e.g. Grainger)"
                  />
                  <datalist id="locations">
                    {UIUC_LOCATIONS.map((loc, i) => (
                      <option key={i} value={loc} />
                    ))}
                  </datalist>
                </div>
                <p className="text-xs text-gray-400 mt-1">Start typing to see autocomplete suggestions.</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Descriptions (e.g. Room Number)</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Additional details..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-[0.99]"
            >
              {loading ? 'Adding...' : <><Plus className="w-5 h-5" /> Add to Calendar</>}
            </button>
          </form>
        </div>
      </div>

      {/* List - Smaller (40%) */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Schedule</h3>
        {upcomingEvents.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
            No upcoming events.
          </div>
        ) : (
          upcomingEvents.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group relative flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-16 text-center bg-indigo-50 rounded-lg p-2">
                <p className="text-xs font-bold text-indigo-400 uppercase">{new Date(item.start).toLocaleString('default', { month: 'short' })}</p>
                <p className="text-xl font-bold text-indigo-700">{new Date(item.start).getDate()}</p>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-gray-900 text-lg truncate">{item.title}</h4>
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <span className="font-medium">
                      {new Date(item.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      {item.end && ` - ${new Date(item.end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
                    </span>
                  </p>
                  {item.location && (
                    <p className="flex items-start gap-1.5 text-gray-500">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handleDeleteEvent(item.id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 flex flex-col">
        <div className="p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border border-gray-200">
               <img 
                 src="/logo.png" 
                 alt="MYOW Logo" 
                 className="w-full h-full object-cover transform scale-150 translate-y-2"
               />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MYOW</h1>
            <h2 className="text-sm font-semibold text-gray-500">Admin Panel</h2>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('announcements')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'announcements' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Megaphone className="w-5 h-5" />
              Announcements
            </button>
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'calendar' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <CalendarIcon className="w-5 h-5" />
              Calendar
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden uppercase">
              {currentUserEmail ? currentUserEmail.charAt(0) : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">Leaderships</p>
              <p className="text-xs text-gray-500 truncate" title={currentUserEmail || ''}>{currentUserEmail}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 capitalize">{activeTab}</h2>
          <p className="text-gray-500">Manage club's content and view insights.</p>
        </header>
        
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'announcements' && renderAnnouncements()}
        {activeTab === 'calendar' && renderCalendar()}
      </div>
    </div>
  );
};

export default Admin;
