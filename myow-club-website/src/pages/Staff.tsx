import { useTranslation } from 'react-i18next';

// Placeholder for staff images - using animal emojis as requested for now
const StaffCard = ({ name, title, bio, pronouns, emoji, imgSrc }: { name: string, title: string, bio?: string, pronouns?: string, emoji: string, imgSrc?: string }) => {
  const { t } = useTranslation();

  return (
    <div className="h-[320px] w-full cursor-pointer group relative max-w-sm mx-auto">
      <div className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col items-center justify-center text-center transition-all duration-300">
        
        {/* Front Content (Always visible initially) */}
        <div className="flex flex-col items-center justify-center w-full h-full transition-opacity duration-300 group-hover:opacity-0 absolute inset-0 p-6 z-10">
          <div className="w-32 h-32 bg-gray-50 rounded-[2rem] flex items-center justify-center text-6xl mb-6 overflow-hidden shadow-sm relative">
            {imgSrc ? (
              <img 
                src={imgSrc} 
                alt={name} 
                className={`w-full h-full ${name.includes('Mu Li') || name.includes('Sihan') || name.includes('Joe') || name.includes('Jacky') ? 'object-cover object-[50%_25%]' : name.includes('Henry') ? 'object-cover object-[30%_50%]' : name.includes('Estella') || name.includes('Yuki') ? 'object-cover object-[50%_35%]' : 'object-cover'}`} 
              />
            ) : (
              emoji
            )}
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
    { id: 'estella', key: 'estella', emoji: '👩🏻‍💼', pronouns: 'she/her', imgSrc: '/estella.png', bio: "Hi! My name is Estella Wang, and I am a junior in Materials Science and Engineering. I am passionate about making handicrafts to decorate my home and give them to my friends as unique. Being immersed in the process of creating helps me relax and brings me joy." },
    { id: 'henry', key: 'henry', emoji: '👨🏻‍💼', pronouns: 'he/him', imgSrc: '/henry.png', bio: "Hello everyone, My name is Hanzhi, and I am the Vice President of MYOW and a student studying Materials Engineering. It's nice to meet you all, and I hope you all have a great time in MYOW!" },
    { id: 'joe', key: 'joe', emoji: '🧑🏻‍💻', pronouns: 'he/him', imgSrc: '/joe.png', bio: "I don't have a proper introduction comes in mind.." },
    { id: 'jacky', key: 'jacky', emoji: '📝', pronouns: 'he/him', imgSrc: '/jacky.png', bio: "Hi! My name is Jacky, and I'm a junior majoring in Computer Science & Statistics, who loves traveling, astronomy, and music! Let me know if you have any recs:) I'm also the one who built this web, so feel free to reach out if you have any suggestions!" },
    { id: 'yuki', key: 'yuki', emoji: '👩🏻‍💻', pronouns: 'she/her', imgSrc: '/yuki.png', bio: "Hi, I’m Yuki Yong, a junior at UIUC studying CS and Statistics. I enjoy hands-on projects and exploring creative ideas through technology." },
    { id: 'anqi', key: 'anqi', emoji: '🎨', pronouns: 'she/her', imgSrc: '/anqi.png', bio: "Majoring in Graphic Design with a minor in Game Design. I’m interested in visual design and also exploring some interactive work, and I’m still figuring out what direction I want to focus on in the future." },
    { id: 'sihan', key: 'sihan', emoji: '🤝', pronouns: 'she/her', imgSrc: '/sihan.png', bio: "My name is Sihan Huang, and I am a sophomore responsible for social media promotion in the MYOW DIY Club. I enjoy handmade crafts and have a strong passion for creativity. I’m always happy to support and assist every member in the club, whether it’s sharing ideas or helping bring projects to life. I look forward to connecting with more people and spreading the joy of DIY!" },
    { id: 'mu', key: 'mu', emoji: '📅', pronouns: 'he/him', imgSrc: '/mu.png', bio: "Someone who is always happy and ready to provide assistance. Major in Statstics and Mathematics, minor in Computer Science." },
    { id: 'yaxin', key: 'yaxin', emoji: '🗓️', pronouns: 'she/her', imgSrc: '/yaxin.png', bio: "Cat person majoring in Psych, that has a great passion in DIY crafts." },
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
            imgSrc={member.imgSrc}
          />
        ))}
      </div>
    </div>
  );
};

export default Staff;
