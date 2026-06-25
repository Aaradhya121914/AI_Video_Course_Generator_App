// import React from 'react'
// import { IoBarChartOutline } from "react-icons/io5";
// import { GoClock } from "react-icons/go";
// import { LiaChalkboardTeacherSolid } from "react-icons/lia";
// import { MdOndemandVideo } from "react-icons/md";
// import { Button } from '@/components/ui/button';

// const CourseDetail = ({ course, onGenerateContent, onRetryFailed, isGenerating, hasFailedChapters, isOnDashboard, chapterVideoCache, courseId }) => {

//    const isContentGenerated = chapterVideoCache?.[courseId]?.length > 0;
//   return (
//     <div className="border p-6 rounded-xl shadow-sm mt-3">
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

//         <div className='flex gap-2'>
//           <IoBarChartOutline className='text-4xl text-primary'/>
//           <div>
//             <h2 className='text-xs text-gray-500'>Skill Level</h2>
//             <h2 className='font-medium text-lg'>{course?.level}</h2>
//           </div>
//         </div>

//          <div className='flex gap-2'>
//           <GoClock className='text-4xl text-primary'/>
//           <div>
//             <h2 className='text-xs text-gray-500'>Duration</h2>
//             <h2 className='font-medium text-lg'>
//               {course?.courseOutput?.course?.total_estimated_duration || 
//                course?.courseOutput?.course?.total_duration || 
//                course?.courseOutput?.total_estimated_duration || 
//                course?.courseOutput?.total_duration ||
//                course?.courseOutput?.duration ||
//                course?.courseOutput?.course?.duration ||
//                ''}
//             </h2>
//           </div>
//         </div>

//          <div className='flex gap-2'>
//           <LiaChalkboardTeacherSolid className='text-4xl text-primary'/>
//           <div>
//             <h2 className='text-xs text-gray-500'>No of Chapters</h2>
//             <h2 className='font-medium text-lg'>{course?.courseOutput?.chapters?.length || course?.courseOutput?.course?.chapters?.length}</h2>
//           </div>
//         </div>

//          <div className='flex gap-2'>
//           <MdOndemandVideo className='text-4xl text-primary'/>
//           <div>
//             <h2 className='text-xs text-gray-500'>Video Included ?</h2>
//             <h2 className='font-medium text-lg'>
//               {(() => {
//                 const hasVideo =
//                   typeof course?.courseOutput?.course?.video_lectures === 'boolean'
//                     ? course.courseOutput.course.video_lectures
//                     : course?.includeVideo?.toString().toLowerCase() === 'yes';
//                 return hasVideo ? 'Yes' : 'No';
//               })()}
//             </h2>
//           </div>
//         </div>

//       </div>

//      {!isOnDashboard && (
//   <div className="mt-6 flex flex-col gap-4 md:flex-row md:justify-end">
//     <Button 
//       onClick={onGenerateContent} 
//       disabled={isGenerating || isContentGenerated} 
//       className="bg-primary text-white cursor-pointer hover:bg-purple-800 hover:text-white w-full md:w-auto"
//     >
//       {isGenerating ? 'Generating...' : isContentGenerated ? 'Course Content Already Generated' : 'Generate Course Content'}
//     </Button>
//     {hasFailedChapters && (
//       <Button onClick={onRetryFailed} disabled={isGenerating} variant={'outline'} className="w-full md:w-auto">
//         Retry Failed Chapters
//       </Button>
//     )}
//   </div>
// )}
//     </div>
//   )
// }

// export default CourseDetail
import React, { useState } from 'react'
import { IoBarChartOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { MdOndemandVideo } from "react-icons/md";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const CourseDetail = ({
  course,
  onGenerateContent,
  onRetryFailed,
  isGenerating,
  hasFailedChapters,
  isOnDashboard,
  chapterVideoCache,
  courseId,
  currentCredits
}) => {
  const [showLowCreditsDialog, setShowLowCreditsDialog] = useState(false);
  const isContentGenerated = chapterVideoCache?.[courseId]?.length > 0;

  const handleGenerateClick = async () => {
    if (currentCredits - 20 < 0) {
      setShowLowCreditsDialog(true);
      return;
    }
    // If credits are sufficient, proceed
    onGenerateContent();
  };

  return (
    <>
      <div className="border p-6 rounded-xl shadow-sm mt-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {/* ... existing grid items remain the same ... */}
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
              <h2 className='font-medium text-lg'>
                {course?.courseOutput?.course?.total_estimated_duration || 
                 course?.courseOutput?.course?.total_duration || 
                 course?.courseOutput?.total_estimated_duration || 
                 course?.courseOutput?.total_duration ||
                 course?.courseOutput?.duration ||
                 course?.courseOutput?.course?.duration ||
                 ''}
              </h2>
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

        {!isOnDashboard && (
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:justify-end">
            <Button 
              onClick={handleGenerateClick} 
              disabled={isGenerating || isContentGenerated} 
              className="bg-primary text-white cursor-pointer hover:bg-purple-800 hover:text-white w-full md:w-auto"
            >
              {isGenerating ? 'Generating...' : isContentGenerated ? 'Course Content Already Generated' : 'Generate Course Content'}
            </Button>
            {hasFailedChapters && (
              <Button onClick={onRetryFailed} disabled={isGenerating} variant={'outline'} className="w-full md:w-auto">
                Retry Failed Chapters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Low Credits Dialog */}
      <Dialog open={showLowCreditsDialog} onOpenChange={setShowLowCreditsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insufficient Credits</DialogTitle>
            <DialogDescription>
              Your Credits are low...Please Upgrade your plan !!!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLowCreditsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowLowCreditsDialog(false)}>
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseDetail;
