// src/components/CompanyManager/CompanyManager.js
import React, { useEffect, useState } from "react";
import { generateCompanyId } from "../../utils";

export default function CompanyManager({
  companies = [],
  selectedCompany,
  setSelectedCompany,
  onAddCompany,
  onEditCompany,
  onDeleteCompany,
  showAllCompanies,
  setShowAllCompanies,
  externalAddCompany,
  setExternalAddCompany,
  externalEditCompany,
  setExternalEditCompany,
}) {
  const initialForm = {
    id: null,
    name: "",
    address: "",
    email: "",
    phone: "",
    contactPerson: "",
    notes: "",
    items: [],
  };

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [companyForm, setCompanyForm] = useState(initialForm);

  // respond to header triggers
  useEffect(() => {
    if (externalAddCompany) {
      setShowAdd(true);
      setExternalAddCompany?.(false);
    }
  }, [externalAddCompany, setExternalAddCompany]);

  useEffect(() => {
    if (externalEditCompany) {
      const c = companies.find((x) => x.name === externalEditCompany || x.id === externalEditCompany);
      if (c) {
        setEditing(c.name);
        setCompanyForm({ ...c });
      } else {
        alert("Company to edit not found");
      }
      setExternalEditCompany?.(null);
    }
  }, [externalEditCompany, companies, setExternalEditCompany]);

  const handleAdd = () => {
    if (!companyForm.name.trim()) return alert("Company name required");
    const id = generateCompanyId(companies);
    const newCompany = { ...companyForm, id, items: companyForm.items || [] };
    onAddCompany?.(newCompany);
    setCompanyForm(initialForm);
    setShowAdd(false);
  };

  const startEdit = (c) => {
    setEditing(c.name);
    setCompanyForm({ ...c });
  };

  const saveEdit = (oldName) => {
    if (!companyForm.name.trim()) return alert("Company name required");
    onEditCompany?.(oldName, { ...companyForm });
    setEditing(null);
    setCompanyForm(initialForm);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-semibold">Companies</h3>
        <label className="text-xs flex items-center gap-2">
          <input
            type="checkbox"
            checked={showAllCompanies}
            onChange={(e) => setShowAllCompanies?.(e.target.checked)}
          />
          Show All
        </label>
      </div>

      <div className="p-3 overflow-auto flex-1">
        <div className="flex flex-col gap-2">
          {companies.length === 0 && <div className="text-gray-500 text-sm">No companies yet</div>}
          {companies.map((c) => (
            <div
              key={c.id}
              className={`p-2 rounded border flex justify-between items-center cursor-pointer ${
                c.name === selectedCompany ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex-1" onClick={() => setSelectedCompany?.(c.name)}>
                <div className="font-medium truncate">{c.name}</div>
                {c.address && <div className="text-xs text-gray-500 truncate">{c.address}</div>}
                <div className="text-xs text-gray-400">{(c.items || []).length} items</div>
              </div>

              <div className="flex items-center gap-2">
                {editing === c.name ? (
                  <>
                    <button onClick={() => saveEdit(c.name)} className="text-xs px-2 py-1 border rounded">
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(null);
                        setCompanyForm(initialForm);
                      }}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(c)} className="text-xs px-2 py-1 border rounded">
                      Edit
                    </button>
                    <button onClick={() => onDeleteCompany?.(c.name)} className="text-xs px-2 py-1 border rounded text-red-600">
                      Del
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t flex gap-2">
        <button
          onClick={() => {
            setShowAdd(true);
            setExternalAddCompany?.(true);
          }}
          className="flex-1 bg-green-600 text-white py-2 rounded"
        >
          Add Company
        </button>
        <button
          onClick={() => {
            if (companies.length > 0) setSelectedCompany?.(companies[0].name);
          }}
          className="py-2 px-3 border rounded"
        >
          First
        </button>
      </div>

      {/* Add / Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded shadow-lg max-w-md w-full p-4 max-h-[90vh] overflow-auto">
            <h3 className="font-semibold mb-2">Add Company</h3>

            {["name", "address", "email", "phone", "contactPerson", "notes"].map((f) => (
              <input
                key={f}
                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                className="w-full border px-2 py-1 mb-2 rounded"
                value={companyForm[f] || ""}
                onChange={(e) => setCompanyForm({ ...companyForm, [f]: e.target.value })}
              />
            ))}

            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setShowAdd(false)} className="px-3 py-1 border rounded">
                Cancel
              </button>
              <button onClick={handleAdd} className="px-3 py-1 bg-blue-600 text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
