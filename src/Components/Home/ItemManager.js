// src/components/ItemManager/ItemManager.js
import React, { useState, useEffect } from "react";
import { generateNextTagForDate } from "../../utils";

export default function ItemManager({
  items,
  selectedCompany,
  onAddItem,
  onEditItem,
  onDeleteItem,
  setSelectedItemTag,
  selectedItemTag,
  companies,
  showAllCompanies,
}) {
  const blankForm = {
    identifier: "",
    name: "",
    equipmentType: "",
    currentTag: "",
    lastResult: "Unknown",
    testInterval: "",
    nextTest: "",
    recordTest: false,
    testDate: "",
    newTagNo: "",
    comments: "",
    visualPassed: false,
    electricalPassed: false,
    testStatus: "",
    testedBy: "",
    company: selectedCompany || "",
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ ...blankForm });
  const [editingTag, setEditingTag] = useState(null);

  // Auto numeric Identifier generator
  const generateIdentifier = () => {
    const numericIds = items
      .map((it) => {
        const id = Number(it.identifier);
        return isNaN(id) ? null : id;
      })
      .filter((n) => n !== null);

    const nextId =
      numericIds.length === 0 ? 1000 : Math.max(...numericIds) + 1;

    return String(nextId);
  };

  useEffect(() => {
    if (!showAddModal && !editingTag) {
      setForm({ ...blankForm, company: selectedCompany || "" });
    }
  }, [showAddModal, editingTag, selectedCompany]);

  // Open Add Modal
  const openAddModal = () => {
    const suggestedTag = generateNextTagForDate
      ? generateNextTagForDate(companies)
      : "";

    setForm({
      ...blankForm,
      identifier: generateIdentifier(),
      currentTag: suggestedTag,
      company: selectedCompany || "",
    });

    setShowAddModal(true);
    setEditingTag(null);
  };

  // ADD
  const handleAdd = () => {
    if (!form.identifier.trim()) return alert("Identifier required");
    if (!form.name.trim()) return alert("Description / Name required");

    const newItem = {
      ...form,
      company: form.company || selectedCompany,
    };

    onAddItem(newItem);
    setShowAddModal(false);
    setForm({ ...blankForm });
  };

  // EDIT START
  const startEdit = (it) => {
    setEditingTag(it.currentTag || it.newTagNo || it.identifier);
    setForm({ ...it, recordTest: !!it.recordTest });
    setShowAddModal(true);
  };

  // SAVE EDIT
  const saveEdit = () => {
    if (!form.identifier.trim()) return alert("Identifier required");
    if (!form.name.trim()) return alert("Description / Name required");

    const updated = { ...form };
    onEditItem(editingTag, updated);

    setEditingTag(null);
    setShowAddModal(false);
  };

  // SELECT ROW
  const onRowClick = (tag) => {
    setSelectedItemTag(tag === selectedItemTag ? null : tag);
  };

  // MARK ALL PASSED
  const markAllPassed = () => {
    setForm({
      ...form,
      visualPassed: true,
      electricalPassed: true,
      testStatus: "Passed",
    });
  };

  // ✅ DELETE (Clean + Confirm)
  const handleDelete = (e, tag) => {
    e.stopPropagation();
onDeleteItem(tag);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-2 border-b flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="px-3 py-1 border rounded bg-gray-100 text-sm"
          >
            Add Item
          </button>
          <button
            onClick={() => setSelectedItemTag(null)}
            className="px-3 py-1 border rounded text-sm"
          >
            Clear Sel
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {showAllCompanies
            ? `${items.length} items (all)`
            : `${items.length} items`}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-2">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-800">
              <th className="border p-1 text-left w-[20%]">Identifier</th>
              <th className="border p-1 text-left w-[30%]">Description</th>
              <th className="border p-1 text-left w-[15%]">Tag No.</th>
              <th className="border p-1 text-left w-[15%]">Next Test</th>
              {showAllCompanies && (
                <th className="border p-1 text-left w-[10%]">Company</th>
              )}
              <th className="border p-1 w-[10%] text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={showAllCompanies ? 6 : 5}
                  className="text-center p-4 text-gray-500 border"
                >
                  No items
                </td>
              </tr>
            )}

            {items.map((it, idx) => {
              const tag = it.tag;

              return (
                <tr
                  key={`${tag}-${idx}`}
                  onClick={() => onRowClick(tag)}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    selectedItemTag === tag ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="border p-1">{it.identifier || "-"}</td>
                  <td className="border p-1">{it.name || "-"}</td>
                  <td className="border p-1">{tag || "-"}</td>
                  <td className="border p-1">{it.nextTest || "-"}</td>
                  {showAllCompanies && (
                    <td className="border p-1">{it.company || "-"}</td>
                  )}
                  <td className="border text-center">
                    <div className="flex gap-2 justify-center">
                      {/* EDIT */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(it);
                        }}
                        className="text-xs px-2 py-1 border rounded"
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={(e) => handleDelete(e, tag)}
                        className="text-xs px-2 py-1 border rounded text-red-600"
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --------------------------------------------------------
          Modal Starts Here
      -------------------------------------------------------- */}
      {(showAddModal || editingTag) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg rounded-lg w-[700px] max-h-[85vh] overflow-auto">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-100 rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-200 rounded text-sm flex items-center justify-center">
                  🔷
                </div>
                <div className="text-xl font-bold">Item Information</div>
              </div>
            </div>

            <div className="p-4">
              {/* Main two-column */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs">Identifier</label>
                  <input
                    value={form.identifier}
                    onChange={(e) =>
                      setForm({ ...form, identifier: e.target.value })
                    }
                    className="border px-2 py-1 rounded w-full text-sm"
                  />

                  <label className="text-xs">Description</label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="border px-2 py-1 rounded w-full text-sm"
                  />

                  <label className="text-xs">Equipment Type</label>
                  <select
                    value={form.equipmentType}
                    onChange={(e) =>
                      setForm({ ...form, equipmentType: e.target.value })
                    }
                    className="border px-2 py-1 rounded w-full text-sm"
                  >
                    <option value="">-- Select --</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Safety Gear">Safety Gear</option>
                    <option value="Harness">Harness</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                  </select>

                  <label className="text-xs">Item</label>
                  <input
                    value={form.currentTag}
                    readOnly
                    className="border px-2 py-1 rounded w-full text-sm bg-gray-100"
                  />

                  <label className="text-xs">Test Interval</label>
                  <select
                    value={form.testInterval}
                    onChange={(e) =>
                      setForm({ ...form, testInterval: e.target.value })
                    }
                    className="border px-2 py-1 rounded w-full text-sm"
                  >
                    <option value="">-- Select Interval --</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="12 Months">12 Months</option>
                    <option value="24 Months">24 Months</option>
                  </select>
                </div>

                {/* Right side */}
                <div className="space-y-2">
                  <label className="text-xs">Last Result</label>
                  <input
                    value={form.lastResult}
                    readOnly
                    className="border px-2 py-1 rounded w-full text-sm bg-gray-100"
                  />

                  <label className="text-xs">Next Test</label>
                  <input
                    type="date"
                    value={form.nextTest}
                    onChange={(e) =>
                      setForm({ ...form, nextTest: e.target.value })
                    }
                    className="border px-2 py-1 rounded w-full text-sm"
                  />
                </div>
              </div>

              {/* Record Test */}
              <div className="mt-3 mb-3 border-t pt-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!form.recordTest}
                    onChange={(e) =>
                      setForm({ ...form, recordTest: e.target.checked })
                    }
                  />
                  Also record test results for this item
                </label>
              </div>

              {/* Test Result section */}
              <div
                className={`grid grid-cols-2 gap-4 ${
                  form.recordTest ? "" : "opacity-60 pointer-events-none"
                }`}
              >
                <div className="space-y-2">
                  <label className="text-xs">Test Date</label>
                  <input
                    type="date"
                    value={form.testDate}
                    onChange={(e) =>
                      setForm({ ...form, testDate: e.target.value })
                    }
                    className="border px-2 py-1 rounded w-full text-sm"
                  />

                  <label className="text-xs">New Tag No.</label>
                  <input
                    value={form.newTagNo}
                    onChange={(e) =>
                      setForm({ ...form, newTagNo: e.target.value })
                    }
                    className="border px-2 py-1 rounded w-full text-sm"
                  />

                  <label className="text-xs">Comments</label>
                  <textarea
                    value={form.comments}
                    onChange={(e) =>
                      setForm({ ...form, comments: e.target.value })
                    }
                    className="border px-2 py-1 rounded w-full text-sm h-24"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold">Test Results</div>

                    <button
                      type="button"
                      onClick={markAllPassed}
                      className="text-xs px-2 py-1 border rounded bg-gray-100"
                    >
                      Mark all passed
                    </button>
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!form.visualPassed}
                      onChange={(e) =>
                        setForm({ ...form, visualPassed: e.target.checked })
                      }
                    />
                    Visual Test Passed
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!form.electricalPassed}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          electricalPassed: e.target.checked,
                        })
                      }
                    />
                    Electrical Test Passed
                  </label>

                  <label className="text-xs">Test Status</label>
                  <select
                    value={form.testStatus}
                    onChange={(e) =>
                      setForm({ ...form, testStatus: e.target.value })
                    }
                    className="border px-2 py-1 rounded w-full text-sm"
                  >
                    <option value="">-- Select Status --</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Not Tested">Not Tested</option>
                    <option value="Unknown">Unknown</option>
                  </select>

                  <label className="text-xs">Tested By</label>
                  <input
                    value={form.testedBy}
                    onChange={(e) =>
                      setForm({ ...form, testedBy: e.target.value })
                    }
                    className="border px-2 py-1 rounded w-full text-sm"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 border-t pt-3 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTag(null);
                  }}
                  className="px-4 py-1 border rounded text-sm bg-white"
                >
                  Cancel
                </button>

                <button
                  onClick={editingTag ? saveEdit : handleAdd}
                  className="px-4 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
