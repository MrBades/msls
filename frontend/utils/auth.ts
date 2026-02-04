// Helper to manage tokens using standard JavaScript cookies
// This version does NOT require 'cookies-next'

export const setAuthToken = (token: string) => {
  if (typeof document !== 'undefined') {
    // Sets a cookie that expires in 7 days
    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `token=${token}; ${expires}; path=/; SameSite=Lax`;
  }
};

export const getAuthToken = () => {
  if (typeof document !== 'undefined') {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof document !== 'undefined') {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
};
