const getVideos = async (query) => {
  const response = await fetch('/api/youtube-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chapters: [query] }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch videos from YouTube API.');
  }

  const data = await response.json();
  return data.videos || [];
};

const getVideosForChapters = async (chapterQueries) => {
  const response = await fetch('/api/youtube-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chapters: chapterQueries }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch videos from YouTube API.');
  }

  const data = await response.json();
  return data.videos || [];
};

export default { getVideos, getVideosForChapters };