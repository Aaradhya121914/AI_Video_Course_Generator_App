import { db } from '../../../configs/db'
import { CourseList } from '../../../configs/Schema'
import { eq, and } from 'drizzle-orm'

export async function POST(request) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return Response.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    const result = await db.select().from(CourseList).where(and(
      eq(CourseList.createdBy, userId),
      eq(CourseList.isOnDashboard, true)
    ))

    return Response.json({ courses: result })
  } catch (error) {
    console.error('Error fetching dashboard courses:', error)
    return Response.json(
      { error: 'Failed to fetch dashboard courses' },
      { status: 500 }
    )
  }
}
