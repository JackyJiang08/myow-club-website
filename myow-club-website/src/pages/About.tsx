import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-white rounded-[2.5rem] p-12 md:p-20 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-12 text-gray-900 tracking-tight">{t('about.title')}</h1>
          
          <div className="space-y-8 text-xl text-gray-700 leading-relaxed">
             <p className="font-bold">
               {t('about.mission_text')}
             </p>
             <p className="font-bold">
               {t('about.paragraph_2')}
             </p>
             <p className="font-bold">
               {t('about.membership_text')}
             </p>
          </div>
          
          <div className="mt-16 pt-12 border-t border-gray-100">
             <p className="text-gray-500 italic font-serif text-2xl">"{t('about.bottom_quote')}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
