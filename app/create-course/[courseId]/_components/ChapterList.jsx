import React from 'react'


const ChapterList = ({ course, refreshData }) => {
  const chapters = course?.courseOutput?.course?.chapters || course?.courseOutput?.chapters || []

  return (
    <div className='border mt-5 ml-4 rounded-lg shadow-sm p-4'>
       <h2 className='text-lg font-semibold mb-4'>Chapters</h2>
       <div className="space-y-4">
          {chapters.map((chapter,index)=>(
            <div key={index} className='border p-4 rounded-lg shadow-sm'>
                <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-start gap-3'>
                        <h2 className="bg-primary h-10 w-10 rounded-full font-bold text-white flex items-center justify-center">{index + 1}</h2>
                        <div>
                            <h2 className='text-lg font-semibold'>{chapter?.name || chapter?.chapter_name}</h2>
                            <p className='text-sm text-gray-500'>{chapter?.about || chapter?.chapter_about}</p>
                        </div>
                    </div>
                    <p className='text-sm text-primary whitespace-nowrap'>{chapter?.duration || chapter?.chapter_duration}</p>
                </div>
            </div>
          ))}
       </div>
    </div>
  )
}

export default ChapterList
