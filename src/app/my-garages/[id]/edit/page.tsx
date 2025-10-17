'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import GarageForm from '@/components/features/garage/GarageForm';

export default function EditGaragePage() {
  const params = useParams();
  const garageId = params?.id ? Number(params.id) : undefined;

  return <GarageForm garageId={garageId} />;
}
