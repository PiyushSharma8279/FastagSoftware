// src/components/CompanyManager/CompanyManager.js
import React, { useEffect, useState } from "react";
import { generateCompanyId } from "../../utils";
import { FiEdit, FiMapPin, FiTrash } from "react-icons/fi";

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
    country: "",
    state: "",
    postcode: "",
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
      const c = companies.find((x) => x.companyName === externalEditCompany || x.id === externalEditCompany);
      if (c) {
        setEditing(c.companyName);
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
    setEditing(c.companyName);
    setCompanyForm({ ...c });
    setShowAdd(true);
  };

  const saveEdit = (oldName) => {
    if (!companyForm.companyName.trim()) return alert("Company name required");
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

    onEditCompany?.(locationCompany.companyName, {
      ...locationCompany,
      locations: [...(locationCompany.locations || []), newLocation.trim()],
    });

    setShowLocationModal(false);
  };

  // DELETE LOCATION
  const deleteLocation = (company, index) => {
    const updatedLocations = (company.locations || []).filter((_, i) => i !== index);

    onEditCompany?.(company.companyName, {
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
        <div className="flex flex-col gap-3">
          {companies.length === 0 && (
            <div className="text-gray-500 text-sm">No companies yet</div>
          )}

          {companies.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-xl border shadow-sm transition-all duration-200 flex justify-between items-start cursor-pointer
          ${c.name === selectedCompany
                  ? "bg-blue-50 border-blue-300 shadow-md"
                  : "bg-white hover:bg-gray-50 hover:shadow"
                }`}
            >
              {/* LEFT SIDE */}
              <div
                className="flex-1"
                onClick={() => setSelectedCompany?.(c.companyName)}
              >
                <div className="flex justify-between items-center pb-2 border-b mb-2">

                  {/* Company Name */}
                  <div className="font-semibold text-lg break-words flex-1">
                    {c.companyName}
                  </div>

                  {/* Right Side Buttons */}
                  <div className="flex items-center gap-1">

                    {/* Add Location */}
                    <button
                      onClick={() => openLocationModal(c)}
                      className="p-2 rounded-md bg-purple-100 hover:bg-purple-200 transition text-purple-700"
                      title="Add Location"
                    >
                      <FiMapPin size={10} />
                    </button>

                    {/* Editing Mode */}
                    {editing === c.companyName ? (
                      <>
                        <button
                          onClick={() => saveEdit(c.companyName)}
                          className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-xs"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => {
                            setEditing(null);
                            setCompanyForm(initialForm);
                            setShowAdd(false);
                          }}
                          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-xs"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Edit Button */}
                        <button
                          onClick={() => startEdit(c)}
                          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                          title="Edit Company"
                        >
                          <FiEdit size={10} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDeleteCompany?.(c.companyName)}
                          className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
                          title="Delete Company"
                        >
                          <FiTrash size={10} />
                        </button>
                      </>
                    )}
                  </div>

                </div>

                <div className="font-semibold">Locations:</div>
                <div>

                  {c.address && (
                    <div className="text-sm text-gray-600 mb-2 break-words">
                      • {c.address}
                    </div>
                  )}

                </div>

                {/* LOCATIONS */}
                {(c.locations || []).length > 0 && (
                  <div className="text-sm text-gray-700 space-y-1">


                    <ul className="space-y-1 ">
                      {c.locations.map((loc, i) => (
                        <li
                          key={i}
                          className="flex justify-between items-center 
                     rounded-md "
                        >
                          <span className="truncate space whitespace-normal">• {loc}</span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLocation(c, i);
                            }}
                            className="text-red-500 text-lg leading-none hover:text-red-700"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-2">
                  {(c.items || []).length} items
                </div>
              </div>

              {/* RIGHT SIDE BUTTONS */}

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

            {["companyName", "address", "email", "phone", "contactName", "country", "state", "postcode", "notes"].map((f) => (
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
