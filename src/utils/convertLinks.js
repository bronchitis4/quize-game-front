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

export function convertYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return url;
  
  // Convert youtube.com/watch?v=VIDEO_ID to embed format
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // Convert youtu.be/VIDEO_ID to embed format
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  return url;
}

export function isYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
}
