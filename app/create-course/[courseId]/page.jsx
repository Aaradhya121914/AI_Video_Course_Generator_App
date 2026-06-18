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

const CourseLayout = ({ params }) => {
  const resolvedParams = React.use(params);
  const courseId = resolvedParams?.courseId;
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [chapterVideoCache, setChapterVideoCache] = useState({});

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

  const handleGenerateCourseContent = async () => {
    if (!course || !hasVideoIncluded(course)) {
      return;
    }

    if (chapterVideoCache[course.courseId]) {
      console.log('Using cached chapter video data:', chapterVideoCache[course.courseId]);
      return;
    }

    const chapters = course?.courseOutput?.course?.chapters || course?.courseOutput?.chapters || [];
    if (chapters.length === 0) {
      console.warn('No chapters found to generate video URLs for.');
      return;
    }

    try {
      const chapterTitles = chapters.map((chapter) => chapter?.name || chapter?.chapter_name || 'Chapter');
      const videos = await service.getVideosForChapters(chapterTitles);

      const chapterVideos = chapterTitles.map((chapterName, index) => {
        const video = videos?.[index] || {};
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
        };
      });

      setChapterVideoCache((prev) => ({
        ...prev,
        [course.courseId]: chapterVideos,
      }));

      console.log('Generated Chapter Video Data:', chapterVideos);
    } catch (error) {
      console.error('Failed to generate chapter video URLs:', error);
    }
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>
      
      {/* Basic Info */}
      <CourseBasicInfo course={course} refreshData={()=>getCourse()}/>
      {/* Course Detail */}
      <CourseDetail course={course} onGenerateContent={handleGenerateCourseContent} />
      {/* List of Lesson */}
      <ChapterList course={course} />
    </div>
  )
}

export default CourseLayout
