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
    companyName: "",
    country:"",
    state:"",
    postcode:"",
    address: "",
    email: "",
    phone: "",
    contactName: "",
    notes: "",
    items: [],
    locations: [], // new
  };

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [companyForm, setCompanyForm] = useState(initialForm);

  // location modal state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationCompany, setLocationCompany] = useState(null);
  const [newLocation, setNewLocation] = useState("");

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
        setShowAdd(true);
      } else {
        alert("Company to edit not found");
      }
      setExternalEditCompany?.(null);
    }
  }, [externalEditCompany, companies, setExternalEditCompany]);

  const handleAdd = () => {
    if (!companyForm.companyName.trim()) return alert("Company name required");
    const id = generateCompanyId(companies);
    const newCompany = {
      ...companyForm,
      id,
      items: companyForm.items || [],
      locations: companyForm.locations || [],
    };
    onAddCompany?.(newCompany);
    setCompanyForm(initialForm);
    setShowAdd(false);
  };

  const startEdit = (c) => {
    setEditing(c.name);
    setCompanyForm({ ...c });
    setShowAdd(true);
  };

  const saveEdit = (oldName) => {
    if (!companyForm.name.trim()) return alert("Company name required");
    onEditCompany?.(oldName, { ...companyForm });
    setEditing(null);
    setCompanyForm(initialForm);
    setShowAdd(false);
  };

  // open location modal
  const openLocationModal = (company) => {
    setLocationCompany(company);
    setNewLocation("");
    setShowLocationModal(true);
  };

  // save single location
  const saveLocation = () => {
    if (!newLocation.trim()) return alert("Location required");

    onEditCompany?.(locationCompany.name, {
      ...locationCompany,
      locations: [...(locationCompany.locations || []), newLocation.trim()],
    });

    setShowLocationModal(false);
  };

  // DELETE LOCATION
  const deleteLocation = (company, index) => {
    const updatedLocations = (company.locations || []).filter((_, i) => i !== index);

    onEditCompany?.(company.name, {
      ...company,
      locations: updatedLocations,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
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

      {/* Companies List */}
      <div className="p-3 overflow-auto flex-1">
        <div className="flex flex-col gap-2">
          {companies.length === 0 && (
            <div className="text-gray-500 text-sm">No companies yet</div>
          )}

          {companies.map((c) => (
            <div
              key={c.id}
              className={`p-2 rounded border flex justify-between items-center cursor-pointer ${
                c.name === selectedCompany
                  ? "bg-blue-50 border-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              {/* LEFT SIDE (company info) */}
              <div className="flex-1" onClick={() => setSelectedCompany?.(c.companyName)}>
                <div className="font-medium truncate">{c.companyName}</div>

                {c.address && (
                  <div className="text-xs whitespace-normal text-gray-500 truncate">
                    {c.address}
                  </div>
                )}

                {/* LOCATIONS LIST */}
                {(c.locations || []).length > 0 && (
                  <div className="text-xs text-gray-600 mt-1">
                    <div className="font-semibold mb-1">Locations:</div>

                    <ul className="ml-2 flex flex-col gap-1">
                      {c.locations.map((loc, i) => (
                        <li key={i} className="flex items-center justify-between bg-gray-100 rounded px-2 py-1">
                          <span className="truncate whitespace-normal">– {loc}</span>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLocation(c, i);
                            }}
                            className="text-red-600 text-xs font-bold ml-2 hover:text-red-800"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-1">
                  {(c.items || []).length} items
                </div>
              </div>

              {/* RIGHT SIDE BUTTONS */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openLocationModal(c)}
                  className="text-xs px-2 py-1 border rounded bg-purple-200"
                >
                  +
                </button>

                {editing === c.companyName ? (
                  <>
                    <button
                      onClick={() => saveEdit(c.companyName)}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(null);
                        setCompanyForm(initialForm);
                        setShowAdd(false);
                      }}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(c)}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteCompany?.(c.companyName)}
                      className="text-xs px-2 py-1 border rounded text-red-600"
                    >
                      Del
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Buttons */}
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
            if (companies.length > 0) setSelectedCompany?.(companies[0].companyName);
          }}
          className="py-2 px-3 border rounded"
        >
          First
        </button>
      </div>

      {/* Add / Edit Company Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />

          <div className="relative bg-white rounded shadow-lg max-w-md w-full p-4 max-h-[90vh] overflow-auto">
            <h3 className="font-semibold mb-2">
              {editing ? "Edit Company" : "Add Company"}
            </h3>

            {["companyName", "address", "email", "phone", "contactName","country","state", "postcode", "notes"].map((f) => (
              <input
                key={f}
                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                className="w-full border px-2 py-1 mb-2 rounded"
                value={companyForm[f] || ""}
                onChange={(e) =>
                  setCompanyForm({ ...companyForm, [f]: e.target.value })
                }
              />
            ))}

            {/* show locations inside edit modal */}
            {editing && (companyForm.locations || []).length > 0 && (
              <div className="mb-2">
                <div className="text-xs font-medium">Locations</div>
                <ul className="list-disc ml-4 text-xs">
                  {companyForm.locations.map((loc, i) => (
                    <li key={i}>{loc}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setShowAdd(false)} className="px-3 py-1 border rounded">
                Cancel
              </button>

              <button
                onClick={editing ? () => saveEdit(editing) : handleAdd}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                {editing ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLocationModal(false)} />

          <div className="relative bg-white rounded shadow-lg max-w-md w-full p-4">
            <h3 className="font-semibold mb-2">
              Add Location for {locationCompany?.name}
            </h3>

            <input
              placeholder="Enter location"
              className="w-full border px-2 py-1 mb-2 rounded"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowLocationModal(false)} className="px-3 py-1 border rounded">
                Cancel
              </button>

              <button onClick={saveLocation} className="px-3 py-1 bg-blue-600 text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
