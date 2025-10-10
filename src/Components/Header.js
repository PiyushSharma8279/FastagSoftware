import React, { useState, useRef, useEffect } from "react";

function Header() {
  const [openMenu, setOpenMenu] = useState(null);
  const headerRef = useRef(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={headerRef} className="font-sans text-[13px] relative">
      
      <div className="p-1 bg-gray-200 font-medium border-b border-gray-300">
        FASTtag - FASTtag
      </div>

     
      <div className="bg-blue-200 flex gap-6 text-sm px-4 py-1 border-b border-gray-400 select-none">
        {["File", "Edit", "View", "Reports", "Tools", "Help"].map((item) => (
          <p
            key={item}
            onClick={() => toggleMenu(item)}
            className={`cursor-pointer hover:bg-blue-300 px-1 rounded ${
              openMenu === item ? "bg-blue-300" : ""
            }`}
          >
            {item}
          </p>
        ))}
      </div>

      
      {openMenu === "File" && (
        <div className="absolute bg-gray-100 border border-gray-400 shadow-md w-48 text-[13px] text-gray-700 ">
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">New</p>
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Open</p>
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Save As...</p>
          <hr className="border-gray-300" />
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Import</p>
          <hr className="border-gray-300" />
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Backup</p>
          <hr className="border-gray-300" />
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Restore...</p>
          <hr className="border-gray-300" />
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Send Emails...</p>
          <hr className="border-gray-300" />
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Exit</p>
        </div>
      )}

      {openMenu === "Edit" && (
        <div className="absolute bg-gray-100 border border-gray-400 shadow-md w-48 ml-[42px] text-[13px] text-gray-700 ">
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Add Company</p>
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Edit Company</p>
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Delete Company</p>
          <hr className="border-gray-300" />
          <div className="hover:bg-blue-100 cursor-pointer p-1 px-3 flex justify-between">
            <span>Add Item</span>
            <span>Ctrl+A</span>
          </div>
          <div className="hover:bg-blue-100 cursor-pointer p-1 px-3 flex justify-between">
            <span>Edit Item</span>
            <span>Ctrl+E</span>
          </div>
          <div className="hover:bg-blue-100 cursor-pointer p-1 px-3 flex justify-between">
            <span>Delete Item</span>
            <span>Ctrl+D</span>
          </div>
          <hr className="border-gray-300" />
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Clear Clipboard</p>
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Select All</p>
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Recover</p>
          <hr className="border-gray-300" />
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">Exit</p>
        </div>
      )}

      {openMenu === "View" && (
        <div className="absolute bg-gray-100 border border-gray-400 shadow-md w-48 ml-[100px] text-[13px] text-gray-700 ">
          <p className="hover:bg-blue-100 cursor-pointer p-1 px-3">All Categories</p>
        </div>
      )}
    </div>
  );
}

export default Header;
