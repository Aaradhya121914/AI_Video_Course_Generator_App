import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const ChapterList = ({ course, chapterVideoCache, refreshData, courseId, userId }) => {
  // Use chapters from course.courseOutput directly
  const chapters = course?.courseOutput?.course?.chapters || course?.courseOutput?.chapters || []

  if (!course || !courseId) {
    return null
  }

  return (
    <div className='border mt-5 ml-4 rounded-lg shadow-sm p-4'>
      <h2 className='text-lg font-semibold mb-4'>Chapters</h2>
      <div className="space-y-4">
        {chapters.map((chapter, index) => {
          const chapterName = chapter?.name || chapter?.chapter_name || `Chapter ${index + 1}`
          const chapterAbout = chapter?.about || chapter?.chapter_about || ''
          const chapterDuration = chapter?.duration || chapter?.chapter_duration || ''
          const chapterId = chapter?.id || chapter?.chapter_id
          return (
            <Link
              key={chapterId || index}
              href={`/create-course/${courseId}/${chapterId}`}
            >
              <div className='border p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer'>
                <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4'>
                  <div className='flex items-start gap-3'>
                    <h2 className="bg-primary h-10 w-10 rounded-full font-bold text-white flex items-center justify-center">{index + 1}</h2>
                    <div>
                      <h2 className='text-lg font-semibold'>{chapterName}</h2>
                      <p className='text-sm text-gray-500'>{chapterAbout}</p>
                      <p className='text-sm text-primary mt-1 md:hidden'>{chapterDuration}</p>
                    </div>
                  </div>
                  <p className='hidden md:block text-sm text-primary whitespace-nowrap'>{chapterDuration}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {!course?.isOnDashboard && (
        <div className="mt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full md:w-auto cursor-pointer bg-primary hover:bg-purple-600 text-white">
                Add Course to Dashboard
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure to add your course on Dashboard? Once added you are not able to Edit Chapter Contents...
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction className="cursor-pointer"
                  onClick={async () => {
                    try {
                      await fetch('/api/add-course-to-dashboard', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ courseId, userId })
                      })
                      await refreshData()
                      window.location.href = '/dashboard'
                    } catch (err) {
                      console.error('Error adding course to dashboard:', err)
                    }
                  }}
                >
                  Ok
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}

export default ChapterList
