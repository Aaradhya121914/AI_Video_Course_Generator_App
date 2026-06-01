import React from 'react'
import Image from 'next/image'
import { MdOutlineHiking } from "react-icons/md";
import { Button } from '@/components/ui/button';

const CourseBasicInfo = ({ course }) => {
return (
    <div className="p-10 border rounded-xl shadow-sm mt-5">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
            <h2 className="font-bold text-2xl">{course?.courseOutput?.course_name || course?.courseOutput?.course?.name}</h2>
            <p className="text-sm text-gray-400 mt-3">{course?.courseOutput?.description || course?.courseOutput?.course?.description}</p>
            <h2 className='font-medium mt-2 flex gap-2 items-center text-primary'>
                <MdOutlineHiking />{course?.category}
            </h2>
            <Button className='mt-5 w-full cursor-pointer'>Start Course</Button>
        </div>
        <div>
            <Image src={'/Course_placeholder_Img.jpeg'} width={250} alt={'Course_Img'} height={250} className="w-full rounded-xl h-[250px] object-cover"/>
        </div>
      </div>

    </div>
  )
}

export default CourseBasicInfo
