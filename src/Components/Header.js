import React, { useState, useRef, useEffect } from "react";

export default function Header({
  onAddCompany,
  onEditCompany,
  onDeleteCompany,
  onAddItem,
  onEditItem,
  onDeleteItem,
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
    <div ref={headerRef} className="relative select-none">
      <div className="p-3 flex items-center justify-between glass-card">
        <div className="flex items-center gap-4">
          <div className="text-lg font-bold">PowerQ</div>

          <nav className="flex gap-4 text-sm">
            {["File", "Edit", "View", "Reports", "Tools", "Help"].map((item) => (
              <div
                key={item}
                className={`px-2 py-1 rounded-md cursor-pointer ${openMenu === item ? "bg-white/30" : "hover:bg-white/20"}`}
                onClick={() => toggleMenu(item)}
              >
                {item}
              </div>
            ))}
          </nav>
        </div>

        
      </div>

      {/* Menus */}
      {openMenu === "File" && (
        <div className="absolute left-4 mt-2 w-48 bg-white/90 backdrop-blur rounded shadow z-40 border">
          <div className="p-2 hover:bg-blue-50 cursor-pointer">New</div>
          <div className="p-2 hover:bg-blue-50 cursor-pointer">Open</div>
          <div className="p-2 hover:bg-blue-50 cursor-pointer">Save As...</div>
          <hr />
          <div className="p-2 hover:bg-blue-50 cursor-pointer">Import</div>
        </div>
      )}

      {openMenu === "Edit" && (
        <div className="absolute left-24 mt-2 w-56 bg-white/90 backdrop-blur rounded shadow z-40 border">
          <div
            onClick={() => { setOpenMenu(null); onAddCompany?.(); }}
            className="p-2 hover:bg-blue-50 cursor-pointer"
          >
            Add Company
          </div>

          <div
            onClick={() => { setOpenMenu(null); onEditCompany?.(); }}
            className="p-2 hover:bg-blue-50 cursor-pointer"
          >
            Edit Company
          </div>

          <div
            onClick={() => { setOpenMenu(null); onDeleteCompany?.(); }}
            className="p-2 hover:bg-blue-50 cursor-pointer"
          >
            Delete Company
          </div>

          <hr />

          <div
            onClick={() => { setOpenMenu(null); onAddItem?.(); }}
            className="p-2 hover:bg-blue-50 cursor-pointer flex justify-between"
          >
            <span>Add Item</span>
            <span className="text-xs text-gray-400">Ctrl+A</span>
          </div>

          <div
            onClick={() => { setOpenMenu(null); onEditItem?.(); }}
            className="p-2 hover:bg-blue-50 cursor-pointer flex justify-between"
          >
            <span>Edit Item</span>
            <span className="text-xs text-gray-400">Ctrl+E</span>
          </div>

          <div
            onClick={() => { setOpenMenu(null); onDeleteItem?.(); }}
            className="p-2 hover:bg-blue-50 cursor-pointer flex justify-between"
          >
            <span>Delete Item</span>
            <span className="text-xs text-gray-400">Ctrl+D</span>
          </div>
        </div>
      )}

      {openMenu === "View" && (
        <div className="absolute left-56 mt-2 w-48 bg-white/90 backdrop-blur rounded shadow z-40 border">
          <div className="p-2 hover:bg-blue-50 cursor-pointer">All Categories</div>
        </div>
      )}
    </div>
  );
}
