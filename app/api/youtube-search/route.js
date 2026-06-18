import axios from 'axios';

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const chapterVideoCache = new Map();

function buildEmptyVideo(searchQuery) {
  return {
    searchQuery,
    videoId: null,
    videoUrl: null,
    title: null,
    description: null,
    channelName: null,
    channelId: null,
    publishedAt: null,
    duration: null,
    thumbnails: null,
    viewCount: null,
    likeCount: null,
    commentCount: null,
  };
}

async function searchChapterVideo(searchQuery, apiKey) {
  const normalizedQuery = String(searchQuery || '').trim();
  const cacheKey = normalizedQuery.toLowerCase();

  if (!normalizedQuery) {
    return buildEmptyVideo('');
  }

  if (chapterVideoCache.has(cacheKey)) {
    console.log(`Using cached YouTube result for "${normalizedQuery}"`);
    return chapterVideoCache.get(cacheKey);
  }

  try {
    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        part: 'snippet',
        q: normalizedQuery,
        type: 'video',
        videoDuration: 'long',
        maxResults: 1,
        key: apiKey,
      },
    });

    const item = response.data?.items?.[0];
    const videoData = item
      ? {
          searchQuery: normalizedQuery,
          videoId: item.id?.videoId || null,
          videoUrl: item.id?.videoId ? `https://www.youtube.com/watch?v=${item.id.videoId}` : null,
          title: item.snippet?.title || null,
          description: item.snippet?.description || null,
          channelName: item.snippet?.channelTitle || null,
          channelId: item.snippet?.channelId || null,
          publishedAt: item.snippet?.publishedAt || null,
          duration: null,
          thumbnails: item.snippet?.thumbnails || null,
          viewCount: null,
          likeCount: null,
          commentCount: null,
        }
      : buildEmptyVideo(normalizedQuery);

    chapterVideoCache.set(cacheKey, videoData);
    return videoData;
  } catch (error) {
    console.error(`YouTube search failed for "${normalizedQuery}":`, error.message);
    const emptyVideo = buildEmptyVideo(normalizedQuery);
    chapterVideoCache.set(cacheKey, emptyVideo);
    return emptyVideo;
  }
}

export async function POST(req) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error: 'YOUTUBE_API_KEY environment variable not set',
          videos: [],
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const chapters = Array.isArray(body?.chapters) ? body.chapters : [];
    const normalizedChapters = chapters
      .map((chapter) => String(chapter || '').trim())
      .filter(Boolean);

    if (normalizedChapters.length === 0) {
      return Response.json(
        {
          error: 'chapters array is required',
          videos: [],
        },
        { status: 400 }
      );
    }

    const videos = [];

    for (const chapter of normalizedChapters) {
      const video = await searchChapterVideo(chapter, apiKey);
      videos.push(video);
    }

    return Response.json({ videos });
  } catch (error) {
    console.error('YouTube search route error:', error);
    return Response.json(
      {
        error: error.message || 'Internal server error',
        videos: [],
      },
      { status: 500 }
    );
  }
}
