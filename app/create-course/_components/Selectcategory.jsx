
import React, { useContext } from "react";
import Image from "next/image";
import { CategoryList } from "../../_shared/CategoryList";
import { UserInputContext } from "../../_context/UserInputContext";

const Selectcategory = () => {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleCategoryChange = (category) => {
    setUserCourseInput((prevInput) => ({
      ...prevInput,
      category: category,
    }));
  };

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden md:block w-full pb-20">
        {/* Category Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Select a Course Category
          </h2>
          <p className="text-gray-500 text-sm">
            Choose the category that best fits your course content
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          {CategoryList.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleCategoryChange(item.name)}
              className={`flex flex-col items-center justify-start gap-4 p-8 rounded-2xl bg-white shadow-md cursor-pointer transition-all hover:shadow-xl hover:border-2 hover:border-purple-300 min-h-[300px] ${
                userCourseInput?.category === item.name && "border-2 border-purple-600 bg-purple-50 shadow-xl"
              }`}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                <Image src={item.icon} alt={item.name} width={60} height={60} />
              </div>
              <div className="flex flex-col items-center gap-3 text-center flex-grow justify-center">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description || "Choose this category to get started"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View (Keep EXACTLY Original) */}
      <div className="md:block md:hidden">
        <h2 className="text-bold text-primary my-5">Select a Course Category:</h2>
        <div className="grid grid-cols-2 grid-rows-3 gap-10 px-10 md:px-20 py-10 lg:grid-cols-3 lg:grid-rows-2 lg:px-44">
          {CategoryList.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col items-center justify-center gap-4 p-4 rounded-lg cursor-pointer hover:border-primary hover:bg-blue-100 ${
                userCourseInput?.category === item.name && "border-primary bg-blue-200"
              }`}
              onClick={() => handleCategoryChange(item.name)}
            >
              <Image src={item.icon} alt={item.name} width={50} height={50} />
              <h2>{item.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Selectcategory;