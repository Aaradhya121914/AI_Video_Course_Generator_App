import { db } from '../../../configs/db'
import { CourseList } from '../../../configs/Schema'
import { eq, and } from 'drizzle-orm'

export async function POST(request) {
  try {
    const { courseId, userId } = await request.json()
    
    if (!courseId || !userId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await db.update(CourseList)
      .set({ isOnDashboard: true })
      .where(and(
        eq(CourseList.courseId, courseId),
        eq(CourseList.createdBy, userId)
      ))

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error adding course to dashboard:', error)
    return Response.json(
      { error: 'Failed to add course to dashboard' },
      { status: 500 }
    )
  }
}
