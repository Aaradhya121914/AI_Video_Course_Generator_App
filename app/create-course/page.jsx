"use client";
import React,{useContext,useEffect} from "react";
import { BiCategory } from "react-icons/bi";
import { FaLightbulb } from "react-icons/fa6";
import { IoOptions } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Selectcategory from "./_components/Selectcategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "../_context/UserInputContext";


const CreateCourse = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const {userCourseInput, setUserCourseInput}=useContext(UserInputContext);

  useEffect(()=>{
    console.log("User Course Input:", userCourseInput);
  },[userCourseInput])

  //Used to check Next Button Enable or Disable status 
  const checkStatus=()=>{
    if(userCourseInput.length===0) return true;
    if(activeIndex===-1 && (userCourseInput?.category?.length===0||userCourseInput?.category===undefined )) return true;
    if(activeIndex===0 && (userCourseInput?.topic?.length==0 || userCourseInput?.topic===undefined)) return true;
    if(activeIndex===0 && (userCourseInput?.description?.length==0 || userCourseInput?.description===undefined)) return true;
    if(activeIndex===1 && (userCourseInput?.difficulty==undefined || userCourseInput?.duration==undefined || userCourseInput?.videoLectures==undefined || userCourseInput?.Chapters==undefined)) return true;
    return false
  }
  const stepperOptions = [
    {
      id: 1,
      title: "Category",
      icon: <BiCategory />,
    },
    {
      id: 2,
      title: "Topic & Desc",
      icon: <FaLightbulb />,
    },
    {
      id: 3,
      title: "Options",
      icon: <IoOptions />,
    },
  ];
  return (
    <div>
      {/* Stepper */}
      <div className="flex flex-col justify-center items-center mt-10">
        <h2 className="text-4xl text-primary font-medium"> Create Course</h2>
        <div className="flex mt-10">
          {stepperOptions.map((item, index) => (
            <div key={item.id} className="flex items-center">
              <div className="flex flex-col items-center w-[50px] md:w-[100px] gap-2">
                <div
                  className={`bg-gray-500 p-3 rounded-full text-white font-bold ${activeIndex >= index && "bg-primary"}`}
                >
                  {item.icon}
                </div>
                <h2 className="hidden md:block md:text-sm">{item.title}</h2>
              </div>
              {index !== stepperOptions.length - 1 && (
                <div
                  className={`h-1 w-[50px] md:w-[100px] lg:w-[170px] rounded-full bg-gray-300 ${activeIndex >= index && "bg-primary"}`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-10 md:px-20 lg:px-44 mt-10">
        {/* Component */}
        {activeIndex===-1 ? <Selectcategory/>  : activeIndex===0 ? <TopicDescription/> :<SelectOption/>}

        {/* Next and Previous button */}
        <div className="flex justify-between items-center fixed bottom-5 right-5 w-full px-5 md:px-10">
          <Button
            disabled={activeIndex < 0}
            variant={'outline'}
            onClick={() => setActiveIndex(activeIndex - 1)}
            className="cursor-pointer text-gray-500 hover:bg-purple-800 hover:text-black"
          >
            Previous
          </Button>

          {activeIndex < 2 && (<Button
            disabled={checkStatus()}
            onClick={() => setActiveIndex(activeIndex + 1)}
            className="cursor-pointer  hover:bg-purple-800"
          >
            Next
          </Button>)}

          {activeIndex === 2 && (<Button
            disabled={checkStatus()}
            onClick={() => setActiveIndex(activeIndex + 1)}
            className="cursor-pointer  hover:bg-purple-800"
          >
            Generate Course Layout
          </Button>)}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
