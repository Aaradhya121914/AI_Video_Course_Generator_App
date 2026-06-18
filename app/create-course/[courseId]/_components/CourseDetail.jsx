import React from 'react'
import { IoBarChartOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { MdOndemandVideo } from "react-icons/md";
import { Button } from '@/components/ui/button';

const CourseDetail = ({ course, onGenerateContent }) => {
  return (
    <div className="border p-6 rounded-xl shadow-sm mt-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        <div className='flex gap-2'>
          <IoBarChartOutline className='text-4xl text-primary'/>
          <div>
            <h2 className='text-xs text-gray-500'>Skill Level</h2>
            <h2 className='font-medium text-lg'>{course?.level}</h2>
          </div>
        </div>

         <div className='flex gap-2'>
          <GoClock className='text-4xl text-primary'/>
          <div>
            <h2 className='text-xs text-gray-500'>Duration</h2>
            <h2 className='font-medium text-lg'>{course?.courseOutput?.total_duration || course?.courseOutput?.course?.total_estimated_duration || course?.courseOutput?.course?.total_duration}</h2>
          </div>
        </div>

         <div className='flex gap-2'>
          <LiaChalkboardTeacherSolid className='text-4xl text-primary'/>
          <div>
            <h2 className='text-xs text-gray-500'>No of Chapters</h2>
            <h2 className='font-medium text-lg'>{course?.courseOutput?.chapters?.length || course?.courseOutput?.course?.chapters?.length}</h2>
          </div>
        </div>

         <div className='flex gap-2'>
          <MdOndemandVideo className='text-4xl text-primary'/>
          <div>
            <h2 className='text-xs text-gray-500'>Video Included ?</h2>
            <h2 className='font-medium text-lg'>
              {(() => {
                const hasVideo =
                  typeof course?.courseOutput?.course?.video_lectures === 'boolean'
                    ? course.courseOutput.course.video_lectures
                    : course?.includeVideo?.toString().toLowerCase() === 'yes';
                return hasVideo ? 'Yes' : 'No';
              })()}
            </h2>
          </div>
        </div>

      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onGenerateContent} className="bg-primary text-white cursor-pointer hover:bg-purple-800 hover:text-white">
          Generate Course Content
        </Button>
      </div>
    </div>
  )
}

export default CourseDetail
