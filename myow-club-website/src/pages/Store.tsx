import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';

const Store = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="bg-indigo-50 p-8 rounded-full mb-8">
        <ShoppingBag className="w-24 h-24 text-indigo-400" />
      </div>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">{t('store.title')}</h1>
      <p className="text-2xl text-gray-500 font-light tracking-wide">{t('store.coming_soon')}...</p>
    </div>
  );
};

export default Store;
