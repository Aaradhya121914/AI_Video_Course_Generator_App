import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { MdOutlineHiking } from "react-icons/md";
import { Button } from '@/components/ui/button';
import EditCourseBasicInfo from './EditCourseBasicInfo';

const CourseBasicInfo = ({ course, refreshData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (course?.courseOutput?.courseImageUrl) {
      setSelectedFile(course.courseOutput.courseImageUrl);
    } else if (course?.courseOutput?.course?.imageUrl) {
      setSelectedFile(course.courseOutput.course.imageUrl);
    }
  }, [course]);

  const onFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !course?.courseId) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', course.courseId);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Upload failed');
      }

      setSelectedFile(data.secure_url);
      refreshData();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-10 border rounded-xl shadow-sm mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h2 className="font-bold text-2xl">
            {course?.courseOutput?.course_name || course?.courseOutput?.course?.name}
            <EditCourseBasicInfo course={course} refreshData={() => refreshData(true)} />
          </h2>
          <p className="text-sm text-gray-400 mt-3">
            {course?.courseOutput?.description || course?.courseOutput?.course?.description}
          </p>
          <h2 className='font-medium mt-2 flex gap-2 items-center text-primary'>
            <MdOutlineHiking />{course?.category}
          </h2>
          <Button className='mt-5 w-full cursor-pointer' disabled={uploading}>
            {uploading ? 'Uploading...' : 'Start Course'}
          </Button>
        </div>
        <div className="relative">
          <label htmlFor="upload-image" className='cursor-pointer block'>
            <Image
              src={selectedFile || '/Course_placeholder_Img.jpeg'}
              width={250}
              alt='Course_Img'
              height={250}
              className="w-full rounded-xl h-[250px] object-cover"
            />
          </label>
          <input
            type="file"
            id="upload-image"
            accept="image/*"
            className='opacity-0 absolute inset-0 w-full h-full cursor-pointer'
            onChange={onFileSelected}
          />
        </div>
      </div>
    </div>
  )
}

export default CourseBasicInfo
