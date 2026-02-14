import React from 'react';
import { useTranslation } from 'react-i18next';

const ActivityCard = ({ id, title, description, imageSrc }: { id: string, title: string, description: React.ReactNode, imageSrc: string }) => (
  <div id={id} className="scroll-mt-24 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
    <div className="h-64 w-full relative overflow-hidden bg-gray-100">
      <img 
        src={imageSrc} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
    </div>
    <div className="p-8 flex-grow flex flex-col">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>
      <div className="text-gray-600 leading-relaxed flex-grow space-y-4 text-lg">
        {description}
      </div>
    </div>
  </div>
);

const Activities = () => {
  const { t } = useTranslation();

  const links = [
    { id: 'pixel-beads', label: t('activities.pixel_beads.title') },
    { id: 'stone-clay', label: t('activities.stone_clay.title') },
    { id: 'sealing-wax', label: t('activities.sealing_wax.title') },
    { id: 'pipe-cleaners', label: t('activities.pipe_cleaners.title') },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">{t('activities.title')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Explore our diverse range of workshops designed to unleash your creativity.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 sticky top-24 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 px-2 uppercase text-sm tracking-wider">Contents</h3>
          <nav className="space-y-1">
            {links.map((link) => (
              <a 
                key={link.id}
                href={`#${link.id}`}
                className="block px-3 py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors font-medium text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-12">
          {/* Pixel Beads */}
          <ActivityCard 
            id="pixel-beads"
            title={t('activities.pixel_beads.title')}
            imageSrc="/images/activities/activity-1.png"
            description={
              <>
                <p>{t('activities.pixel_beads.description_1')}</p>
                <p>{t('activities.pixel_beads.description_2')}</p>
              </>
            }
          />

          {/* Stone Clay */}
          <ActivityCard 
            id="stone-clay"
            title={t('activities.stone_clay.title')}
            imageSrc="/images/activities/activity-2.png"
            description={
              <>
                <p>{t('activities.stone_clay.description_1')}</p>
                <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 my-4">
                  <p className="mb-4">{t('activities.stone_clay.description_2')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>{t('activities.stone_clay.description_3')}</li>
                    <li>{t('activities.stone_clay.description_4')}</li>
                  </ul>
                </div>
              </>
            }
          />

          {/* Sealing Wax */}
          <ActivityCard 
            id="sealing-wax"
            title={t('activities.sealing_wax.title')}
            imageSrc="/images/activities/activity-3.png"
            description={<p>{t('activities.sealing_wax.description')}</p>}
          />

          {/* Pipe Cleaners */}
          <ActivityCard 
            id="pipe-cleaners"
            title={t('activities.pipe_cleaners.title')}
            imageSrc="/images/activities/activity-4.png"
            description={<p>{t('activities.pipe_cleaners.description')}</p>}
          />
        </div>
      </div>
    </div>
  );
};

export default Activities;
