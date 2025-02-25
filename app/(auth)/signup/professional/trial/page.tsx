'use client';

import TrialSignup from '../../_components/TrialSignup';

const professionalFeatures = [
  'Up to 20 HVAC units',
  'Advanced analytics',
  'Priority support',
  'API access',
  'Custom alerts',
  'Daily reports',
  'Energy optimization',
  'Maintenance scheduling'
];

export default function ProfessionalTrialPage() {
  return (
    <TrialSignup
      plan="professional"
      trialDays={30}
      features={professionalFeatures}
    />
  );
} 