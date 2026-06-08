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

    const chapters = course?.courseOutput?.course?.chapters || course?.courseOutput?.chapters || [];
    if (chapters.length === 0) {
      console.warn('No chapters found to generate video URLs for.');
      return;
    }

    try {
      const chapterVideos = await Promise.all(chapters.map(async (chapter) => {
        const chapterName = chapter?.name || chapter?.chapter_name || 'Chapter';
        const searchQuery = `${course?.courseOutput?.course?.name || course?.courseOutput?.course_name || course?.category} ${chapterName}`;
        const videos = await service.getVideos(searchQuery);
        const firstVideo = videos?.[0];
        const videoUrl = firstVideo?.id?.videoId ? `https://www.youtube.com/watch?v=${firstVideo.id.videoId}` : null;

        return {
          chapter: chapterName,
          videoUrl,
          title: firstVideo?.snippet?.title || null,
          searchQuery,
        };
      }));

      console.log(JSON.stringify({ courseId: course.courseId, videos: chapterVideos }, null, 2));
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
