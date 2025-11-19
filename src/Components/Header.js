// src/components/Header.js
import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Header({
  onAddCompany,
  onEditCompany,
  onDeleteCompany,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onNavigate
}) {

  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Helper: Close dropdown + mobile menu + navigate + scroll to content
  const handleReportSelect = (route) => {
    onNavigate(route);
    setOpenMenu(null);        // Close report dropdown
    setMobileOpen(false);     // Close mobile menu
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow p-3" ref={headerRef}>
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">

        {/* ---------------- LEFT LOGO + NAV ---------------- */}
        <div className="flex items-center gap-4">
          
          {/* Logo */}
          <div
            onClick={() => onNavigate?.("dashboard")}
            className="font-bold text-xl cursor-pointer"
          >
            FastTag
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-2 text-sm text-gray-600">

            <button
              onClick={() => onNavigate?.("dashboard")}
              className="px-2 py-1 hover:bg-gray-50 rounded"
            >
              Dashboard
            </button>

            {/* Reports Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("reports")}
                className={`px-3 py-1 rounded flex items-center ${
                  openMenu === "reports" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                Reports <FiChevronDown className="ml-1" />
              </button>

              {openMenu === "reports" && (
                <div className="absolute mt-2 w-56 bg-white border rounded shadow z-50">
                  <div
                    className="p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleReportSelect("report:companies")}
                  >
                    Companies Report
                  </div>

                  <div
                    className="p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleReportSelect("report:inspection")}
                  >
                    Inspection Report
                  </div>

                  <div
                    className="p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleReportSelect("report:newitemform")}
                  >
                    New Item Form
                  </div>

                  <div
                    className="p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleReportSelect("report:failed")}
                  >
                    Failed Equipment
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* ---------------- RIGHT ACTION BUTTONS ---------------- */}
        <div className="hidden md:flex items-center gap-2">

          {/* Company Buttons */}
          <button onClick={onAddCompany} className="px-2 py-1 bg-green-600 text-white rounded text-sm">
            Add Company
          </button>
          <button onClick={onEditCompany} className="px-2 py-1 border rounded text-sm">
            Edit Company
          </button>
          <button onClick={onDeleteCompany} className="px-2 py-1 border rounded text-sm text-red-600">
            Del Company
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* Item Buttons */}
          <button onClick={onAddItem} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">
            Add Item
          </button>
          <button onClick={onEditItem} className="px-2 py-1 border rounded text-sm">
            Edit Item
          </button>
          <button onClick={onDeleteItem} className="px-2 py-1 border rounded text-sm text-red-600">
            Del Item
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-2 py-1 border rounded text-sm text-blue-500"
          >
            Login
          </button>
        </div>

        {/* ---------------- MOBILE BURGER ---------------- */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <FiMenu size={24} />
        </button>

      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      {mobileOpen && (
        <div className="md:hidden mt-3 bg-white border rounded shadow p-3 flex flex-col gap-2 text-sm">

          <button onClick={() => handleReportSelect("dashboard")} className="p-2 hover:bg-gray-50 rounded">
            Dashboard
          </button>

          {/* Reports Mobile */}
          <div>
            <button
              onClick={() => toggleMenu("reports")}
              className="p-2 w-full text-left hover:bg-gray-50 rounded flex items-center"
            >
              Reports <FiChevronDown className="ml-auto" />
            </button>

            {openMenu === "reports" && (
              <div className="mt-1 border rounded">
                <div
                  className="p-2 hover:bg-gray-50"
                  onClick={() => handleReportSelect("report:companies")}
                >
                  Companies Report
                </div>
                <div
                  className="p-2 hover:bg-gray-50"
                  onClick={() => handleReportSelect("report:inspection")}
                >
                  Inspection Report
                </div>
                <div
                  className="p-2 hover:bg-gray-50"
                  onClick={() => handleReportSelect("report:newitemform")}
                >
                  New Item Form
                </div>
                <div
                  className="p-2 hover:bg-gray-50"
                  onClick={() => handleReportSelect("report:failed")}
                >
                  Failed Equipment
                </div>
              </div>
            )}
          </div>

          <hr />

          {/* Mobile Company Buttons */}
          <button onClick={onAddCompany} className="p-2 bg-green-600 text-white rounded">
            Add Company
          </button>
          <button onClick={onEditCompany} className="p-2 border rounded">
            Edit Company
          </button>
          <button onClick={onDeleteCompany} className="p-2 border rounded text-red-600">
            Del Company
          </button>

          <hr />

          {/* Mobile Item Buttons */}
          <button onClick={onAddItem} className="p-2 bg-blue-600 text-white rounded">
            Add Item
          </button>
          <button onClick={onEditItem} className="p-2 border rounded">
            Edit Item
          </button>
          <button onClick={onDeleteItem} className="p-2 border rounded text-red-600">
            Del Item
          </button>

          <button
            onClick={() => navigate("/login")}
            className="p-2 border rounded text-blue-500"
          >
            Login
          </button>
        </div>
      )}
    </header>
  );
}
