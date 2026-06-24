import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { db } from '@/configs/db';
import { CourseList } from '@/configs/Schema';
import { eq } from 'drizzle-orm';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadStream = (buffer, options) =>
  new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });

    Readable.from(buffer).pipe(upload);
  });

export async function POST(request) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: 'Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.' },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const courseId = formData.get('courseId');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  if (!courseId) {
    return NextResponse.json({ error: 'Missing courseId.' }, { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadStream(fileBuffer, {
      folder: 'ai-course-generator-images',
      public_id: `course_${courseId}_${Date.now()}`,
      overwrite: true,
    });

    const existingCourse = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.courseId, courseId.toString()));

    if (!existingCourse?.length) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    const currentOutput = existingCourse[0].courseOutput || {};
    const updatedOutput = {
      ...currentOutput,
      courseImageUrl: uploadResult.secure_url,
      course: {
        ...(currentOutput.course || {}),
        imageUrl: uploadResult.secure_url,
      },
    };

    
const [updatedCourse] = await db
  .update(CourseList)
  .set({ 
    bannerImage: uploadResult.secure_url, 
    courseOutput: updatedOutput 
  })
  .where(eq(CourseList.courseId, courseId.toString()))
  .returning();

    return NextResponse.json({
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      courseOutput: updatedCourse.courseOutput,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Cloudinary upload failed.' },
      { status: 500 }
    );
  }
}
