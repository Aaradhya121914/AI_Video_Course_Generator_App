"use client"
import React, { useEffect, useState } from 'react'
import { db } from '../../../configs/db'
import { CourseList } from '../../../configs/Schema'
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm';
import CourseBasicInfo from './_components/CourseBasicInfo';
import CourseDetail from './_components/CourseDetail';
import ChapterList from './_components/ChapterList';

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

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>
      
      {/* Basic Info */}
      <CourseBasicInfo course={course} refreshData={()=>getCourse()}/>
      {/* Course Detail */}
      <CourseDetail course={course} />
      {/* List of Lesson */}
      <ChapterList course={course} />
    </div>
  )
}

export default CourseLayout
