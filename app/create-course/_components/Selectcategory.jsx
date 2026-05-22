import React,{useContext} from "react";
import Image from "next/image";
import { CategoryList } from "../../_shared/CategoryList";
import { UserInputContext } from "../../_context/UserInputContext";

const Selectcategory = () => {

  const {userCourseInput, setUserCourseInput}=useContext(UserInputContext);

  const handleCategoryChange=(category)=>{
    setUserCourseInput(prevInput=>({
      ...prevInput,
      category:category
    }))
  }
  return (
    <div>
      <h2 className="text-bold text-primary my-5">Select a Course Category:</h2>
      <div className="grid grid-cols-3 grid-rows-2 gap-10 px-10 md:px-20 py-10">
        {CategoryList.map((item, index) => (
          <div
            key={item.id}
            className={`flex flex-col items-center justify-center gap-4 p-4 rounded-lg cursor-pointer hover:border-primary hover:bg-blue-100 ${userCourseInput?.category === item.name && "border-primary bg-blue-200"}`}
            onClick={()=>handleCategoryChange(item.name)}
          >
            <Image src={item.icon} alt={item.name} width={50} height={50} />
            <h2>{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Selectcategory;
