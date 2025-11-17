import React, { useEffect, useState, useRef } from "react";

import { generateNextTagForDate } from "../../utils";
import Header from "../Header";
import CompanyManager from "./CompanyManager";
import ItemManager from "./ItemManager";


const STORAGE_KEY = "fasttag_companies_v1";

export default function MainDashboard() {
  const [companies, setCompanies] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  // UI state
  const [selectedCompany, setSelectedCompany] = useState(
    companies[0]?.name || ""
  );
  const [selectedItemTag, setSelectedItemTag] = useState(null);
  const [copiedItem, setCopiedItem] = useState(null);
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  // Header -> component control flags
  const [headerOpenAddCompany, setHeaderOpenAddCompany] = useState(false);
  const [headerEditCompanyName, setHeaderEditCompanyName] = useState(null);

  const [headerOpenAddItem, setHeaderOpenAddItem] = useState(false);
  const [headerEditItemTag, setHeaderEditItemTag] = useState(null);

  // Undo stack
  const undoStackRef = useRef([]);
  const pushHistory = (prev) => {
    undoStackRef.current.push(JSON.parse(JSON.stringify(prev)));
    if (undoStackRef.current.length > 50) undoStackRef.current.shift();
  };

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }, [companies]);

  // ensure selectedCompany valid
  useEffect(() => {
    if (!selectedCompany && companies.length > 0) {
      setSelectedCompany(companies[0].name);
    }
    if (companies.length === 0) {
      setSelectedCompany("");
    }
  }, [companies, selectedCompany]);

  // Keyboard shortcuts: Ctrl+C, Ctrl+V, Ctrl+Z
  useEffect(() => {
    const handler = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      const key = e.key.toLowerCase();

      if (key === "c") {
        e.preventDefault();
        if (!selectedItemTag) return;
        const comp = companies.find((c) => c.name === selectedCompany);
        const item = comp?.items?.find((i) => i.tag === selectedItemTag);
        if (item) {
          setCopiedItem(item);
          console.log("Copied item:", item);
        }
      }

      if (key === "v") {
        e.preventDefault();
        if (!copiedItem) return;
        if (!selectedCompany) {
          alert("Select a company to paste into.");
          return;
        }
        pushHistory(companies);
        setCompanies((prev) =>
          prev.map((c) =>
            c.name === selectedCompany
              ? {
                  ...c,
                  items: [
                    ...(c.items || []),
                    {
                      ...copiedItem,
                      tag: generateNextTagForDate(prev),
                    },
                  ],
                }
              : c
          )
        );
      }

      if (key === "z") {
        e.preventDefault();
        const prev = undoStackRef.current.pop();
        if (prev) {
          setCompanies(prev);
          if (prev.length > 0) setSelectedCompany(prev[0].name);
          setSelectedItemTag(null);
        } else {
          console.log("Nothing to undo");
        }
      }

      // quick header shortcuts (optional)
      if (key === "a" && (e.ctrlKey || e.metaKey)) {
        // Ctrl/Cmd + A => open Add Item via header
        e.preventDefault();
        handleHeaderAddItem();
      }
      if (key === "e" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleHeaderEditItem();
      }
      if (key === "d" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleHeaderDeleteItem();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [companies, selectedItemTag, selectedCompany, copiedItem]);

  // Company actions
  const addCompany = (companyData) => {
    pushHistory(companies);
    const newC = { ...companyData, items: [] };
    const updated = [...companies, newC];
    setCompanies(updated);
    setSelectedCompany(companyData.name);
  };

  const editCompany = (name, updates) => {
    pushHistory(companies);
    setCompanies((prev) => prev.map((c) => (c.name === name ? { ...c, ...updates } : c)));
    if (updates.name && updates.name !== name) {
      setSelectedCompany(updates.name);
    }
  };

  const deleteCompany = (name) => {
    if (!window.confirm(`Delete company "${name}" and all its items?`)) return;
    pushHistory(companies);
    const updated = companies.filter((c) => c.name !== name);
    setCompanies(updated);
    setSelectedItemTag(null);
    if (updated.length > 0) setSelectedCompany(updated[0].name);
    else setSelectedCompany("");
  };

  // Item actions
  const addItem = (itemData) => {
    if (!selectedCompany) {
      alert("Select a company first.");
      return;
    }
    pushHistory(companies);
    setCompanies((prev) =>
      prev.map((c) =>
        c.name === selectedCompany
          ? { ...c, items: [...(c.items || []), { ...itemData, tag: generateNextTagForDate(prev) }] }
          : c
      )
    );
  };

  const editItem = (tag, updates) => {
    pushHistory(companies);
    setCompanies((prev) =>
      prev.map((c) => ({
        ...c,
        items: (c.items || []).map((it) => (it.tag === tag ? { ...it, ...updates } : it)),
      }))
    );
  };

  const deleteItem = (tag) => {
    pushHistory(companies);
    setCompanies((prev) =>
      prev.map((c) => ({ ...c, items: (c.items || []).filter((it) => it.tag !== tag) })))
    ;
    setSelectedItemTag(null);
  };

  // Header handlers (connected to menu)
  const handleHeaderAddCompany = () => setHeaderOpenAddCompany(true);
  const handleHeaderEditCompany = () => {
    if (!selectedCompany) return alert("Select a company first.");
    setHeaderEditCompanyName(selectedCompany);
  };
  const handleHeaderDeleteCompany = () => {
    if (!selectedCompany) return alert("Select a company first.");
    if (window.confirm(`Delete company "${selectedCompany}"?`)) {
      deleteCompany(selectedCompany);
    }
  };

  const handleHeaderAddItem = () => {
    if (!selectedCompany) return alert("Select a company first.");
    setHeaderOpenAddItem(true);
  };
  const handleHeaderEditItem = () => {
    if (!selectedItemTag) return alert("Select an item first.");
    setHeaderEditItemTag(selectedItemTag);
  };
  const handleHeaderDeleteItem = () => {
    if (!selectedItemTag) return alert("Select an item first.");
    if (window.confirm(`Delete item "${selectedItemTag}"?`)) {
      deleteItem(selectedItemTag);
    }
  };

  // Show All companies aggregated items
  const aggregatedItems = companies.flatMap((c) =>
    (c.items || []).map((it) => ({ ...it, company: c.name }))
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 text-[13px]">
      <Header
        onAddCompany={handleHeaderAddCompany}
        onEditCompany={handleHeaderEditCompany}
        onDeleteCompany={handleHeaderDeleteCompany}
        onAddItem={handleHeaderAddItem}
        onEditItem={handleHeaderEditItem}
        onDeleteItem={handleHeaderDeleteItem}
      />

      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        <div className="w-80 glass-card p-3">
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

            // external header triggers
            externalAddCompany={headerOpenAddCompany}
            setExternalAddCompany={setHeaderOpenAddCompany}
            externalEditCompany={headerEditCompanyName}
            setExternalEditCompany={setHeaderEditCompanyName}
          />
        </div>

        <div className="flex-1 flex flex-col glass-card p-3 overflow-hidden">
          <div className="p-2 border-b border-white/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-lg">
                {showAllCompanies ? "All Companies (Aggregate)" : `Company: ${selectedCompany || "N/A"}`}
              </h2>
              <div className="text-sm text-gray-600">Companies: {companies.length}</div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="px-2 py-1 bg-white/60 rounded border">
                Copied: {copiedItem ? `${copiedItem.name} (${copiedItem.tag})` : "None"}
              </div>
              <div className="px-2 py-1 bg-white/60 rounded border">
                Undo stack: {undoStackRef.current.length}
              </div>
              <div className="px-2 py-1 bg-white/60 rounded border select-none">
                Shortcuts: Ctrl+C • Ctrl+V • Ctrl+Z
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto mt-3">
            <ItemManager
              items={showAllCompanies ? aggregatedItems : companies.find((c) => c.name === selectedCompany)?.items || []}
              selectedCompany={selectedCompany}
              onAddItem={addItem}
              onEditItem={editItem}
              onDeleteItem={deleteItem}
              setSelectedItemTag={setSelectedItemTag}
              selectedItemTag={selectedItemTag}
              companies={companies}
              showAllCompanies={showAllCompanies}

              // header triggers for add/edit
              externalOpenAdd={headerOpenAddItem}
              setExternalOpenAdd={setHeaderOpenAddItem}
              externalEditTag={headerEditItemTag}
              setExternalEditTag={setHeaderEditItemTag}
            />
          </div>
        </div>
      </div>

      <div className="p-2 text-xs bg-white/60 border-t border-white/30 flex justify-between glass-card-footer">
        <span>Data file: FASTtag</span>
        <span>
          {companies.length} companies, {aggregatedItems.length} total items
          {selectedCompany ? ` · Selected: ${selectedCompany}` : ""}
        </span>
      </div>

      {/* Tailwind utility classes for glass look (if you prefer you can put in your global CSS) */}
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(13, 22, 39, 0.06);
        }
        .glass-card-footer {
          background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(250,250,250,0.4));
          backdrop-filter: blur(6px);
        }
      `}</style>
    </div>
  );
}
