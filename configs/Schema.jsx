
import { pgTable, serial, varchar, integer, boolean, json } from "drizzle-orm/pg-core";

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
})

export const chapters=pgTable("chapters",{
    id:serial("id").primaryKey(),
    courseId:varchar("courseId").notNull(),
    chapterId:integer("chapterId").notNull(),
    chapterName:varchar("chapterName").notNull(),
    chapterDescription:varchar("chapterDescription"),
    videoId:varchar("videoId"),
    videoUrl:varchar("videoUrl"),
    createdBy:varchar("createdBy").notNull(),
})