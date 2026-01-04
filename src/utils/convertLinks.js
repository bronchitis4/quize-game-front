// Utility functions for converting media links

export function convertGitHubUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('github.com') && url.includes('/blob/')) {
    return url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }
  return url;
}
