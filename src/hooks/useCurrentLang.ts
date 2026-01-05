export function useCurrentLang(): string {
  // Get language from HTML dir attribute or default to 'ar'
  if (typeof document !== 'undefined') {
    const htmlDir = document.documentElement.getAttribute('dir');
    return htmlDir === 'rtl' ? 'ar' : 'en';
  }
  return 'ar'; // Default to Arabic
}

