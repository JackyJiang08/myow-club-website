import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star, Crown, Ticket, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, content }: { isOpen: boolean, onClose: () => void, title: string, content: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-xl z-10"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
          <div className="text-gray-600 leading-relaxed">
            {content}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Membership = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'member' | 'paid' | null>(null);

  const handleJoinClick = (type: 'member' | 'paid') => {
    setModalType(type);
    setModalOpen(true);
  };

  const tiers = [
    {
      name: t('membership.member.name'),
      price: t('membership.member.price'),
      icon: <Ticket className="w-8 h-8 text-indigo-500" />,
      features: [
        t('membership.member.feature_1'),
        t('membership.member.feature_2'),
      ],
      color: 'bg-indigo-50 border-indigo-200',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
      type: 'member' as const
    },
    {
      name: t('membership.vip.name'),
      price: t('membership.vip.price'),
      icon: <Star className="w-8 h-8 text-amber-500" />,
      popular: true,
      features: [
        t('membership.vip.feature_1'),
        t('membership.vip.feature_2'),
      ],
      color: 'bg-amber-50 border-amber-200',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
      type: 'paid' as const
    },
    {
      name: t('membership.svip.name'),
      price: t('membership.svip.price'),
      icon: <Crown className="w-8 h-8 text-rose-500" />,
      features: [
        t('membership.svip.feature_1'),
        t('membership.svip.feature_2'),
        t('membership.svip.feature_3'),
        t('membership.svip.feature_4'),
      ],
      color: 'bg-rose-50 border-rose-200',
      buttonColor: 'bg-rose-600 hover:bg-rose-700',
      type: 'paid' as const
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">{t('membership.title')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('membership.subtitle')}</p>
      </div>

      {/* Membership Tiers Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-3xl p-8 border ${tier.color} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col`}
          >
            {tier.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="mb-6 flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                {tier.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                <p className="text-gray-500 font-medium">{tier.price}</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 leading-snug">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleJoinClick(tier.type)}
              className={`w-full py-3 rounded-xl text-white font-bold shadow-md transition-transform active:scale-95 ${tier.buttonColor}`}
            >
              {t('membership.join_now')}
            </button>
          </motion.div>
        ))}
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={modalType === 'member' ? "Join as Member" : "Join as VIP / SVIP"}
        content={
          modalType === 'member' ? (
            <div className="space-y-4">
              <p className="font-medium text-lg">
                Please register through our official university portal:
              </p>
              <a 
                href="https://one.illinois.edu/MakeYourOwnWorldDIYClub/club_signup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors w-full text-center shadow-sm"
              >
                Go to OneIllinois
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="font-bold text-blue-900 mb-2">Step 1: Registration</p>
                <p className="text-sm text-blue-800 mb-3">Register officially through the university portal:</p>
                <a 
                  href="https://one.illinois.edu/MakeYourOwnWorldDIYClub/club_signup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-medium break-all"
                >
                  https://one.illinois.edu/MakeYourOwnWorldDIYClub/club_signup
                </a>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="font-bold text-green-900 mb-3">Step 2: Payment</p>
                <p className="text-sm text-green-800 mb-2">Please complete your payment via Zelle or WeChat:</p>
                
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Zelle</p>
                    <p className="font-mono text-gray-800 select-all">estellawang24@gmail.com</p>
                    <p className="text-sm text-gray-600 mt-1">Name: <span className="font-semibold">JIAXUAN WANG</span></p>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">WeChat</p>
                    <p className="font-mono text-gray-800 select-all">wjxnj12</p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      />
    </div>
  );
};

export default Membership;
