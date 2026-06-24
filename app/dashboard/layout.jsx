
'use client';
import React, { useState } from 'react';
import SiderBar from './_components/SideBar';
import Header from './_components/Header';

const DashboardLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div>
      {/* Desktop Sidebar (fixed, always visible on md+) */}
      <div className="md:w-64 hidden md:block">
        <SiderBar />
      </div>

      {/* Mobile Sidebar Overlay  */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div 
            className="fixed left-0 top-0 h-full w-64 bg-white z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <SiderBar />
            {/* Mobile Close Button */}
            <button
              className="absolute top-4 right-4 text-2xl md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close Sidebar"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content -  */}
      <div className="md:ml-64">
        <Header 
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;