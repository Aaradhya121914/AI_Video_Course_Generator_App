import { NextResponse } from 'next/server';
import axios from 'axios';

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const searchCache = new Map();
const detailsCache = new Map();

const callYoutubeSearch = async (query) => {
  const params = {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: 1,
    videoDuration: 'long',
    fields: 'items(id/videoId,snippet(title,channelTitle,channelId,publishedAt,description,thumbnails))',
    key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
  };

  const response = await axios.get(`${YOUTUBE_BASE_URL}/search`, { params });
  const item = response.data.items?.[0] || null;

  if (!item) {
    return null;
  }

  return {
    videoId: item.id?.videoId || null,
    snippet: item.snippet || null,
  };
};

const callYoutubeDetails = async (videoIds) => {
  const params = {
    part: 'snippet,contentDetails,statistics',
    id: videoIds.join(','),
    fields: 'items(id,snippet(title,description,channelTitle,channelId,publishedAt,thumbnails),contentDetails(duration),statistics(viewCount,likeCount,commentCount))',
    key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
  };

  const response = await axios.get(`${YOUTUBE_BASE_URL}/videos`, { params });
  return response.data.items || [];
};

const buildVideoResult = (chapter, query, searchResult, detailsItem) => {
  const videoId = searchResult?.videoId || null;
  const snippet = detailsItem?.snippet || searchResult?.snippet || {};

  return {
    chapter,
    searchQuery: query,
    videoId,
    videoUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
    title: snippet?.title || null,
    description: snippet?.description || null,
    channelName: snippet?.channelTitle || null,
    channelId: snippet?.channelId || null,
    publishedAt: snippet?.publishedAt || null,
    thumbnails: snippet?.thumbnails || null,
    duration: detailsItem?.contentDetails?.duration || null,
    cached: Boolean(searchCache.has(`search:${query}`) && detailsCache.has(`details:${videoId}`)),
  };
};

export async function POST(request) {
  if (!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API key is not configured. Set NEXT_PUBLIC_YOUTUBE_API_KEY in your environment.' },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const chaptersInput = body?.chapters || body?.chapter || body?.query;
  if (!chaptersInput) {
    return NextResponse.json({ error: 'Missing chapters input.' }, { status: 400 });
  }

  const chapterQueries = Array.isArray(chaptersInput)
    ? chaptersInput.map((item) => String(item || '').trim()).filter(Boolean)
    : [String(chaptersInput).trim()].filter(Boolean);

  if (!chapterQueries.length) {
    return NextResponse.json({ error: 'No valid chapter queries provided.' }, { status: 400 });
  }

  const searchResults = [];
  const idsToFetch = [];

  for (const query of chapterQueries) {
    const cacheKey = `search:${query}`;
    let searchResult = searchCache.get(cacheKey);

    if (!searchResult) {
      try {
        searchResult = await callYoutubeSearch(query);
      } catch (error) {
        console.error('YouTube search error:', error?.message || error);
        searchResult = null;
      }

      if (searchResult) {
        searchCache.set(cacheKey, searchResult);
      }
    }

    const videoId = searchResult?.videoId;
    if (videoId) {
      idsToFetch.push(videoId);
    }

    searchResults.push({ query, searchResult });
  }

  const uniqueIds = [...new Set(idsToFetch)];
  const detailsResults = {};

  if (uniqueIds.length) {
    const batchSize = 50;
    for (let i = 0; i < uniqueIds.length; i += batchSize) {
      const batchIds = uniqueIds.slice(i, i + batchSize);
      const missingIds = batchIds.filter((id) => !detailsCache.has(`details:${id}`));

      if (missingIds.length) {
        let detailsItems = [];
        try {
          detailsItems = await callYoutubeDetails(missingIds);
        } catch (error) {
          console.error('YouTube details error:', error?.message || error);
          detailsItems = [];
        }

        detailsItems.forEach((item) => {
          const cacheKey = `details:${item.id}`;
          detailsCache.set(cacheKey, item);
        });
      }

      batchIds.forEach((id) => {
        const cacheKey = `details:${id}`;
        if (detailsCache.has(cacheKey)) {
          detailsResults[id] = detailsCache.get(cacheKey);
        }
      });
    }
  }

  const videos = searchResults.map(({ query, searchResult }, index) => {
    const chapter = chapterQueries[index];
    const videoId = searchResult?.videoId;
    const detailsItem = videoId ? detailsResults[videoId] : null;
    return buildVideoResult(chapter, query, searchResult, detailsItem);
  });

  return NextResponse.json({ videos });
}
