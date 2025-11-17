import React, { useState } from "react";

export default function CompanyManager({
  companies,
  selectedCompany,
  setSelectedCompany,
  onAddCompany,
  onEditCompany,
  onDeleteCompany,
  showAllCompanies,
  setShowAllCompanies,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const initialForm = {
    name: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    country: "",
    contactName: "",
    phone: "",
    fax: "",
    email: "",
    comments: "",
  };

  const [companyForm, setCompanyForm] = useState(initialForm);

  const handleAdd = () => {
    if (!companyForm.name.trim()) return alert("Company name required");
    onAddCompany({ ...companyForm });
    setCompanyForm(initialForm);
    setShowAdd(false);
  };

  const startEdit = (c) => {
    setEditing(c.name);
    setCompanyForm({ ...c });
  };

  const saveEdit = (oldName) => {
    if (!companyForm.name.trim()) return alert("Company name required");
    onEditCompany(oldName, { ...companyForm });
    setEditing(null);
    setCompanyForm(initialForm);
  };

  return (
    <div className="w-64 border-r bg-white flex flex-col">
      {/* Header */}
      <div className="p-2 border-b flex items-center justify-between">
        <h3 className="font-semibold">Companies</h3>
        <label className="text-xs flex items-center gap-2">
          <input
            type="checkbox"
            checked={showAllCompanies}
            onChange={(e) => setShowAllCompanies(e.target.checked)}
          />
          Show All
        </label>
      </div>

      {/* List */}
      <div className="p-2 flex-1 overflow-auto">
        <div className="flex flex-col gap-2">
          {companies.length === 0 && (
            <div className="text-gray-500 text-sm">No companies yet</div>
          )}

          {companies.map((c) => (
            <div
              key={c.name}
              className={`p-2 rounded border flex justify-between items-center cursor-pointer ${
                c.name === selectedCompany
                  ? "bg-blue-50 border-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div onClick={() => setSelectedCompany(c.name)}>
                <div className="font-medium">{c.name}</div>
                {c.address && (
                  <div className="text-xs text-gray-500">{c.address}</div>
                )}
                <div className="text-xs text-gray-400">
                  {(c.items || []).length} items
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                {editing === c.name ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => saveEdit(c.name)}
                      className="text-xs px-2 py-1 border rounded"
                    >
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
                  </div>
                ) : (
                  <>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(c)}
                        className="text-xs px-2 py-1 border rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteCompany(c.name)}
                        className="text-xs px-2 py-1 border rounded text-red-600"
                      >
                        Del
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t">
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="flex-1 bg-gray-200 py-1 rounded border"
          >
            Add Company
          </button>
          <button
            onClick={() => {
              if (companies.length > 0)
                setSelectedCompany(companies[0].name);
            }}
            className="py-1 px-2 border rounded"
          >
            First
          </button>
        </div>
      </div>

      {/* Add Company Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-4 w-96 max-h-[90vh] overflow-auto">
            <h2 className="font-semibold mb-2">Add Company</h2>

            {/* FORM FIELDS */}
            {[
              "name",
              "address",
              "suburb",
              "state",
              "postcode",
              "country",
              "contactName",
              "phone",
              "fax",
              "email",
              "comments",
            ].map((field) => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="border w-full px-2 py-1 mb-2 rounded"
                value={companyForm[field]}
                onChange={(e) =>
                  setCompanyForm({ ...companyForm, [field]: e.target.value })
                }
              />
            ))}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
