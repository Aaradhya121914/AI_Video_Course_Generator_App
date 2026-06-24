
import { pgTable, serial, varchar, integer, boolean, text, json } from "drizzle-orm/pg-core";

export const CourseList=pgTable("courseList",{ 
    id:serial("id").primaryKey(),
    courseId:varchar("courseId").notNull(),
    name:varchar("name").notNull(),
    category:varchar("category").notNull(),
    level:varchar("level").notNull(),
    includeVideo:varchar("includeVideo").notNull().default("Yes"),
    courseOutput:json("courseOutput").notNull(),
    createdBy:varchar("createdBy").notNull(),
    userName:varchar("userName"),
    userProfileImage:varchar("userProfileImage"),
    isOnDashboard:boolean("isOnDashboard").notNull().default(false),
    bannerImage:varchar("bannerImage").default("/Course_placeholder_Img.jpeg"),
})

export const Chapters=pgTable("chapters",{
    id:serial("id").primaryKey(),
    index:integer("index"),
    courseId:varchar("courseId").notNull(),
    chapterId:varchar("chapterId").notNull(),
    chapterName:varchar("chapterName"),
    chapterAbout:varchar("chapterAbout"),
    chapterDuration:varchar("chapterDuration"),
    chapterContent:json('chapterContent'),
    searchQuery:varchar("searchQuery"),
    videoId:varchar("videoId"),
    videoUrl:varchar("videoUrl"),
    videoTitle:varchar("videoTitle"),
    videoDuration:varchar("videoDuration"),
    channelName:varchar("channelName"),
    channelId:varchar("channelId"),
    publishedAt:varchar("publishedAt"),
    description:varchar("description"),
    thumbnails:json("thumbnails"),
    viewCount:json("viewCount"),
    likeCount:json("likeCount"),
    commentCount:json("commentCount"),
    position:integer("position").notNull().default(0)
})