'use client'

import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import Link from 'next/link'

const ChapterPage = ({ params }) => {
  const resolvedParams = React.use(params)
  const { courseId, chapterId } = resolvedParams
  const [chapter, setChapter] = useState(null)
  const [allChapters, setAllChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isOnDashboard, setIsOnDashboard] = useState(false)

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await fetch('/api/get-chapter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId, chapterId })
        })
        const data = await response.json()
        setChapter(data.chapter)
        setAllChapters(data.allChapters || [])
        setIsOnDashboard(data.isOnDashboard || false)
        const content = data.chapter?.chapterContent
        setEditedContent(
          typeof content === 'string'
            ? content
            : content?.content || ''
        )
        console.log('Fetched chapter:', data.chapter, 'all chapters:', data.allChapters)
      } catch (err) {
        console.error('Failed to fetch chapter:', err)
      } finally {
        setLoading(false)
      }
    }

    if (courseId && chapterId) {
      fetchChapter()
    }
  }, [courseId, chapterId])

  const handleUpdateContent = async () => {
    setIsUpdating(true)
    try {
      await fetch('/api/update-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, chapterId, chapterContent: editedContent })
      })
      const response = await fetch('/api/get-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, chapterId })
      })
      const data = await response.json()
      setChapter(data.chapter)
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update chapter:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const currentIndex = allChapters.findIndex(ch => ch.chapterId === chapterId)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === allChapters.length - 1
  const prevChapterId = allChapters[currentIndex - 1]?.chapterId
  const nextChapterId = allChapters[currentIndex + 1]?.chapterId

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
          <Link href={`/create-course/${courseId}`}>
            <Button className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Link href={`/create-course/${courseId}`} className="mb-6 inline-block">
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-8">{chapter.chapterName}</h1>

        {chapter.videoUrl && (
          <div className="mb-8">
            <div className="aspect-video w-full rounded-lg overflow-hidden border">
              <iframe
                src={`${chapter.videoUrl.replace('watch?v=', 'embed/')}`}
                title={chapter.videoTitle || 'Chapter Video'}
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            {chapter.videoTitle && (
              <h3 className="text-xl font-semibold mt-4">{chapter.videoTitle}</h3>
            )}
          </div>
        )}

        {chapter.chapterContent && (
          <div className="prose prose-slate max-w-none mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-2xl font-bold mb-4">Chapter Content</h2>
              <div className="whitespace-pre-wrap">
                {typeof chapter.chapterContent === 'string'
                  ? chapter.chapterContent
                  : chapter.chapterContent.content}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center gap-4">
          {prevChapterId ? (
            <Link href={`/create-course/${courseId}/${prevChapterId}`}>
              <Button variant="outline" className="cursor-pointer">
                Previous Chapter
              </Button>
            </Link>
          ) : (
            <Button variant="outline" className="cursor-pointer-allowed" disabled>
              Previous Chapter
            </Button>
          )}

          {!isOnDashboard && (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="default" className="cursor-pointer hover:bg-purple-600 text-white">
                  Edit Chapter Content
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Chapter Content</DialogTitle>
                  <DialogDescription>
                    Update the content for {chapter.chapterName}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Chapter Content</span>
                    <span>
                      {editedContent.split('\n').length}/2000 lines
                    </span>
                  </div>
                  <Textarea
                    placeholder="Enter chapter content here..."
                    value={editedContent}
                    onChange={(e) => {
                      const newLines = e.target.value.split('\n').length
                      if (newLines <= 2000) {
                        setEditedContent(e.target.value)
                      }
                    }}
                    className="min-h-[300px] max-h-[400px] resize-y overflow-y-auto"
                  />
                  {editedContent.split('\n').length >= 2000 && (
                    <p className="text-sm text-red-500 mt-2">
                      Maximum 2000 lines allowed
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => {
                      const content = chapter.chapterContent
                      setEditedContent(
                        typeof content === 'string'
                          ? content
                          : content?.content || ''
                      )
                      setIsEditing(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={isUpdating || editedContent.split('\n').length > 2000} className="cursor-pointer hover:bg-purple-600 text-white">
                        {isUpdating ? 'Updating...' : 'Save Changes'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to update the course content of this chapter?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUpdateContent} className="cursor-pointer hover:bg-purple-600 text-white">
                          OK
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {nextChapterId ? (
            <Link href={`/create-course/${courseId}/${nextChapterId}`}>
              <Button variant="outline" className="cursor-pointer">
                Next Chapter
              </Button>
            </Link>
          ) : (
            <Button variant="outline" className="cursor-pointer-allowed" disabled>
              Next Chapter
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChapterPage
