import { useTranslation } from 'react-i18next';

const CalendarPage = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">{t('nav.calendar')}</h1>
      
      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
        <iframe 
          src="https://calendar.google.com/calendar/embed?src=c_84c7a88801d3f777c9d8919feac1f66eea1a56d837a9d7a86706fe930586d4d5%40group.calendar.google.com&ctz=America%2FChicago" 
          style={{border: 0}} 
          width="100%" 
          height="800" 
          title="Club Calendar"
          className="rounded-xl w-full"
        ></iframe>
      </div>
    </div>
  );
};

export default CalendarPage;
