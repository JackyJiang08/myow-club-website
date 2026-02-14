import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Placeholder for staff images - using animal emojis as requested for now
const StaffCard = ({ name, title, bio, pronouns, emoji }: { name: string, title: string, bio?: string, pronouns?: string, emoji: string }) => {
  const { t } = useTranslation();

  return (
    <div className="h-[320px] w-full cursor-pointer group relative max-w-sm mx-auto">
      <div className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col items-center justify-center text-center transition-all duration-300">
        
        {/* Front Content (Always visible initially) */}
        <div className="flex flex-col items-center justify-center w-full h-full transition-opacity duration-300 group-hover:opacity-0 absolute inset-0 p-6 z-10">
          <div className="w-32 h-32 bg-gray-50 rounded-[2rem] flex items-center justify-center text-6xl mb-6 overflow-hidden shadow-sm">
             {/* In a real app, this would be an <img> */}
            {emoji}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
          <p className="text-xs text-gray-500 mb-3 italic font-medium">({pronouns})</p>
          <p className="text-gray-800 font-medium text-sm">{title}</p>
          <p className="mt-auto text-[10px] text-gray-400 font-medium tracking-wide uppercase pt-4">
            {t('staff.click_to_see_bio')}
          </p>
        </div>

        {/* Back Content (Visible on Hover) */}
        <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-3xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{name}</h3>
          <p className="text-gray-700 text-center leading-relaxed font-medium text-sm overflow-y-auto scrollbar-hide max-h-full">
            {bio || t('staff.bio_placeholder')}
          </p>
        </div>
      </div>
    </div>
  );
};

const Staff = () => {
  const { t } = useTranslation();

  const staffMembers = [
    { id: 'estella', key: 'estella', emoji: '👩🏻‍💼', pronouns: 'she/her' },
    { id: 'henry', key: 'henry', emoji: '👨🏻‍💼', pronouns: 'he/him' },
    { id: 'joe', key: 'joe', emoji: '🧑🏻‍💻', pronouns: 'he/him' },
    { id: 'yuki', key: 'yuki', emoji: '👩🏻‍💻', pronouns: 'she/her' },
    { id: 'jacky', key: 'jacky', emoji: '📝', pronouns: 'he/him', bio: "Hi! My name is Jacky, and I'm a junior majoring in Computer Science & Statistics, who loves traveling, astronomy, and music! Let me know if you have any recs:)" },
    { id: 'anqi', key: 'anqi', emoji: '🎨', pronouns: 'she/her' },
    { id: 'sihan', key: 'sihan', emoji: '🤝', pronouns: 'she/her' },
    { id: 'mu', key: 'mu', emoji: '📅', pronouns: 'he/him' },
    { id: 'yaxin', key: 'yaxin', emoji: '🗓️', pronouns: 'she/her' },
  ];

  return (
    <div className="container mx-auto px-8 lg:px-16 py-12 max-w-[1400px]">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">{t('staff.title')}</h1>
        <p className="text-xl text-gray-600">Meet the leadership team behind MYOW DIY Club</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {staffMembers.map((member) => (
          <StaffCard 
            key={member.id}
            name={t(`staff.${member.key}.name`)}
            title={t(`staff.${member.key}.title`)}
            emoji={member.emoji}
            pronouns={member.pronouns}
            bio={member.bio}
          />
        ))}
      </div>
    </div>
  );
};

export default Staff;
