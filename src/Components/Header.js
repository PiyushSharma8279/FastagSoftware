// src/components/Header/Header.js
import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiMenu } from "react-icons/fi";

export default function Header({
  onAddCompany,
  onEditCompany,
  onDeleteCompany,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onNavigate,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const headerRef = useRef(null);

  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={headerRef} className="relative select-none bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-left gap-10">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-gradient-to-br from-red-400 to-red-600 text-white font-bold flex items-center justify-center">
            PQ
          </div>
          <div className="text-xl font-bold">PowerQ</div>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-3 text-sm items-center">
          
          {/* FILE */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("file")}
              className={`px-3 py-1 rounded ${openMenu === "file" ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              File <FiChevronDown className="inline-block ml-1" />
            </button>

            {openMenu === "file" && (
              <div className="absolute mt-2 w-44 bg-white border rounded shadow z-40">
                <div className="p-2 hover:bg-gray-50 cursor-pointer">New</div>
                <div className="p-2 hover:bg-gray-50 cursor-pointer">Open</div>
                <div className="p-2 hover:bg-gray-50 cursor-pointer">Save As...</div>
              </div>
            )}
          </div>

          {/* EDIT */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("edit")}
              className={`px-3 py-1 rounded ${openMenu === "edit" ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              Edit <FiChevronDown className="inline-block ml-1" />
            </button>

            {openMenu === "edit" && (
              <div className="absolute mt-2 w-56 bg-white border rounded shadow z-40">

                <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => { setOpenMenu(null); onAddCompany?.(); }}>
                  Add Company
                </div>

                <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => { setOpenMenu(null); onEditCompany?.(); }}>
                  Edit Company
                </div>

                <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => { setOpenMenu(null); onDeleteCompany?.(); }}>
                  Delete Company
                </div>

                <hr />

                <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => { setOpenMenu(null); onAddItem?.(); }}>
                  Add Item
                </div>

                <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => { setOpenMenu(null); onEditItem?.(); }}>
                  Edit Item
                </div>

                <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => { setOpenMenu(null); onDeleteItem?.(); }}>
                  Delete Item
                </div>
              </div>
            )}
          </div>

          {/* REPORTS */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("reports")}
              className={`px-3 py-1 rounded ${openMenu === "reports" ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              Reports <FiChevronDown className="inline-block ml-1" />
            </button>

            {openMenu === "reports" && (
              <div className="absolute mt-2 w-64 bg-white border rounded shadow z-40">

                <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => onNavigate("report:companies")}>
                  Companies Report
                </div>

                <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => onNavigate("report:inspection")}>
                  Inspection Report
                </div>

                <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => onNavigate("report:newitemform")}>
                  New Item Form
                </div>

                <div className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => onNavigate("report:failed")}>
                  Failed Equipment
                </div>
              </div>
            )}
          </div>

        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => toggleMenu("mobile")}
        >
          <FiMenu />
        </button>
      </div>

      {/* FULL MOBILE MENU */}
      {openMenu === "mobile" && (
        <div className="md:hidden bg-white border-t shadow text-sm p-2 space-y-2">

          {/* FILE */}
          <div className="font-semibold text-gray-700">File</div>
          <div className="ml-3 space-y-1">
            <div className="p-2 hover:bg-gray-100 rounded">New</div>
            <div className="p-2 hover:bg-gray-100 rounded">Open</div>
            <div className="p-2 hover:bg-gray-100 rounded">Save As...</div>
          </div>

          {/* EDIT */}
          <div className="font-semibold text-gray-700 mt-2">Edit</div>
          <div className="ml-3 space-y-1">
            <div className="p-2 hover:bg-gray-100 rounded" onClick={onAddCompany}>Add Company</div>
            <div className="p-2 hover:bg-gray-100 rounded" onClick={onEditCompany}>Edit Company</div>
            <div className="p-2 hover:bg-gray-100 rounded" onClick={onDeleteCompany}>Delete Company</div>
            <div className="p-2 hover:bg-gray-100 rounded" onClick={onAddItem}>Add Item</div>
            <div className="p-2 hover:bg-gray-100 rounded" onClick={onEditItem}>Edit Item</div>
            <div className="p-2 hover:bg-gray-100 rounded" onClick={onDeleteItem}>Delete Item</div>
          </div>

          {/* REPORTS */}
          <div className="font-semibold text-gray-700 mt-2">Reports</div>
          <div className="ml-3 space-y-1">
            <div className="p-2 hover:bg-gray-100 rounded" onClick={() => onNavigate("report:companies")}>Companies</div>
            <div className="p-2 hover:bg-gray-100 rounded" onClick={() => onNavigate("report:inspection")}>Inspection</div>
            <div className="p-2 hover:bg-gray-100 rounded" onClick={() => onNavigate("report:newitemform")}>New Item Form</div>
            <div className="p-2 hover:bg-gray-100 rounded" onClick={() => onNavigate("report:failed")}>Failed Equipment</div>
          </div>

        </div>
      )}
    </div>
  );
}
