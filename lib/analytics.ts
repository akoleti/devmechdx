type EventName = 
  | 'trial_signup_started'
  | 'trial_signup_completed'
  | 'trial_signup_failed'
  | 'email_verified'
  | 'trial_first_login'
  | 'feature_used';

export function trackEvent(name: EventName, properties?: Record<string, any>) {
  // Initialize analytics (e.g., Segment, Mixpanel, etc.)
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track(name, {
      ...properties,
      timestamp: new Date().toISOString()
    });
  }
} 