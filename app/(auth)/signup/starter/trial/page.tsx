'use client';

import TrialSignup from '../../_components/TrialSignup';

const starterFeatures = [
  'Up to 5 HVAC units',
  'Basic monitoring',
  'Email support',
  'Mobile app access',
  'Weekly reports'
];

export default function StarterTrialPage() {
  return (
    <TrialSignup
      plan="starter"
      trialDays={14}
      features={starterFeatures}
    />
  );
} 