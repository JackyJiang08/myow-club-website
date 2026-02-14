import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUpcomingEvents } from '../utils/calendar';

const Home = () => {
  const { t } = useTranslation();
  const { events: upcomingActivities, loading, error } = useUpcomingEvents(4);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Header */}
      <div className="text-center mb-16 relative">
        {/* Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-32 bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">{t('home.hero_title')}</h1>
        <p className="text-2xl text-gray-600 font-light">{t('home.hero_subtitle')}</p>
        <p className="text-lg text-indigo-600 mt-3 font-semibold tracking-wide uppercase">{t('home.semester')}</p>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        
        {/* Announcements Section (Left - 2/3 width) */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
            {t('home.announcements')}
          </h2>
          
          <div className="bg-[#FFF9E5] rounded-[2rem] p-8 shadow-sm h-full border border-yellow-100/50">
            {/* Latest Announcement First */}
            <div className="mb-10 last:mb-0 relative pl-6 border-l-2 border-yellow-300/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-yellow-400 border-4 border-[#FFF9E5]"></div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{t('home.announcement_2_title')}</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('home.announcement_2_line1')}
                <br />
                {t('home.announcement_2_line2')}
                <br />
                {t('home.announcement_2_line3')}
              </p>
            </div>

            <div className="mb-10 last:mb-0 relative pl-6 border-l-2 border-yellow-300/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-yellow-200 border-4 border-[#FFF9E5]"></div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{t('home.announcement_1_title')}</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('home.announcement_1_text')}
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Section (Right - 1/3 width) */}
        <div className="lg:col-span-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
             <span className="w-2 h-8 bg-blue-400 rounded-full"></span>
             {t('home.upcoming')}
          </h2>
          
          <div className="bg-[#F3F4F6] rounded-[2rem] p-8 shadow-sm h-full border border-gray-100">
             <div className="space-y-6">
               {loading && <div className="text-gray-500 text-center py-4">Loading events...</div>}
               
               {!loading && upcomingActivities.map((activity) => (
                 <div key={activity.id} className="flex gap-4 group">
                   <div className="flex flex-col items-end min-w-[3.5rem]">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{new Date(activity.date).toLocaleString('en-US', { month: 'short' })}</span>
                     <span className="text-2xl font-bold text-gray-800 leading-none">{new Date(activity.date).getDate()}</span>
                   </div>
                   <div className="pt-1">
                     <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 text-lg leading-tight">{activity.title}</div>
                   </div>
                 </div>
               ))}

               {!loading && upcomingActivities.length === 0 && (
                 <div className="text-gray-500 text-center">No upcoming events found.</div>
               )}
             </div>
             <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <a href="/calendar" className="text-sm font-bold text-gray-500 hover:text-indigo-600 uppercase tracking-widest transition-colors">
                  View Full Calendar →
                </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
