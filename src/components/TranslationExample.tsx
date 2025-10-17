'use client';

import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function TranslationExample() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('garage.title')}</h1>
        <LanguageSwitcher />
      </div>
      
      <p className="text-gray-600">{t('garage.description')}</p>
      
      <div className="space-y-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {t('common.login')}
        </button>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded ml-2">
          {t('common.cancel')}
        </button>
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">{t('navigation.dashboard')}</h2>
        <p>{t('common.welcome')}</p>
      </div>
    </div>
  );
}
