import { db } from '../../../configs/db'
import { Chapters } from '../../../configs/Schema'
import { and, eq } from 'drizzle-orm'

export async function POST(request) {
  try {
    const { courseId, chapterId } = await request.json()

    if (!courseId) {
      return Response.json(
        { error: 'Missing courseId' },
        { status: 400 }
      )
    }

    // Fetch all chapters for course
    const allChaptersResult = await db
      .select()
      .from(Chapters)
      .where(eq(Chapters.courseId, courseId))
    
    // If we also have a chapterId, fetch that one specifically
    let currentChapter = null
    if (chapterId) {
      const chapterResult = allChaptersResult.find(ch => ch.chapterId === chapterId)
      currentChapter = chapterResult || null
    }

    return Response.json({ 
      chapter: currentChapter, 
      allChapters: allChaptersResult 
    })
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return Response.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 }
    )
  }
}