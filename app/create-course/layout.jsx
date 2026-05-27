"use client"
import React from 'react'
import Header from "../dashboard/_components/Header"
import { UserInputContext } from '../_context/UserInputContext'
import {useState} from "react";

const CreateCourseLayout = ({children}) => {
  const [userCourseInput, setUserCourseInput] =useState([])
  return ( 
    <div>
      <UserInputContext.Provider value={{
        userCourseInput, setUserCourseInput
      }}>
      <>
       <Header/>
        {children}
      </>
      </UserInputContext.Provider>
       
    </div>
  )
}

export default CreateCourseLayout