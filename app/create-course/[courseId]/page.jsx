"use client"
import React, { useEffect, useState } from 'react'
import { db } from '../../../configs/db'
import { CourseList } from '../../../configs/Schema'
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm';
import CourseBasicInfo from './_components/CourseBasicInfo';
import CourseDetail from './_components/CourseDetail';
import ChapterList from './_components/ChapterList';
import service from '../../../configs/Service';
import { parseModelTextToJson } from '../../../lib/normalizeCourse';
import { Progress } from '@/components/ui/progress';

const CourseLayout = ({ params }) => {
  const resolvedParams = React.use(params);
  const courseId = resolvedParams?.courseId;
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [chapterVideoCache, setChapterVideoCache] = useState({});
  const [chapterContentCache, setChapterContentCache] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
  const [currentChapterName, setCurrentChapterName] = useState('');
  const [chapterStatuses, setChapterStatuses] = useState([]);

  useEffect(() => {
    if (courseId && user?.primaryEmailAddress?.emailAddress) {
      getCourse();
    }
  }, [courseId, user]);

  const getCourse = async () => {
    try {
      const result = await db.select().from(CourseList).where(and(
        eq(CourseList.courseId, courseId),
        eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress)
      ));
      setCourse(result[0]);
      console.log('Course Details: ', result);
    } catch (err) {
      console.error('getCourse error:', err);
    }
  }

  const hasVideoIncluded = (course) => {
    if (!course) return false;
    const outputCourse = course?.courseOutput?.course;
    if (typeof outputCourse?.video_lectures === 'boolean') {
      return outputCourse.video_lectures;
    }
    return String(course?.includeVideo || outputCourse?.video_lectures || '').toLowerCase() === 'yes';
  };

  const isQuotaExceededError = (error) => {
    const message = String(error?.message || '').toLowerCase();
    return message.includes('[429') || message.includes('quota exceeded');
  };

  const getRetryDelaySeconds = (error) => {
    const match = String(error?.message || '').match(/retry in\s+([\d.]+)s/i);
    return match ? Math.ceil(Number(match[1])) : null;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const generateChapterWithRetry = async (prompt, maxRetries = 5, minContentLength = 500) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const text = await generateChapterContentFromApi(prompt);
        const parsed = parseModelTextToJson(text) || {};
        
        const content = parsed?.chapter_content || '';
        if (content.length < minContentLength && attempt < maxRetries - 1) {
          console.log(`Generated content too short (${content.length} chars), retrying (attempt ${attempt + 1}/${maxRetries})...`);
          await sleep(Math.pow(2, attempt) * 1000); // Wait before retrying
          continue;
        }
        
        return text;
      } catch (error) {
        if (isQuotaExceededError(error) && attempt < maxRetries - 1) {
          let retryDelay = getRetryDelaySeconds(error);
          if (!retryDelay) {
            retryDelay = Math.pow(2, attempt) * 1000; // Exponential backoff if no retry delay given
          } else {
            retryDelay *= 1000; // Convert seconds to ms
          }
          
          console.log(`Quota exceeded, retrying in ${retryDelay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
          
          await sleep(retryDelay);
          continue;
        }
        throw error;
      }
    }
    // If we're out of retries, return whatever we have
    return '';
  };

  const generateChapterContentFromApi = async (prompt) => {
    const response = await fetch('/api/generate-chapter-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data?.error || 'Failed to generate chapter content.');
      if (data?.retryDelaySeconds) {
        error.retryDelaySeconds = data.retryDelaySeconds;
      }
      throw error;
    }

    return data?.text || '';
  };

  const handleGenerateCourseContent = async () => {
    if (!course) {
      return;
    }

    const chapters = course?.courseOutput?.course?.chapters || course?.courseOutput?.chapters || [];
    if (chapters.length === 0) {
      console.warn('No chapters found to generate content for.');
      return;
    }

    if (!hasVideoIncluded(course)) {
      if (chapterContentCache[course.courseId]) {
        console.log('Using cached chapter content data:', chapterContentCache[course.courseId]);
        return;
      }

      setIsGenerating(true);
      setGenerationProgress({ current: 0, total: chapters.length });
      setChapterStatuses(chapters.map(() => 'pending')); // Initialize all as pending

      try {
        const chapterContent = [];

        for (let i = 0; i < chapters.length; i++) {
          const chapter = chapters[i];
          const chapterName = chapter?.name || chapter?.chapter_name || 'Chapter';
          const chapterAbout = chapter?.about || chapter?.chapter_about || '';
          const chapterDuration = chapter?.duration || chapter?.chapter_duration || '';

          setCurrentChapterName(chapterName);
          setChapterStatuses(prev => {
            const newStatuses = [...prev];
            newStatuses[i] = 'generating';
            return newStatuses;
          });
          
          const prompt = `You are an expert educational content writer and long-form blog author.

Write a very detailed and comprehensive chapter explanation for a course.
The "chapter_content" must read like a long, high-quality educational blog article section for learners.

Content requirements:
- Write a long-form explanation, not a short answer
- Make the content rich, detailed, and deeply informative
- Explain the topic step by step in simple, clear language
- Cover foundational ideas first, then move into deeper concepts
- Include detailed explanations of important subtopics related to the chapter
- Add practical examples, analogies, and real-world applications wherever possible
- Explain why the topic matters and how it is used in practice
- Include important terminology and key takeaways naturally inside the content
- Use smooth paragraph flow like a real blog article, not bullet points
- Keep the tone beginner-friendly, educational, and engaging
- Make the content expansive enough that a learner feels they are reading a substantial study resource
- The chapter_content MUST contain at least 1500 words and 10+ well-developed paragraphs
- The chapter_content must be a minimum of 800 characters long (but aim for much more!)
- Keep the content focused only on the given chapter topic

Important response rules:
- Respond ONLY with valid JSON
- Do not include markdown
- Do not include code fences
- Do not include any extra text outside the JSON
- Preserve the provided chapter_name, chapter_about, and chapter_duration exactly as given

Return JSON in exactly this format:
{
  "chapter_name": "string",
  "chapter_about": "string",
  "chapter_duration": "string",
  "chapter_content": "very long detailed blog-style explanation of the chapter topic"
}

Course name: ${course?.courseOutput?.course?.name || course?.name || 'Course'}
Course description: ${course?.courseOutput?.course?.description || course?.courseOutput?.description || ''}
Chapter name: ${chapterName}
Chapter about: ${chapterAbout}
Chapter duration: ${chapterDuration}`;

          try {
            const text = await generateChapterWithRetry(prompt);
            const parsed = parseModelTextToJson(text) || {};

            // If JSON parsing failed but we got raw text, use raw text as chapter_content
            let content = parsed?.chapter_content || '';
            if (!content && parsed?.rawText && parsed.rawText.length > 100) {
              content = parsed.rawText;
            }
            
            // If content is still too short, keep going but track failed
            if (content.length < 200) {
              setChapterStatuses(prev => {
                const newStatuses = [...prev];
                newStatuses[i] = 'failed';
                return newStatuses;
              });
            } else {
              setChapterStatuses(prev => {
                const newStatuses = [...prev];
                newStatuses[i] = 'success';
                return newStatuses;
              });
            }

            chapterContent.push({
              chapter_name: chapterName,
              chapter_about: chapterAbout,
              chapter_duration: chapterDuration,
              chapter_content: content,
            });

            setGenerationProgress({ current: i + 1, total: chapters.length });
          } catch (error) {
            console.warn('Failed to generate chapter:', error?.message || error);
            // Still push the chapter, mark failed
            chapterContent.push({
              chapter_name: chapterName,
              chapter_about: chapterAbout,
              chapter_duration: chapterDuration,
              chapter_content: '',
            });
            setChapterStatuses(prev => {
              const newStatuses = [...prev];
              newStatuses[i] = 'failed';
              return newStatuses;
            });
            setGenerationProgress({ current: i + 1, total: chapters.length });
          }
        }

        setChapterContentCache((prev) => ({
          ...prev,
          [course.courseId]: chapterContent,
        }));

        console.log('Generated Chapter Content:', chapterContent);
      } catch (error) {
        console.warn('Failed to generate chapter content:', error?.message || error);
      } finally {
        setIsGenerating(false);
      }

      return;
    }

    if (chapterVideoCache[course.courseId] && chapterContentCache[course.courseId]) {
      console.log('Using cached chapter video and content data!');
      console.log('Chapter Videos:', chapterVideoCache[course.courseId]);
      console.log('Chapter Content:', chapterContentCache[course.courseId]);
      return;
    }

    setIsGenerating(true);
    setGenerationProgress({ current: 0, total: chapters.length * 2 }); // Since we do two things per chapter
    setChapterStatuses(chapters.map(() => 'pending'));

    try {
      // First: get all videos
      const chapterTitles = chapters.map((chapter) => chapter?.name || chapter?.chapter_name || 'Chapter');
      const videos = await service.getVideosForChapters(chapterTitles);
      
      // Now: generate content for each chapter
      const chapterContent = [];

      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        const chapterName = chapter?.name || chapter?.chapter_name || 'Chapter';
        const chapterAbout = chapter?.about || chapter?.chapter_about || '';
        const chapterDuration = chapter?.duration || chapter?.chapter_duration || '';

        setCurrentChapterName(chapterName);
        setChapterStatuses(prev => {
          const newStatuses = [...prev];
          newStatuses[i] = 'generating';
          return newStatuses;
        });
        
        const prompt = `You are an expert educational content writer and long-form blog author.

Write a very detailed and comprehensive chapter explanation for a course.
The "chapter_content" must read like a long, high-quality educational blog article section for learners.

Content requirements:
- Write a long-form explanation, not a short answer
- Make the content rich, detailed, and deeply informative
- Explain the topic step by step in simple, clear language
- Cover foundational ideas first, then move into deeper concepts
- Include detailed explanations of important subtopics related to the chapter
- Add practical examples, analogies, and real-world applications wherever possible
- Explain why the topic matters and how it is used in practice
- Include important terminology and key takeaways naturally inside the content
- Use smooth paragraph flow like a real blog article, not bullet points
- Keep the tone beginner-friendly, educational, and engaging
- Make the content expansive enough that a learner feels they are reading a substantial study resource
- The chapter_content MUST contain at least 1500 words and 10+ well-developed paragraphs
- The chapter_content must be a minimum of 800 characters long (but aim for much more!)
- Keep the content focused only on the given chapter topic

Important response rules:
- Respond ONLY with valid JSON
- Do not include markdown
- Do not include code fences
- Do not include any extra text outside the JSON
- Preserve the provided chapter_name, chapter_about, and chapter_duration exactly as given

Return JSON in exactly this format:
{
  "chapter_name": "string",
  "chapter_about": "string",
  "chapter_duration": "string",
  "chapter_content": "very long detailed blog-style explanation of the chapter topic"
}

Course name: ${course?.courseOutput?.course?.name || course?.name || 'Course'}
Course description: ${course?.courseOutput?.course?.description || course?.courseOutput?.description || ''}
Chapter name: ${chapterName}
Chapter about: ${chapterAbout}
Chapter duration: ${chapterDuration}`;

        try {
          const text = await generateChapterWithRetry(prompt);
          const parsed = parseModelTextToJson(text) || {};

          let content = parsed?.chapter_content || '';
          if (!content && parsed?.rawText && parsed.rawText.length > 100) {
            content = parsed.rawText;
          }
          
          if (content.length < 200) {
            setChapterStatuses(prev => {
              const newStatuses = [...prev];
              newStatuses[i] = 'failed';
              return newStatuses;
            });
          } else {
            setChapterStatuses(prev => {
              const newStatuses = [...prev];
              newStatuses[i] = 'success';
              return newStatuses;
            });
          }
          
          chapterContent.push({
            chapter_name: chapterName,
            chapter_about: chapterAbout,
            chapter_duration: chapterDuration,
            chapter_content: content,
          });
        } catch (error) {
          console.warn('Failed to generate chapter:', error?.message || error);
          chapterContent.push({
            chapter_name: chapterName,
            chapter_about: chapterAbout,
            chapter_duration: chapterDuration,
            chapter_content: '',
          });
          setChapterStatuses(prev => {
            const newStatuses = [...prev];
            newStatuses[i] = 'failed';
            return newStatuses;
          });
        }
        
        setGenerationProgress({ current: (i + 1) * 2, total: chapters.length * 2 });
      }

      // Combine both videos and content!
      const chapterVideosAndContent = chapterTitles.map((chapterName, index) => {
        const video = videos?.[index] || {};
        const content = chapterContent?.[index] || {};
        return {
          chapter: chapterName,
          searchQuery: video.searchQuery || chapterName,
          videoId: video.videoId || null,
          videoUrl: video.videoUrl || null,
          videoTitle: video.title || null,
          videoDuration: video.duration || null,
          channelName: video.channelName || null,
          channelId: video.channelId || null,
          publishedAt: video.publishedAt || null,
          description: video.description || null,
          thumbnails: video.thumbnails || null,
          viewCount: video.viewCount || null,
          likeCount: video.likeCount || null,
          commentCount: video.commentCount || null,
          chapter_content: content.chapter_content || '',
        };
      });

      setChapterVideoCache((prev) => ({
        ...prev,
        [course.courseId]: chapterVideosAndContent,
      }));
      setChapterContentCache((prev) => ({
        ...prev,
        [course.courseId]: chapterContent,
      }));

      console.log('Generated Chapter Video AND Content Data:', chapterVideosAndContent);
    } catch (error) {
      console.error('Failed to generate chapter content or video URLs:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetryFailedChapters = async () => {
    if (!course) return;

    const chapters = course?.courseOutput?.course?.chapters || course?.courseOutput?.chapters || [];
    const cachedContent = chapterContentCache[course.courseId] || [];
    const cachedVideos = chapterVideoCache[course.courseId] || [];
    const failedIndices = chapterStatuses
      .map((status, idx) => status === 'failed' ? idx : -1)
      .filter(idx => idx !== -1);
    
    if (failedIndices.length === 0) {
      console.log('No failed chapters to retry!');
      return;
    }

    setIsGenerating(true);

    try {
      const newContent = [...cachedContent];
      const newVideos = [...cachedVideos];

      for (let i = 0; i < failedIndices.length; i++) {
        const chapterIdx = failedIndices[i];
        const chapter = chapters[chapterIdx];
        const chapterName = chapter?.name || chapter?.chapter_name || 'Chapter';
        const chapterAbout = chapter?.about || chapter?.chapter_about || '';
        const chapterDuration = chapter?.duration || chapter?.chapter_duration || '';

        setCurrentChapterName(chapterName);
        setChapterStatuses(prev => {
          const newStatuses = [...prev];
          newStatuses[chapterIdx] = 'generating';
          return newStatuses;
        });
        
        const prompt = `You are an expert educational content writer and long-form blog author.

Write a very detailed and comprehensive chapter explanation for a course.
The "chapter_content" must read like a long, high-quality educational blog article section for learners.

Content requirements:
- Write a long-form explanation, not a short answer
- Make the content rich, detailed, and deeply informative
- Explain the topic step by step in simple, clear language
- Cover foundational ideas first, then move into deeper concepts
- Include detailed explanations of important subtopics related to the chapter
- Add practical examples, analogies, and real-world applications wherever possible
- Explain why the topic matters and how it is used in practice
- Include important terminology and key takeaways naturally inside the content
- Use smooth paragraph flow like a real blog article, not bullet points
- Keep the tone beginner-friendly, educational, and engaging
- Make the content expansive enough that a learner feels they are reading a substantial study resource
- The chapter_content MUST contain at least 1500 words and 10+ well-developed paragraphs
- The chapter_content must be a minimum of 800 characters long (but aim for much more!)
- Keep the content focused only on the given chapter topic

Important response rules:
- Respond ONLY with valid JSON
- Do not include markdown
- Do not include code fences
- Do not include any extra text outside the JSON
- Preserve the provided chapter_name, chapter_about, and chapter_duration exactly as given

Return JSON in exactly this format:
{
  "chapter_name": "string",
  "chapter_about": "string",
  "chapter_duration": "string",
  "chapter_content": "very long detailed blog-style explanation of the chapter topic"
}

Course name: ${course?.courseOutput?.course?.name || course?.name || 'Course'}
Course description: ${course?.courseOutput?.course?.description || course?.courseOutput?.description || ''}
Chapter name: ${chapterName}
Chapter about: ${chapterAbout}
Chapter duration: ${chapterDuration}`;

        try {
          const text = await generateChapterWithRetry(prompt);
          const parsed = parseModelTextToJson(text) || {};
          
          let content = parsed?.chapter_content || '';
          if (!content && parsed?.rawText && parsed.rawText.length > 100) {
            content = parsed.rawText;
          }

          if (content.length < 200) {
            setChapterStatuses(prev => {
              const newStatuses = [...prev];
              newStatuses[chapterIdx] = 'failed';
              return newStatuses;
            });
          } else {
            setChapterStatuses(prev => {
              const newStatuses = [...prev];
              newStatuses[chapterIdx] = 'success';
              return newStatuses;
            });
          }
          
          const newChapter = {
            chapter_name: chapterName,
            chapter_about: chapterAbout,
            chapter_duration: chapterDuration,
            chapter_content: content,
          };
          newContent[chapterIdx] = newChapter;
          
          // If we have videos, update that too (keep existing video info, add new content)
          if (hasVideoIncluded(course) && newVideos[chapterIdx]) {
            newVideos[chapterIdx] = {
              ...newVideos[chapterIdx],
              chapter_content: content,
            };
          }
        } catch (e) {
          console.warn(`Failed to retry chapter ${chapterIdx}:`, e);
        }
      }

      setChapterContentCache((prev) => ({
        ...prev,
        [course.courseId]: newContent,
      }));
      if (hasVideoIncluded(course)) {
        setChapterVideoCache((prev) => ({
          ...prev,
          [course.courseId]: newVideos,
        }));
        console.log('Updated chapter video and content!');
      }
    } catch (e) {
      console.warn('Failed to retry chapters:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>
      
      {/* Basic Info */}
      <CourseBasicInfo course={course} refreshData={()=>getCourse()}/>
      
      {/* Generation Progress */}
      {isGenerating && (
        <div className="border p-6 rounded-xl shadow-sm mt-3">
          <h3 className="font-medium text-lg mb-3">Generating Course Content...</h3>
          <p className="text-sm text-gray-600 mb-3">
            Currently generating: {currentChapterName}
          </p>
          <Progress value={(generationProgress.current / generationProgress.total) * 100} className="mb-2" />
          <p className="text-sm text-gray-600">
            {generationProgress.current} of {generationProgress.total} chapters completed
          </p>
        </div>
      )}
      
      {/* Completion Message */}
      {!isGenerating && generationProgress.total > 0 && generationProgress.current === generationProgress.total && (
        <div className="border p-6 rounded-xl shadow-sm mt-3 bg-green-50">
          <h3 className="font-medium text-lg mb-2 text-green-700">All chapters generated!</h3>
          <p className="text-sm text-green-600 mb-3">
            {chapterStatuses.filter(s => s === 'success').length} chapters successful, {chapterStatuses.filter(s => s === 'failed').length} failed.
          </p>
        </div>
      )}
      
      {/* Course Detail */}
      <CourseDetail 
        course={course} 
        onGenerateContent={handleGenerateCourseContent} 
        onRetryFailed={handleRetryFailedChapters}
        isGenerating={isGenerating} 
        hasFailedChapters={chapterStatuses.some(s => s === 'failed')}
      />
      
      {/* List of Lesson */}
      <ChapterList course={course} />
    </div>
  )
}

export default CourseLayout
