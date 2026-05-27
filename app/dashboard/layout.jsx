import React from 'react'
import SiderBar from './_components/SideBar'
import Header from './_components/Header'

const DashboardLayout = ({children}) => {
  return (
    <div>
        <div className="md:w-64 hidden md:block">
            <SiderBar/>     
        </div>
        <div className="md:ml-64">
          <Header/>
          <div className="p-10">
          {children}
          </div>
        </div>
        
    </div>
  )
}

export default DashboardLayout