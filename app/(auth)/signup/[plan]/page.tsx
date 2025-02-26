import { use } from 'react';
import SignupForm from '../_components/SignupForm';

export default function SignupPage({ params }: { params: Promise<{ plan: string }> }) {
  const resolvedParams = use(params);
  
  return <SignupForm plan={resolvedParams.plan} />;
} 