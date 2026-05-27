import React ,{useContext}from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserInputContext } from '../../_context/UserInputContext';

const TopicDescription = () => {
  const {userCourseInput, setUserCourseInput}=useContext(UserInputContext);

  const handleInputChange=(fieldName,fieldValue)=>{ 
    setUserCourseInput(prevInput=>({
      ...prevInput,
      [fieldName]:fieldValue
    }))
  }
  return (
    <div className="mx-20 lg:mx-44">
      {/* Input Topic  */}
      <div className="mt-5">
        <label>Write topic for which you want to generate video course :</label>
        <Input placeholder={"Topic"} defaultValue={userCourseInput?.topic} onChange={(e) => handleInputChange("topic", e.target.value)} />   
      </div>
      
      {/* Description textarea  */}
      <div className="mt-5">
        <label>Tell us more about your course, what you want (Optional):</label>
        <Textarea placeholder={"About your Course"} defaultValue={userCourseInput?.description} onChange={(e) => handleInputChange("description", e.target.value)}/>
      </div>
    </div>
  )
}

export default TopicDescription