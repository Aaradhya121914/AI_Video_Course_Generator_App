import { db } from '../../../configs/db'
import { Chapters, CourseList } from '../../../configs/Schema'
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

    // Fetch course for isOnDashboard
    const courseResult = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.courseId, courseId))

    // Fetch all chapters for course
    const allChaptersResult = await db
      .select()
      .from(Chapters)
      .where(eq(Chapters.courseId, courseId))
    
    // Sort chapters by position
    const sortedAllChapters = allChaptersResult.sort((a, b) => (a.position || 0) - (b.position || 0))

    // If we also have a chapterId, fetch that one specifically
    let currentChapter = null
    if (chapterId) {
      const chapterResult = sortedAllChapters.find(ch => ch.chapterId === chapterId)
      currentChapter = chapterResult || null
    }

    return Response.json({ 
      chapter: currentChapter, 
      allChapters: sortedAllChapters,
      isOnDashboard: courseResult[0]?.isOnDashboard || false
    })
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return Response.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 }
    )
  }
}