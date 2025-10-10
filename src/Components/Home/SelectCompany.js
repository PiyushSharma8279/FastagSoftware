import React, { useState, useEffect } from "react";

function SelectCompany() {
  const [companies, setCompanies] = useState(() => {
    return JSON.parse(localStorage.getItem("companies")) || [];
  });

  const [selectedCompany, setSelectedCompany] = useState(
    companies.length > 0 ? companies[0].name : ""
  );

  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem("items")) || [];
  });

  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  const [newCompany, setNewCompany] = useState({
    name: "",
    address: "",
    state: "",
    country: "",
    contact: "",
    phone: "",
  });

  const [newItem, setNewItem] = useState({
    name: "",
    desc: "",
    tag: "",
    nextTest: "",
  });

  const [filters, setFilters] = useState({
    identifier: false,
    description: false,
    serial: false,
    current: true,
    old: false,
  });

  const [contextMenu, setContextMenu] = useState(null);
  const [copiedData, setCopiedData] = useState(null);

  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies));
    localStorage.setItem("items", JSON.stringify(items));
  }, [companies, items]);

  // ✅ Add Company
  const handleAddCompany = () => {
    if (!newCompany.name.trim()) return alert("Company name is required!");
    const updated = [...companies, newCompany];
    setCompanies(updated);
    setSelectedCompany(newCompany.name);
    setNewCompany({
      name: "",
      address: "",
      state: "",
      country: "",
      contact: "",
      phone: "",
    });
    setShowAddCompany(false);
  };

  // ✅ Delete Company
  const handleDeleteCompany = (name = selectedCompany) => {
    if (!name) return;
    if (!window.confirm(`Delete "${name}"?`)) return;
    const updated = companies.filter((c) => c.name !== name);
    setCompanies(updated);
    setSelectedCompany(updated.length > 0 ? updated[0].name : "");
    setContextMenu(null);
  };

  // ✅ Add Item
  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.tag.trim())
      return alert("Please fill all fields.");
    const updated = [...items, newItem];
    setItems(updated);
    setNewItem({ name: "", desc: "", tag: "", nextTest: "" });
    setShowAddItem(false);
  };

  // ✅ Delete Item
  const handleDeleteItem = (tag) => {
    setItems(items.filter((i) => i.tag !== tag));
    setContextMenu(null);
  };

  // ✅ Copy (stores in clipboard + app state)
  const handleCopy = (data, type) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedData({ type, data });
    alert(`Copied ${type}! You can right-click and paste.`);
    setContextMenu(null);
  };

  // ✅ Paste (creates a new item/company)
  const handlePaste = (type) => {
    if (!copiedData || copiedData.type !== type) {
      alert(`No ${type} copied yet!`);
      return;
    }

    if (type === "company") {
      const newCompany = { ...copiedData.data };
      setCompanies([...companies, newCompany]);
      alert("Company pasted!");
    }

    if (type === "item") {
      const newItem = {
        ...copiedData.data,
        tag: "TAG-COPY-" + Math.floor(Math.random() * 10000), // ✅ New tag number
      };
      setItems([...items, newItem]);
      alert("Item pasted with new tag!");
    }

    setContextMenu(null);
  };

  const handleContextMenu = (e, type, data) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      type,
      data,
    });
  };

  const closeMenu = () => setContextMenu(null);

  const toggleFilter = (key) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 text-[13px]" onClick={closeMenu}>
      {/* Select Company Row */}
      <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-300">
        <label className="text-sm font-medium">Select Company:</label>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="border border-gray-400 px-2 py-[2px] rounded text-sm"
          onContextMenu={(e) =>
            handleContextMenu(
              e,
              "company",
              companies.find((c) => c.name === selectedCompany)
            )
          }
        >
          {companies.map((c, i) => (
            <option key={i} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowAddCompany(true)}
          className="bg-gray-200 border border-gray-400 px-3 py-[2px] rounded hover:bg-gray-300"
        >
          Add Company
        </button>

        <button
          onClick={() => handleDeleteCompany()}
          className="bg-gray-200 border border-gray-400 px-3 py-[2px] rounded hover:bg-gray-300"
        >
          Delete Company
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 border-t border-gray-300">
        {/* Table Section */}
        <div className="flex-1 p-2 border-r border-gray-300 bg-white overflow-y-auto ">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border border-gray-300 p-1 text-left w-[15%]">Item</th>
                <th className="border border-gray-300 p-1 text-left w-[30%]">Description</th>
                <th className="border border-gray-300 p-1 text-left w-[20%]">Tag No.</th>
                <th className="border border-gray-300 p-1 text-left w-[20%]">Next Test</th>
                <th className="border border-gray-300 p-1 w-[10%] text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, i) => (
                  <tr
                    key={i}
                    onContextMenu={(e) => handleContextMenu(e, "item", item)}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="border border-gray-300 p-1">{item.name}</td>
                    <td className="border border-gray-300 p-1">{item.desc}</td>
                    <td className="border border-gray-300 p-1">{item.tag}</td>
                    <td className="border border-gray-300 p-1">{item.nextTest}</td>
                    <td className="border border-gray-300 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.tag)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-4 text-gray-500 border border-gray-300"
                  >
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sidebar */}
        <div className="w-48 p-2 flex flex-col gap-2 bg-gray-50 border-l border-gray-300">
          <button
            onClick={() => setShowAddItem(true)}
            className="bg-gray-200 border border-gray-400 py-[2px] rounded hover:bg-gray-300"
          >
            Add Item
          </button>
          <button className="bg-gray-200 border border-gray-400 py-[2px] rounded hover:bg-gray-300">
            Delete Item
          </button>
          <button className="bg-gray-200 border border-gray-400 py-[2px] rounded hover:bg-gray-300">
            Edit Item
          </button>

          <div className="mt-2 border border-gray-300 rounded p-1">
            <p className="font-medium text-xs border-b border-gray-300 mb-1">Filter</p>
            {Object.entries(filters).map(([key, value]) => (
              <label key={key} className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleFilter(key)}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
            <button className="bg-gray-200 border border-gray-400 w-full mt-1 text-xs rounded hover:bg-gray-300">
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-1 text-xs bg-gray-200 border-t border-gray-300 flex justify-between">
        <span>Data file: FASTtag</span>
        <span>
          {companies.length} companies, {items.length} items
        </span>
      </div>

      {/* Add Company Modal */}
      {showAddCompany && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-4 w-96">
            <h2 className="font-semibold mb-2">Add New Company</h2>
            {[
              ["name", "Company Name"],
              ["address", "Address"],
              ["state", "State"],
              ["country", "Country"],
              ["contact", "Contact Name"],
              ["phone", "Phone Number"],
            ].map(([key, label]) => (
              <div key={key}>
                <h3 className="font-semibold mb-1 text-sm">{label}</h3>
                <input
                  type="text"
                  value={newCompany[key]}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, [key]: e.target.value })
                  }
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="border border-gray-400 w-full px-2 py-1 mb-2 rounded"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddCompany(false)}
                className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCompany}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-4 w-96">
            <h2 className="font-semibold mb-2">Add Item</h2>
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="border border-gray-400 w-full px-2 py-1 mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.desc}
              onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
              className="border border-gray-400 w-full px-2 py-1 mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Tag Number"
              value={newItem.tag}
              onChange={(e) => setNewItem({ ...newItem, tag: e.target.value })}
              className="border border-gray-400 w-full px-2 py-1 mb-2 rounded"
            />
            <input
              type="date"
              value={newItem.nextTest}
              onChange={(e) =>
                setNewItem({ ...newItem, nextTest: e.target.value })
              }
              className="border border-gray-400 w-full px-2 py-1 mb-3 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddItem(false)}
                className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Context Menu */}
      {contextMenu && (
        <div
          className="absolute bg-white border border-gray-400 rounded shadow-md z-50"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          <button
            onClick={() => handleCopy(contextMenu.data, contextMenu.type)}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            📋 Copy
          </button>
          <button
            onClick={() => handlePaste(contextMenu.type)}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            📥 Paste
          </button>
          {contextMenu.type === "item" && (
            <button
              onClick={() => handleDeleteItem(contextMenu.data.tag)}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
            >
              🗑️ Delete
            </button>
          )}
          {contextMenu.type === "company" && (
            <button
              onClick={() => handleDeleteCompany(contextMenu.data.name)}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectCompany;
