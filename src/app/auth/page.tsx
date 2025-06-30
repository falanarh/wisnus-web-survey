import ModernAuthPage from '@/components/auth/ModernAuthPage';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login & Register- Survei Digital Wisatawan Nusantara',
  description: 'Login & Register untuk mengakses Survei Digital Wisatawan Nusantara oleh BPS RI',
};

export default function AuthPages() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ModernAuthPage />
    </Suspense>
  );
}
