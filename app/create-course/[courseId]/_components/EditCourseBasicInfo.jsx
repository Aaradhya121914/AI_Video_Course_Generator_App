import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { FiEdit } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { db } from "../../../../configs/db";
import { CourseList } from "../../../../configs/Schema";
import { eq } from "drizzle-orm";


const EditCourseBasicInfo = ({ course, refreshData }) => {
  const [name, setName] = useState();
  const [description, setDescription] = useState();

  useEffect(() => {
    setName(
      course?.courseOutput?.course_name || course?.courseOutput?.course?.name,
    );
    setDescription(
      course?.courseOutput?.description ||
        course?.courseOutput?.course?.description,
    );
  }, [course]);
  const onUpdateHandler = async () => {
    // Here we will write the logic to update the course basic info in database and then we will update the course state in course layout page to reflect the changes in UI
    // make a deep copy to avoid mutating props directly
    const updatedCourse = JSON.parse(JSON.stringify(course || {}));

    // ensure courseOutput exists
    if (!updatedCourse.courseOutput || typeof updatedCourse.courseOutput !== "object") {
      updatedCourse.courseOutput = {};
    }

    // ensure nested course object exists
    if (!updatedCourse.courseOutput.course || typeof updatedCourse.courseOutput.course !== "object") {
      updatedCourse.courseOutput.course = {};
    }

    // Apply updates with fallbacks so we don't assign undefined over existing values
    if (typeof name !== "undefined" && name !== null) {
      updatedCourse.courseOutput.course_name = name;
      updatedCourse.courseOutput.course.name = name;
    }

    if (typeof description !== "undefined" && description !== null) {
      updatedCourse.courseOutput.description = description;
      updatedCourse.courseOutput.course.description = description;
    }

    console.log("Updated Course: ", updatedCourse);

    const result = await db
      .update(CourseList)
      .set({
        courseOutput: updatedCourse.courseOutput,
      })
      .where(eq(CourseList.courseId, course?.courseId))
      .returning({ id: CourseList.id });
    console.log("Update Result: ", result);

    refreshData();
  };
  return (
    <Dialog>
      <DialogTrigger>
        <FiEdit className="cursor-pointer hover:text-purple-800" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course Title and Description</DialogTitle>
          <DialogDescription>
            Update the course title and description below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="course-title">Course Title</label>
            <Input
              id="course-title"
              defaultValue={
                course?.courseOutput?.course_name ||
                course?.courseOutput?.course?.name
              }
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="course-description">Course Description</label>
            <Textarea
              id="course-description"
              defaultValue={
                course?.courseOutput?.description ||
                course?.courseOutput?.course?.description
              }
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="cursor-pointer  hover:bg-purple-800"
              onClick={onUpdateHandler}
            >
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseBasicInfo;
