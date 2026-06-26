
"use client";
import React, { useState, useContext, useEffect } from "react";
import { BiCategory } from "react-icons/bi";
import { FaLightbulb } from "react-icons/fa6";
import { IoOptions } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import Selectcategory from "./_components/Selectcategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "../_context/UserInputContext";
import { GenerateCourseLayout_AI } from "../../configs/AiModel";
import { normalizeCourseOutput, parseModelTextToJson } from "../../lib/normalizeCourse";
import LoadingDialog from "./_components/LoadingDialog";
import { db } from "../../configs/db";
import { CourseList } from "../../configs/Schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CreateCourse = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("User Course Input:", userCourseInput);
  }, [userCourseInput]);

  //Used to check Next Button Enable or Disable status 
  const checkStatus = () => {
    if (userCourseInput.length === 0) return true;
    if (activeIndex === -1 && (userCourseInput?.category?.length === 0 || userCourseInput?.category === undefined)) return true;
    if (activeIndex === 0 && (userCourseInput?.topic?.length == 0 || userCourseInput?.topic === undefined)) return true;
    if (activeIndex === 0 && (userCourseInput?.description?.length == 0 || userCourseInput?.description === undefined)) return true;
    if (
      activeIndex === 1 &&
      (
        userCourseInput?.difficulty == undefined ||
        userCourseInput?.duration == undefined ||
        userCourseInput?.videoLectures == undefined ||
        userCourseInput?.Chapters == undefined ||
        userCourseInput?.Chapters === ""
      )
    ) return true;
    return false;
  };

  const GenerateCourseLayout = async () => {
    // Here we will call the function which will generate the course layout based on user input using Gemini Pro API and then we will navigate to the course layout page to show the generated layout to user

    setLoading(true);

    const BASIC_PROMPT = "Generate A Course tutorial on following detail with course field name,description,along with chapter name, about, duration:";
    const USER_INPUT_PROMPT = `Category: ${userCourseInput?.category}, Topic: ${userCourseInput?.topic}, Description: ${userCourseInput?.description},Difficulty: ${userCourseInput?.difficulty}, Duration: ${userCourseInput?.duration} ,Video Lectures: ${userCourseInput?.videoLectures}, Chapters: ${userCourseInput?.Chapters}`;

    const SCHEMA_INSTRUCTION = `Respond ONLY with valid JSON matching this schema:\n{\n  "course": {\n    "name": string,\n    "description": string,\n    "imageUrl": string (optional),\n    "total_duration": string (optional),\n    "video_lectures": boolean (optional),\n    "chapters": [ { "name": string, "about": string, "duration": string } ]\n  }\n}`;

    const FINAL_PROMPT = `${BASIC_PROMPT} \n ${USER_INPUT_PROMPT} \n ${SCHEMA_INSTRUCTION}`;

    console.log("Final Prompt: ", FINAL_PROMPT);

    const result = await GenerateCourseLayout_AI.sendMessage(FINAL_PROMPT);

    const text = typeof result.response?.text === 'function' ? result.response.text() : result.response?.text || '';
    console.log("Generated Course Layout (raw): ", text);

    // Parse model text into JSON if possible, then normalize to a stable schema
    const parsed = parseModelTextToJson(text);
    const normalized = normalizeCourseOutput(parsed);

    console.log('Normalized Course Layout: ', normalized);

    setLoading(false);
    SaveCourseLayoutInDB(normalized);
  };

  const SaveCourseLayoutInDB = async (courseLayout) => {
    var id = uuidv4();
    setLoading(true);
    const result = await db.insert(CourseList).values({
      courseId: id,
      name: userCourseInput?.topic,
      category: userCourseInput?.category,
      level: userCourseInput?.difficulty,
      courseOutput: courseLayout,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      userName: user?.fullName,
      userProfileImage: user?.imageUrl
    });
    console.log("Inserted Course Layout in DB with ID: ", result);
    setLoading(false);
    router.replace(`/create-course/${id}`);
  };

  const stepperOptions = [
    { id: 1, title: "Category", icon: <BiCategory /> },
    { id: 2, title: "Topic & Desc", icon: <FaLightbulb /> },
    { id: 3, title: "Options", icon: <IoOptions /> },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 to-white md:bg-transparent">
      {/* Full Page Background Image (Desktop Only, No Cropping!) */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-purple-50 to-white">
        <Image
          src="/Background_Img.jpeg"
          alt="Background"
          fill
          className="object-contain object-center"
          priority
          unoptimized
        />
      </div>

      {/* Main Content (Kept Inside Background Area) */}
      <div className="relative z-10 w-full min-h-screen">
        {/* Header & Stepper (Only One Copy Now!) */}
        <div className="flex flex-col justify-center items-center pt-10 pb-6">
          <h2 className="text-4xl text-purple-700 font-bold">Create Course</h2>
          <p className="text-gray-600 mt-2">Build your AI-powered course in a few simple steps</p>
          <div className="flex mt-8">
            {stepperOptions.map((item, index) => (
              <div key={item.id} className="flex items-center">
                <div className="flex flex-col items-center w-[50px] md:w-[100px] gap-2">
                  <div className={`p-3 rounded-full text-white font-bold ${activeIndex >= index ? "bg-purple-600 shadow-lg" : "bg-gray-300"}`}>
                    {item.icon}
                  </div>
                  <h2 className="hidden md:block md:text-sm font-medium text-gray-700">{item.title}</h2>
                </div>
                {index !== stepperOptions.length - 1 && (
                  <div className={`h-1 w-[50px] md:w-[100px] lg:w-[170px] rounded-full ${activeIndex >= index ? "bg-purple-600" : "bg-gray-300"}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Components (Kept Inside Max-Width Container) */}
        <div className="px-4 sm:px-10 md:px-20 lg:px-44 max-w-7xl mx-auto">
          {activeIndex === -1 ? <Selectcategory /> : activeIndex === 0 ? <TopicDescription /> : <SelectOption />}
        </div>

        {/* Next and Previous button */}
        <div className="flex justify-between items-center fixed bottom-5 right-5 w-full px-5 md:px-10">
          <Button
            disabled={activeIndex < 0}
            variant={'outline'}
            onClick={() => setActiveIndex(activeIndex - 1)}
            className="cursor-pointer bg-white text-gray-700 hover:bg-purple-50 border-gray-200"
          >
            Previous
          </Button>

          {activeIndex < 2 && (
            <Button
              disabled={checkStatus()}
              onClick={() => setActiveIndex(activeIndex + 1)}
              className="cursor-pointer bg-purple-600 hover:bg-purple-700"
            >
              Next
            </Button>
          )}

          {activeIndex === 2 && (
            <Button
              disabled={checkStatus()}
              onClick={() => GenerateCourseLayout()}
              className="cursor-pointer bg-purple-600 hover:bg-purple-700"
            >
              Generate Course Layout
            </Button>
          )}
        </div>
      </div>

      <LoadingDialog loading={loading} />
    </div>
  );
};

export default CreateCourse;