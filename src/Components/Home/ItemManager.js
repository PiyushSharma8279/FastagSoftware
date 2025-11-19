// src/components/ItemManager/ItemManager.js
import React, { useEffect, useState, useRef } from "react";
import { generateNextTagForDate, generateItemId } from "../../utils";

export default function ItemManager({
  items = [],
  selectedCompany,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onDuplicateItem,
  setSelectedItemTag,
  selectedItemTag,
  companies = [],
  showAllCompanies,
  externalOpenAdd,
  setExternalOpenAdd,
  externalEditTag,
  setExternalEditTag,
}) {
  const blankForm = {
    id: null,
    description: "",
    location: "",
    serial: "",
    tag: "",
    nextTestDate: "",
    equipmentType: "",
    testerName: "",
    identifier: "",
    company: selectedCompany || "",
    comments: "",
    testStatus: "",
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ ...blankForm });
  const [editingTag, setEditingTag] = useState(null);

  // local clipboard for copy/paste
  const [copiedItem, setCopiedItem] = useState(null);
  const copiedRef = useRef(null);

  // respond to external header open add
  useEffect(() => {
    if (externalOpenAdd) {
      openAddModal();
      setExternalOpenAdd?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalOpenAdd, setExternalOpenAdd]);

  useEffect(() => {
    if (externalEditTag) {
      const found = items.find((it) => it.tag === externalEditTag || String(it.id) === String(externalEditTag));
      if (found) {
        startEdit(found);
      } else {
        alert("Item to edit not found");
      }
      setExternalEditTag?.(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalEditTag, items, setExternalEditTag]);

  useEffect(() => {
    setForm((f) => ({ ...f, company: selectedCompany || "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany]);

  const openAddModal = () => {
    const suggestedTag = generateNextTagForDate(companies);
    setForm({
      ...blankForm,
      id: generateItemId(items),
      tag: suggestedTag,
      company: selectedCompany || "",
      identifier: generateIdentifier(),
    });
    setEditingTag(null);
    setShowAddModal(true);
  };

  const generateIdentifier = () => {
    try {
      const numeric = items
        .map((it) => {
          const val = Number(it.identifier);
          return Number.isNaN(val) ? null : val;
        })
        .filter((n) => n !== null);
      const next = numeric.length === 0 ? 1000 : Math.max(...numeric) + 1;
      return String(next);
    } catch {
      return String(Date.now()).slice(-6);
    }
  };

  const handleAdd = () => {
    if (!form.identifier?.toString()?.trim()) return alert("Identifier required");
    if (!form.description.trim()) return alert("Description required");
    const newItem = { ...form };
    onAddItem?.(newItem);
    setShowAddModal(false);
    setForm({ ...blankForm });
  };

  const startEdit = (it) => {
    setEditingTag(it.tag || it.id || "");
    setForm({ ...it });
    setShowAddModal(true);
  };

  const saveEdit = () => {
    if (!form.identifier?.toString()?.trim()) return alert("Identifier required");
    if (!form.description.trim()) return alert("Description required");
    onEditItem?.(editingTag, { ...form });
    setEditingTag(null);
    setShowAddModal(false);
  };

  const onRowClick = (tag) => {
    setSelectedItemTag?.(tag === selectedItemTag ? null : tag);
  };

  const handleDelete = (e, tag) => {
  e.stopPropagation();
  onDeleteItem?.(tag); 
};

  const handleDuplicate = (e, item) => {
    e.stopPropagation();
    onDuplicateItem?.(item);
  };

  // keyboard handlers for copy/paste within this list
  useEffect(() => {
    const handler = (e) => {
      const isCopy = (e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C");
      const isPaste = (e.ctrlKey || e.metaKey) && (e.key === "v" || e.key === "V");
      const isUndo = (e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z");

      // if Undo — allow parent/global handler to manage (do nothing here)
      if (isUndo) return;

      if (isCopy) {
        // copy selected item into local clipboard
        if (!selectedItemTag) {
          // nothing selected; ignore
          return;
        }
        const found = items.find((it) => String(it.tag) === String(selectedItemTag) || String(it.id) === String(selectedItemTag));
        if (found) {
          // clone
          const clone = JSON.parse(JSON.stringify(found));
          setCopiedItem(clone);
          copiedRef.current = clone;
          // optionally show small flash — kept simple with console log
          // console.log("Copied item", clone);
        }
      }

      if (isPaste) {
        // paste only if we have a copied item
        const clip = copiedRef.current || copiedItem;
        if (!clip) return;
        // set company on clip if missing: use selectedCompany prop
        const toDuplicate = { ...clip, company: clip.company || selectedCompany };
        onDuplicateItem?.(toDuplicate);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [items, selectedItemTag, copiedItem, onDuplicateItem, selectedCompany]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-3 border-b flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <button onClick={openAddModal} className="px-3 py-1 bg-green-600 text-white rounded">Add Item</button>
          {/* optional copy/paste buttons for users who prefer clicks */}
          <button
            onClick={() => {
              if (!selectedItemTag) return alert("Select an item first to copy");
              const found = items.find((it) => String(it.tag) === String(selectedItemTag) || String(it.id) === String(selectedItemTag));
              if (found) {
                setCopiedItem(JSON.parse(JSON.stringify(found)));
                copiedRef.current = JSON.parse(JSON.stringify(found));
                alert("Item copied — press Ctrl+V to paste");
              }
            }}
            className="px-3 py-1 border rounded text-sm"
          >
            Copy (Ctrl+C)
          </button>
          <button
            onClick={() => {
              const clip = copiedRef.current || copiedItem;
              if (!clip) return alert("No copied item. Use Ctrl+C or the Copy button first.");
              onDuplicateItem?.({ ...clip, company: clip.company || selectedCompany });
            }}
            className="px-3 py-1 border rounded text-sm"
          >
            Paste (Ctrl+V)
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {showAllCompanies ? `${items.length} items (all)` : `${items.filter((it) => it.company === selectedCompany).length} items`}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Company Name</th>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Serial Number</th>
                <th className="p-2 border">New Tag No</th>
                <th className="p-2 border">Next Test Date</th>
                <th className="p-2 border">Equipment Type</th>
                <th className="p-2 border">Tester Name</th>
                <th className="p-2 border">Identifier id</th>
                <th className="p-2 border text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-4 text-center text-gray-500 border">No items</td>
                </tr>
              )}

              {items.map((it) => (
                <tr key={it.id || it.tag} onClick={() => onRowClick(it.tag || it.id)} className={`hover:bg-gray-50 cursor-pointer ${selectedItemTag === (it.tag || it.id) ? "bg-blue-50" : ""}`}>
                  <td className="p-2 border font-semibold">{it.company}</td>
                  <td className="p-2 border font-semibold">{it.id ?? "-"}</td>
                  <td className="p-2 border">{it.description || "-"}</td>
                  <td className="p-2 border">{it.location || "-"}</td>
                  <td className="p-2 border">{it.serial || "-"}</td>
                  <td className="p-2 border">{it.tag || "-"}</td>
                  <td className="p-2 border">{it.nextTestDate || "-"}</td>
                  <td className="p-2 border">{it.equipmentType || "-"}</td>
                  <td className="p-2 border">{it.testerName || "-"}</td>
                  <td className="p-2 border">{it.identifier || "-"}</td>
                  <td className="p-2 border text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // copy single item with click
                          setCopiedItem(JSON.parse(JSON.stringify(it)));
                          copiedRef.current = JSON.parse(JSON.stringify(it));
                          alert("Item copied — press Ctrl+V to paste");
                        }}
                        className="px-2 py-1 border rounded text-xs text-green-700"
                      >
                        Copy
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(it);
                        }}
                        className="px-2 py-1 border rounded text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, it.tag || it.id)}
                        className="px-2 py-1 border rounded text-xs text-red-600"
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowAddModal(false); setEditingTag(null); }} />
          <div className="relative bg-white rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">{editingTag ? "Edit Item" : "Add Item"}</h3>
              <button onClick={() => { setShowAddModal(false); setEditingTag(null); }} className="px-2 py-1 border rounded">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs">Description</label>
                <input className="w-full border px-2 py-1 rounded" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

                <label className="text-xs mt-2 block">Location</label>
                <input className="w-full border px-2 py-1 rounded" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />

                <label className="text-xs mt-2 block">Serial</label>
                <input className="w-full border px-2 py-1 rounded" value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} />

                <label className="text-xs mt-2 block">New Tag No</label>
                <input className="w-full border px-2 py-1 rounded" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
              </div>

              <div>
                <label className="text-xs">Next Test Date</label>
                <input type="date" className="w-full border px-2 py-1 rounded" value={form.nextTestDate} onChange={(e) => setForm({ ...form, nextTestDate: e.target.value })} />

                <label className="text-xs mt-2 block">Equipment Type</label>
                <input className="w-full border px-2 py-1 rounded" value={form.equipmentType} onChange={(e) => setForm({ ...form, equipmentType: e.target.value })} />

                <label className="text-xs mt-2 block">Tester Name</label>
                <input className="w-full border px-2 py-1 rounded" value={form.testerName} onChange={(e) => setForm({ ...form, testerName: e.target.value })} />

                <label className="text-xs mt-2 block">Identifier</label>
                <input className="w-full border px-2 py-1 rounded" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { setShowAddModal(false); setEditingTag(null); }} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={() => (editingTag ? saveEdit() : handleAdd())} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
