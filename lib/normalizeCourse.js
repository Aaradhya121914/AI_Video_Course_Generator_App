// Helpers to extract JSON from model text and normalize to a stable schema
function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

function extractJsonSubstring(text) {
  if (!text || typeof text !== 'string') return null;

  // Try explicit ```json blocks first
  const jsonBlock = text.match(/```json\s*([\s\S]*?)```/i);
  if (jsonBlock && jsonBlock[1]) {
    const parsed = tryParseJson(jsonBlock[1].trim());
    if (parsed) return parsed;
  }

  // Try any ``` fenced block
  const fenced = text.match(/```[\s\S]*?```/i);
  if (fenced) {
    const inner = fenced[0].replace(/```/g, '').trim();
    const parsed = tryParseJson(inner);
    if (parsed) return parsed;
  }

  // Fall back: try to find first JSON object or array by finding first { or [ and last matching }
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  let start = -1;
  if (firstBrace === -1 && firstBracket === -1) return null;
  if (firstBrace === -1) start = firstBracket;
  else if (firstBracket === -1) start = firstBrace;
  else start = Math.min(firstBrace, firstBracket);

  // Try progressively larger substrings until parse succeeds
  for (let end = text.length - 1; end > start; end--) {
    const candidate = text.substring(start, end + 1);
    const parsed = tryParseJson(candidate);
    if (parsed) return parsed;
  }

  return null;
}

function normalizeChapter(ch) {
  if (!ch || typeof ch !== 'object') return null;
  return {
    name: ch.name || ch.chapter_name || ch.title || ch.heading || null,
    about: ch.about || ch.chapter_about || ch.description || ch.details || null,
    duration: ch.duration || ch.chapter_duration || ch.time || null,
  };
}

export function normalizeCourseOutput(raw) {
  // raw can be an object, array, or string
  let parsed = raw;
  if (typeof raw === 'string') {
    parsed = extractJsonSubstring(raw) || tryParseJson(raw) || { rawText: raw };
  }

  // If array, take first useful element
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return { course: { name: null, description: null, chapters: [] } };
    parsed = parsed[0];
  }

  // If object contains courseOutput or course, normalize into { course: {...} }
  let courseObj = null;

  if (parsed.course) courseObj = parsed.course;
  else if (parsed.courseOutput && typeof parsed.courseOutput === 'object') courseObj = parsed.courseOutput.course || parsed.courseOutput;
  else if (parsed.course_name || parsed.description || parsed.chapters) courseObj = parsed;
  else if (parsed.courseOutput && Array.isArray(parsed.courseOutput)) courseObj = parsed.courseOutput[0] || parsed.courseOutput;
  else courseObj = parsed;

  // Build normalized shape
  const name = courseObj.name || courseObj.course_name || courseObj.title || parsed.name || null;
  const description = courseObj.description || courseObj.course_description || courseObj.summary || parsed.description || null;
  const imageUrl = courseObj.imageUrl || courseObj.image || courseObj.courseImageUrl || courseObj.course_image || null;
  const total_duration = courseObj.total_duration || courseObj.total_estimated_duration || courseObj.duration || null;
  const video_lectures = typeof courseObj.video_lectures === 'boolean' ? courseObj.video_lectures : (courseObj.videoLectures === false ? false : (courseObj.includeVideo ? (String(courseObj.includeVideo).toLowerCase().startsWith('y')) : undefined));

  // Chapters may be under multiple keys
  let chaptersRaw = courseObj.chapters || courseObj.chapter || courseObj.lessons || parsed.chapters || parsed.courseOutput?.chapters || [];
  if (!Array.isArray(chaptersRaw)) {
    // sometimes courseOutput:{chapters: { ... }}; wrap if single
    if (typeof chaptersRaw === 'object' && chaptersRaw !== null) chaptersRaw = [chaptersRaw];
    else chaptersRaw = [];
  }

  const chapters = chaptersRaw.map(normalizeChapter).filter(Boolean);

  const normalized = {
    course: {
      name,
      description,
      imageUrl,
      total_duration,
      video_lectures,
      chapters,
    },
    // keep some top-level legacy fields for compatibility
    includeVideo: parsed.includeVideo || parsed.include_video || (video_lectures === true ? 'Yes' : video_lectures === false ? 'No' : undefined),
    course_name: name,
    raw: parsed,
  };

  return normalized;
}

export function parseModelTextToJson(text) {
  // Try to extract JSON, otherwise return the raw text
  const extracted = extractJsonSubstring(text);
  if (extracted) return extracted;
  const parsed = tryParseJson(text);
  if (parsed) return parsed;
  return { rawText: text };
}
