import { db } from '../../../configs/db'
import { Chapters } from '../../../configs/Schema'
import { and, eq } from 'drizzle-orm'

export async function POST(request) {
  try {
    const { courseId, chapterId, chapterContent } = await request.json()

    if (!courseId || !chapterId || !chapterContent) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await db
      .update(Chapters)
      .set({
        chapterContent: { content: chapterContent }
      })
      .where(
        and(
          eq(Chapters.courseId, courseId),
          eq(Chapters.chapterId, chapterId)
        )
      )

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error updating chapter:', error)
    return Response.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    )
  }
}