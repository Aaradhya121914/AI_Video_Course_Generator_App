const getVideosForChapters = async (chapterTitles) => {
  const response = await fetch('/api/youtube-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chapters: chapterTitles }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch videos from YouTube API.');
  }

  const data = await response.json();
  return data.videos || [];
};

const getVideos = async (query) => {
  const videos = await getVideosForChapters([query]);
  return videos;
};

export default {getVideos, getVideosForChapters}
