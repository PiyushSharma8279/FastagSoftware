// src/pages/MainDashboard.js
import React, { useEffect, useState } from "react";
import Header from "../Header";
import CompanyManager from "./CompanyManager";
import ItemManager from "./ItemManager";
import Reports from "../Reports/Reports";
import { generateItemId, generateCompanyId } from "../../utils";

const STORAGE_KEY = "fasttag_companies_v2";

export default function MainDashboard() {
  // load from localStorage or start empty (no sample companies)
  const [companies, setCompanies] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
      return []; // no seed data
    } catch {
      return [];
    }
  });

  // flatten items for reports and aggregated views
  const items = companies.flatMap((c) => (c.items || []).map((it) => ({ ...it, company: c.name })));

  const [selectedCompany, setSelectedCompany] = useState(companies[0]?.name || "");
  const [selectedItemTag, setSelectedItemTag] = useState(null);
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  // external header triggers (wires header menu -> child components)
  const [externalAddCompany, setExternalAddCompany] = useState(false);
  const [externalEditCompany, setExternalEditCompany] = useState(null);

  const [externalOpenAddItem, setExternalOpenAddItem] = useState(false);
  const [externalEditItemTag, setExternalEditItemTag] = useState(null);

  // view / report state
  const [view, setView] = useState("dashboard"); // "dashboard" | "report"
  const [selectedReport, setSelectedReport] = useState("companies");

  // persist companies
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
    } catch {}
  }, [companies]);

  // ensure selectedCompany remains valid
  useEffect(() => {
    if (!selectedCompany && companies.length > 0) {
      setSelectedCompany(companies[0].name);
    }
    if (companies.length === 0) {
      setSelectedCompany("");
    }
  }, [companies, selectedCompany]);

  // -----------------------
  // Company actions
  // -----------------------
  const addCompany = (companyData) => {
    // companyData expected to be object (id, name, address, email, phone, contactPerson, notes)
    const id = companyData?.id ?? generateCompanyId(companies);
    const newC = { ...companyData, id, items: companyData.items || [] };
    setCompanies((prev) => [...prev, newC]);
    setSelectedCompany(newC.name);
  };

  const editCompany = (oldName, updates) => {
    setCompanies((prev) => prev.map((c) => (c.name === oldName ? { ...c, ...updates } : c)));
    if (updates.name && updates.name !== oldName) setSelectedCompany(updates.name);
  };

  const deleteCompany = (name) => {
    if (!window.confirm(`Delete company "${name}" and all its items?`)) return;
    setCompanies((prev) => prev.filter((c) => c.name !== name));
    setSelectedItemTag(null);
    // pick a new selected company if any remain
    setTimeout(() => {
      const after = companies.filter((c) => c.name !== name);
      if (after.length > 0) setSelectedCompany(after[0].name);
      else setSelectedCompany("");
    }, 0);
  };

  // -----------------------
  // Item actions (nested under the company)
  // -----------------------
  const addItem = (itemData) => {
    if (!itemData?.company) {
      alert("Please select a company for the item.");
      return;
    }

    setCompanies((prev) =>
      prev.map((c) =>
        c.name === itemData.company
          ? {
              ...c,
              items: [
                ...(c.items || []),
                {
                  ...itemData,
                  id: generateItemId(c.items || []),
                },
              ],
            }
          : c
      )
    );
  };

  const editItem = (tagOrId, updates) => {
    setCompanies((prev) =>
      prev.map((c) => ({
        ...c,
        items: (c.items || []).map((it) => {
          if (it.tag === tagOrId || String(it.id) === String(tagOrId)) {
            return { ...it, ...updates };
          }
          return it;
        }),
      }))
    );
  };

  const deleteItem = (tagOrId) => {
    if (!window.confirm("Delete selected item?")) return;
    setCompanies((prev) =>
      prev.map((c) => ({ ...c, items: (c.items || []).filter((it) => !(it.tag === tagOrId || String(it.id) === String(tagOrId))) }))
    );
    setSelectedItemTag(null);
  };

  // -----------------------
  // Header handlers (wired to Header menu)
  // -----------------------
  const handleHeaderAddCompany = () => {
    setExternalAddCompany(true);
    setView("dashboard");
  };

  const handleHeaderEditCompany = () => {
    if (!selectedCompany) return alert("Select a company first.");
    setExternalEditCompany(selectedCompany);
    setView("dashboard");
  };

  const handleHeaderDeleteCompany = () => {
    if (!selectedCompany) return alert("Select a company first.");
    if (window.confirm(`Delete company "${selectedCompany}"?`)) {
      deleteCompany(selectedCompany);
    }
  };

  const handleHeaderAddItem = () => {
    if (!selectedCompany) return alert("Select a company first.");
    setExternalOpenAddItem(true);
    setView("dashboard");
  };

  const handleHeaderEditItem = () => {
    if (!selectedItemTag) return alert("Select an item first.");
    setExternalEditItemTag(selectedItemTag);
    setView("dashboard");
  };

  const handleHeaderDeleteItem = () => {
    if (!selectedItemTag) return alert("Select an item first.");
    if (window.confirm(`Delete item "${selectedItemTag}"?`)) {
      deleteItem(selectedItemTag);
    }
  };

  // Navigate from header (reports)
  const handleNavigate = (nav) => {
    if (String(nav).startsWith("report:")) {
      setSelectedReport(nav.split(":")[1]);
      setView("report");
    } else {
      setView("dashboard");
    }
  };

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onAddCompany={handleHeaderAddCompany}
        onEditCompany={handleHeaderEditCompany}
        onDeleteCompany={handleHeaderDeleteCompany}
        onAddItem={handleHeaderAddItem}
        onEditItem={handleHeaderEditItem}
        onDeleteItem={handleHeaderDeleteItem}
        onNavigate={handleNavigate}
      />

      <div className="max-w-screen-xl mx-auto p-4">
        {view === "dashboard" && (
          <div className="flex flex-col md:flex-row gap-4">
            {/* sidebar: visible on mobile & desktop (so add modal works on mobile) */}
            <div className="w-full md:w-80">
              <CompanyManager
                companies={companies}
                selectedCompany={selectedCompany}
                setSelectedCompany={(name) => {
                  setSelectedCompany(name);
                  setSelectedItemTag(null);
                }}
                onAddCompany={addCompany}
                onEditCompany={editCompany}
                onDeleteCompany={deleteCompany}
                showAllCompanies={showAllCompanies}
                setShowAllCompanies={setShowAllCompanies}
                externalAddCompany={externalAddCompany}
                setExternalAddCompany={setExternalAddCompany}
                externalEditCompany={externalEditCompany}
                setExternalEditCompany={setExternalEditCompany}
              />
            </div>

            {/* main */}
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="hidden md:inline-block text-sm text-gray-700 mr-2">Company:</label>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedCompany}
                    onChange={(e) => {
                      setSelectedCompany(e.target.value);
                      setSelectedItemTag(null);
                    }}
                  >
                    <option value="">-- Select Company --</option>
                    {companies.map((c) => (
                      <option value={c.name} key={c.id ?? c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button onClick={handleHeaderAddCompany} className="px-3 py-1 bg-red-500 text-white rounded">
                    Add New Company
                  </button>
                  <button onClick={handleHeaderAddItem} className="px-3 py-1 bg-green-600 text-white rounded">
                    Add Item
                  </button>
                </div>
              </div>

              <div className="bg-white rounded shadow">
                <ItemManager
                  items={showAllCompanies ? items : items.filter((it) => it.company === selectedCompany)}
                  selectedCompany={selectedCompany}
                  onAddItem={(item) => addItem(item.company || selectedCompany, item)}
                  onEditItem={(tagOrId, updates) => editItem(tagOrId, updates)}
                  onDeleteItem={(tagOrId) => deleteItem(tagOrId)}
                  setSelectedItemTag={setSelectedItemTag}
                  selectedItemTag={selectedItemTag}
                  companies={companies}
                  showAllCompanies={showAllCompanies}
                  externalOpenAdd={externalOpenAddItem}
                  setExternalOpenAdd={setExternalOpenAddItem}
                  externalEditTag={externalEditItemTag}
                  setExternalEditTag={setExternalEditItemTag}
                />
              </div>
            </div>
          </div>
        )}

        {view === "report" && (
          <div className="bg-white rounded shadow">
            <div className="p-3 border-b flex items-center justify-between">
              <h2 className="font-semibold">Reports / {selectedReport}</h2>
              <div>
                <button
                  onClick={() => setView("dashboard")}
                  className="px-3 py-1 border rounded"
                >
                  Back
                </button>
              </div>
            </div>

            <Reports selectedReport={selectedReport} companies={companies} items={items} />
          </div>
        )}
      </div>
    </div>
  );
}
