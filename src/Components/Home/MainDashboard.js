// src/pages/MainDashboard.js
import React, { useEffect, useState } from "react";
import Header from "../Header";
import CompanyManager from "./CompanyManager";
import ItemManager from "./ItemManager";
import Reports from "../Reports/Reports";
import { generateItemId, generateCompanyId } from "../../utils";

const STORAGE_KEY = "fasttag_companies_v2";

export default function MainDashboard() {
  const [companies, setCompanies] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const items = companies.flatMap((c) =>
    (c.items || []).map((it) => ({ ...it, company: c.companyName }))
  );

  const [selectedCompany, setSelectedCompany] = useState(
    companies[0]?.companyName || ""
  );

  const [selectedItemTag, setSelectedItemTag] = useState(null);
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  const [externalAddCompany, setExternalAddCompany] = useState(false);
  const [externalEditCompany, setExternalEditCompany] = useState(null);

  const [externalOpenAddItem, setExternalOpenAddItem] = useState(false);
  const [externalEditItemTag, setExternalEditItemTag] = useState(null);

  const [view, setView] = useState("dashboard");
  const [selectedReport, setSelectedReport] = useState("companies");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
    } catch {}
  }, [companies]);

  useEffect(() => {
    if (!selectedCompany && companies.length > 0)
      setSelectedCompany(companies[0].companyName);

    if (companies.length === 0) setSelectedCompany("");
  }, [companies, selectedCompany]);

  // ----------------------------------------------------
  // COMPANY METHODS
  // ----------------------------------------------------
  const addCompany = (data) => {
    const newCompany = {
      ...data,
      id: data.id ?? generateCompanyId(companies),
      items: data.items || [],
    };

    setCompanies((p) => [...p, newCompany]);
    setSelectedCompany(newCompany.companyName);
  };

  const editCompany = (oldName, updates) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.companyName === oldName ? { ...c, ...updates } : c
      )
    );

    if (updates.companyName && updates.companyName !== oldName)
      setSelectedCompany(updates.companyName);
  };

  const deleteCompany = (companyName) => {
    if (!window.confirm(`Delete company "${companyName}"?`)) return;

    const filtered = companies.filter((c) => c.companyName !== companyName);

    setCompanies(filtered);
    setSelectedItemTag(null);
    setSelectedCompany(filtered[0]?.companyName || "");
  };

  // ----------------------------------------------------
  // ITEM METHODS
  // ----------------------------------------------------
  const addItem = (itemData) => {
    const companyName = itemData.company || selectedCompany;

    if (!companyName) {
      alert("Please select a company first.");
      return;
    }

    setCompanies((prev) =>
      prev.map((c) =>
        c.companyName === companyName
          ? {
              ...c,
              items: [
                ...c.items,
                { ...itemData, id: generateItemId(c.items) },
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
        items: c.items.map((it) =>
          it.tag === tagOrId || String(it.id) === String(tagOrId)
            ? { ...it, ...updates }
            : it
        ),
      }))
    );
  };

  const deleteItem = (tagOrId) => {
    if (!window.confirm("Delete selected item?")) return;

    setCompanies((prev) =>
      prev.map((c) => ({
        ...c,
        items: c.items.filter(
          (it) =>
            !(it.tag === tagOrId || String(it.id) === String(tagOrId))
        ),
      }))
    );

    setSelectedItemTag(null);
  };

  // ----------------------------------------------------
  // HEADER MENU HANDLERS
  // ----------------------------------------------------
  const handleHeaderAddCompany = () => {
    setExternalAddCompany(true);
    setView("dashboard");
  };

  const handleHeaderEditCompany = () => {
    if (!selectedCompany) return alert("Select a company first.");
    setExternalEditCompany(selectedCompany);
  };

  const handleHeaderDeleteCompany = () => {
    if (!selectedCompany) return alert("Select a company first.");
    deleteCompany(selectedCompany);
  };

  const handleHeaderAddItem = () => {
    if (!selectedCompany) return alert("Select a company first.");
    setExternalOpenAddItem(true);
  };

  const handleHeaderEditItem = () => {
    if (!selectedItemTag) return alert("Select an item first.");
    setExternalEditItemTag(selectedItemTag);
  };

  const handleHeaderDeleteItem = () => {
    if (!selectedItemTag) return alert("Select an item first.");
    deleteItem(selectedItemTag);
  };

  const handleNavigate = (nav) => {
    if (nav.startsWith("report:")) {
      setSelectedReport(nav.split(":")[1]);
      setView("report");
    } else {
      setView("dashboard");
    }
  };

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------
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
            {/* Left side: company list */}
            <div className="w-full md:w-80">
              <CompanyManager
                companies={companies}
                selectedCompany={selectedCompany}
                setSelectedCompany={(companyName) => {
                  setSelectedCompany(companyName);
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

            {/* Right side: items */}
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
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
                    <option key={c.id} value={c.companyName}>
                      {c.companyName}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={handleHeaderAddCompany}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Add New Company
                  </button>
                  <button
                    onClick={handleHeaderAddItem}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              <div className="bg-white rounded shadow">
                <ItemManager
                  items={
                    showAllCompanies
                      ? items
                      : items.filter(
                          (it) => it.company === selectedCompany
                        )
                  }
                  selectedCompany={selectedCompany}
                  onAddItem={addItem}
                  onEditItem={editItem}
                  onDeleteItem={deleteItem}
                  selectedItemTag={selectedItemTag}
                  setSelectedItemTag={setSelectedItemTag}
                  companies={companies}
                  showAllCompanies={showAllCompanies}
                  externalOpenAdd={externalOpenAddItem}
                  setExternalOpenAdd={setExternalOpenAddItem}
                  externalEditTag={externalEditItemTag}
                  setExternalEditTag={setExternalEditItemTag}
                />
              </div>

              <div className="flex justify-end items-end">
                <div>
                  Companies:{companies.length} &nbsp; Items:{items.length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORT VIEW */}
        {view === "report" && (
          <div className="bg-white rounded shadow">
            <div className="p-3 border-b flex justify-between">
              <h2 className="font-semibold">
                Reports / {selectedReport}
              </h2>
              <button
                onClick={() => setView("dashboard")}
                className="px-3 py-1 border rounded"
              >
                Back
              </button>
            </div>

            <Reports
              selectedReport={selectedReport}
              companies={companies}
              items={items}
            />
          </div>
        )}
      </div>
    </div>
  );
}
