"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Addcourse from "./_components/Addcourse";

const Dashboard = () => {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchDashboardCourses();
    }
  }, [user]);

  const fetchDashboardCourses = async () => {
    try {
      const userId = user.primaryEmailAddress.emailAddress;
      const response = await fetch('/api/get-dashboard-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Error fetching dashboard courses:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-gray-500">Loading courses...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div>
        <Addcourse />
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 mt-8">
          <p className="text-lg text-gray-500">No courses on dashboard yet!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Addcourse />
      <h1 className="text-2xl font-bold mb-8 mt-8">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          console.log("course object keys:", Object.keys(course));
          console.log("course.courseOutput keys:", Object.keys(course.courseOutput || {}));
          if (course?.courseOutput?.course) {
            console.log("course.courseOutput.course keys:", Object.keys(course.courseOutput.course));
          }
          const courseName = course?.courseOutput?.course?.name || course?.courseOutput?.course_name || 'Untitled Course';
          const courseCategory = course?.category || 'Course';
          // Check all possible duration keys!
          const courseDuration = 
            course?.courseOutput?.course?.total_estimated_duration || 
            course?.courseOutput?.course?.total_duration || 
            course?.courseOutput?.total_estimated_duration || 
            course?.courseOutput?.total_duration ||
            course?.courseOutput?.duration ||
            course?.courseOutput?.course?.duration ||
            '';
          const courseBanner = course?.bannerImage || course?.courseOutput?.courseImageUrl || course?.courseOutput?.course?.imageUrl || '/Course_placeholder_Img.jpeg';
          const courseId = course?.courseId;

          return (
            <Link href={`/create-course/${courseId}`} key={courseId}>
              <div className="border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer hover:border-primary hover:transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg">
                <div className="h-48 relative">
                  <Image
                    src={courseBanner}
                    alt={courseName}
                    fill
                    className="object-cover"
                    unoptimized={courseBanner.startsWith('http')}
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-semibold line-clamp-2 hover:text-primary">
                    {courseName}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {courseCategory}
                    </span>
                    <span className="text-sm text-gray-500">
                      {courseDuration || "No duration"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
