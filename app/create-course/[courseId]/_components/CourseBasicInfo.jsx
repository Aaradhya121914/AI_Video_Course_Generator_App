import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdOutlineHiking } from "react-icons/md";
import { Button } from '@/components/ui/button';
import EditCourseBasicInfo from './EditCourseBasicInfo';

const CourseBasicInfo = ({ course, refreshData, chapterVideoCache, courseId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Get first chapter from chapterVideoCache (sorted by index)
  const cachedChapters = chapterVideoCache?.[courseId] || [];
  const firstChapter = cachedChapters[0];
  const firstChapterId = firstChapter?.chapterId;

  useEffect(() => {
    // Prefer bannerImage from course, then courseImageUrl, then nested course.imageUrl
    const candidate = course?.bannerImage || course?.courseOutput?.courseImageUrl || course?.courseOutput?.course?.imageUrl || null;
    // ignore empty strings and set null to use placeholder
    if (candidate && candidate !== '') setSelectedFile(candidate);
    else setSelectedFile(null);
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
            <EditCourseBasicInfo course={course} refreshData={refreshData} />
          </h2>
          <p className="text-sm text-gray-400 mt-3">
            {course?.courseOutput?.description || course?.courseOutput?.course?.description}
          </p>
          <h2 className='font-medium mt-2 flex gap-2 items-center text-primary'>
            <MdOutlineHiking />{course?.category}
          </h2>
          {firstChapterId ? (
            <Link href={`/create-course/${courseId}/${firstChapterId}`}>
              <Button className='mt-5 w-full cursor-pointer' disabled={uploading}>
                {uploading ? 'Uploading...' : 'Start Course'}
              </Button>
            </Link>
          ) : (
            <Button className='mt-5 w-full cursor-pointer' disabled={uploading}>
              {uploading ? 'Uploading...' : 'Generate Course Content First'}
            </Button>
          )}
        </div>
        <div className="relative">
          <label htmlFor="upload-image" className='cursor-pointer block'>
            {/* If image is an external URL, bypass Next image optimizer to avoid /_next/image 404 in some dev configs */}
            <Image
              src={selectedFile || '/Course_placeholder_Img.jpeg'}
              width={250}
              alt='Course_Img'
              height={250}
              onError={() => setSelectedFile(null)}
              unoptimized={selectedFile && String(selectedFile).startsWith('http')}
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
