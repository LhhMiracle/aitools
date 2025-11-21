// Analytics configuration and event tracking

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });

  // Make gtag available globally
  window.gtag = gtag;
};

// Track page views
export const pageview = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Predefined analytics events
export const analytics = {
  // User events
  signUp: (method: string) =>
    event({
      action: 'sign_up',
      category: 'engagement',
      label: method,
    }),

  signIn: (method: string) =>
    event({
      action: 'login',
      category: 'engagement',
      label: method,
    }),

  signOut: () =>
    event({
      action: 'sign_out',
      category: 'engagement',
    }),

  // Tool usage events
  toolUsed: (toolId: string, credits: number) =>
    event({
      action: 'tool_used',
      category: 'tools',
      label: toolId,
      value: credits,
    }),

  generationStarted: (toolId: string) =>
    event({
      action: 'generation_started',
      category: 'tools',
      label: toolId,
    }),

  generationCompleted: (toolId: string, duration: number) =>
    event({
      action: 'generation_completed',
      category: 'tools',
      label: toolId,
      value: duration,
    }),

  generationFailed: (toolId: string, error: string) =>
    event({
      action: 'generation_failed',
      category: 'tools',
      label: `${toolId}: ${error}`,
    }),

  // Payment events
  purchaseStarted: (planId: string, price: number) =>
    event({
      action: 'begin_checkout',
      category: 'ecommerce',
      label: planId,
      value: price * 100, // Convert to cents
    }),

  purchaseCompleted: (planId: string, price: number) =>
    event({
      action: 'purchase',
      category: 'ecommerce',
      label: planId,
      value: price * 100,
    }),

  subscriptionUpgraded: (fromPlan: string, toPlan: string) =>
    event({
      action: 'subscription_upgraded',
      category: 'ecommerce',
      label: `${fromPlan} -> ${toPlan}`,
    }),

  subscriptionCancelled: (plan: string) =>
    event({
      action: 'subscription_cancelled',
      category: 'ecommerce',
      label: plan,
    }),

  // Content events
  imageDownloaded: (toolId: string) =>
    event({
      action: 'image_downloaded',
      category: 'content',
      label: toolId,
    }),

  imageShared: (toolId: string, platform: string) =>
    event({
      action: 'image_shared',
      category: 'content',
      label: `${toolId}: ${platform}`,
    }),

  // Engagement events
  referralLinkCopied: () =>
    event({
      action: 'referral_link_copied',
      category: 'engagement',
    }),

  apiKeyCreated: () =>
    event({
      action: 'api_key_created',
      category: 'engagement',
    }),

  newsletterSubscribed: () =>
    event({
      action: 'newsletter_subscribed',
      category: 'engagement',
    }),

  // Feature events
  languageChanged: (locale: string) =>
    event({
      action: 'language_changed',
      category: 'settings',
      label: locale,
    }),

  themeChanged: (theme: string) =>
    event({
      action: 'theme_changed',
      category: 'settings',
      label: theme,
    }),

  // Error events
  errorOccurred: (errorType: string, message: string) =>
    event({
      action: 'error',
      category: 'errors',
      label: `${errorType}: ${message}`,
    }),
};

// Type declarations for gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
