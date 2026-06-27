# Coursify - AI Video Course Generator App

A modern, AI-powered platform that generates comprehensive video courses using Gemini AI, complete with YouTube video integration, course management, and credit-based subscription system.

## Features

- 🤖 **AI-Powered Course Generation**: Leverages Google's Gemini AI to generate course structures, chapter outlines, and content
- 🎥 **YouTube Video Integration**: Automatically searches and attaches relevant YouTube videos to chapters
- 👤 **User Authentication**: Secure authentication with Clerk (Google One Tap sign-in
- 📊 **Course Dashboard**: Manage your created courses in a personalized dashboard
- 💳 **Credit-Based System**: 100 free credits on signup, with Stripe payment integration for upgrades
- 📁 **Course Customization**: Customize course details, edit chapters, and update content
- 🎨 **Modern UI**: Built with Next.js, Tailwind CSS, and ShadCN components
- 🗄️ **PostgreSQL Database**: Powered by Neon Serverless Postgres with Drizzle ORM

## Tech Stack

- **Framework**: Next.js 16.2.6
- **Authentication**: Clerk
- **AI Model**: Google Gemini 3 Flash
- **Database**: Neon Serverless Postgres
- **ORM**: Drizzle ORM
- **Payment**: Stripe
- **File Upload**: Cloudinary
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN
- **Icons**: Lucide React, React Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_DATABASE_URL=
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRICE_ID=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_YOUTUBE_API_KEY=
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run db:push
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Live Application: [https://ai-video-course-generator-app-tihi.vercel.app/](https://ai-video-course-generator-app-tihi.vercel.app/)

## Database Schema

### CourseList Table
- **id** (serial, primary key)
- **courseId** (varchar, not null) - Unique course identifier
- **name** (varchar, not null) - Course name
- **category** (varchar, not null) - Course category
- **level** (varchar, not null) - Course difficulty level
- **includeVideo** (varchar, not null, default "Yes") - Include videos flag
- **courseOutput** (json, not null) - Generated course structure data
- **createdBy** (varchar, not null) - Creator's user ID
- **userName** (varchar) - Creator's display name
- **userProfileImage** (varchar) - Creator's profile image URL
- **isOnDashboard** (boolean, not null, default false) - Dashboard visibility status
- **bannerImage** (varchar, default "/Course_placeholder_Img.jpeg") - Course banner image

### Chapters Table
- **id** (serial, primary key)
- **index** (integer) - Chapter order index
- **courseId** (varchar, not null) - Associated course ID
- **chapterId** (varchar, not null) - Unique chapter identifier
- **chapterName** (varchar) - Chapter title
- **chapterAbout** (varchar) - Chapter description
- **chapterDuration** (varchar) - Estimated chapter duration
- **chapterContent** (json) - Generated chapter content
- **searchQuery** (varchar) - YouTube search query
- **videoId** (varchar) - YouTube video ID
- **videoUrl** (varchar) - YouTube video URL
- **videoTitle** (varchar) - Video title
- **videoDuration** (varchar) - Video duration
- **channelName** (varchar) - YouTube channel name
- **channelId** (varchar) - YouTube channel ID
- **publishedAt** (varchar) - Video publish date
- **description** (varchar) - Video description
- **thumbnails** (json) - Video thumbnail URLs
- **viewCount** (json) - Video view count
- **likeCount** (json) - Video like count
- **commentCount** (json) - Video comment count
- **position** (integer, not null, default 0) - Chapter position

### UserCredits Table
- **id** (serial, primary key)
- **email** (varchar, not null, unique) - User's email address
- **credits** (integer, not null, default 100) - User's credit balance

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the development server on http://localhost:3000 |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run db:push` | Pushes the database schema to Neon Postgres |
| `npm run db:studio` | Opens Drizzle Studio for database management |

## License

This project is private and proprietary.
