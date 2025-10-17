'use client';

import { useEffect, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

interface I18nProviderWrapperProps {
  children: ReactNode;
}

export function I18nProviderWrapper({ children }: I18nProviderWrapperProps) {
  useEffect(() => {
    // Initialize i18n when component mounts
    i18n.init();
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
