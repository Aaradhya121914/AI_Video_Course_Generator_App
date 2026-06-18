import React,{useContext} from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UserInputContext } from '../../_context/UserInputContext';

const SelectOption = () => {

    const {userCourseInput, setUserCourseInput}=useContext(UserInputContext);

     const handleInputChange=(fieldName,fieldValue)=>{ 
    setUserCourseInput(prevInput=>({
      ...prevInput,
      [fieldName]:fieldValue
    }))
  }

  return (
    <div className="px-10 md:px-20 lg:px-44">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:grid-rows-2">
        <div>
          <label htmlFor="" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Difficulty Level
          </label>
          <Select onValueChange={(value)=>handleInputChange("difficulty",value) } defaultValue={userCourseInput?.difficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>

         <div>
          <label htmlFor="" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Course Duration
          </label>
          <Select onValueChange={(value)=>handleInputChange("duration",value)} defaultValue={userCourseInput?.duration}>
          <SelectTrigger>
            <SelectValue placeholder="Select course duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="5 hours or less">5 hours or less</SelectItem>
              <SelectItem value="More than 10 hours">More than 10 hours</SelectItem>
              <SelectItem value="More than 20 hours">More than 20 hours</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>
       
         <div>
          <label htmlFor="" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Add Video Lectures
          </label>
          <Select onValueChange={(value)=>handleInputChange("videoLectures",value)} defaultValue={userCourseInput?.videoLectures}>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>

        <div>
          <label htmlFor="" className="text-sm">No of Chapters</label>
          <Input
            type="number"
            value={Number.isFinite(userCourseInput?.Chapters) ? userCourseInput.Chapters : ""}
            onChange={(e) => {
              const value = e.target.value;
              handleInputChange("Chapters", value === "" ? "" : Number(value));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectOption
