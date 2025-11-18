// src/components/Reports/Reports.js
import React from "react";

/**
 * Reports component displays different report views.
 * selectedReport: "companies" | "inspection" | "newitemform" | "failed"
 * companies, items props passed in from parent
 */

function downloadCSV(filename, rows) {
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports({ selectedReport, companies = [], items = [] }) {
  if (selectedReport === "companies") {
    const rows = [["ID", "Name", "Address", "Phone", "Email", "Items"]];
    companies.forEach((c) => {
      rows.push([c.id, `"${c.name}"`, `"${c.address || ""}"`, `"${c.phone || ""}"`, `"${c.email || ""}"`, (c.items || []).length]);
    });

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Companies</h2>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => downloadCSV("companies.csv", rows)}>Export CSV</button>
        </div>

        <div className="bg-white rounded shadow p-3">
          {companies.length === 0 ? (
            <div className="text-gray-500">No companies</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Address</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Items</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2 border">{c.id}</td>
                    <td className="p-2 border">{c.name}</td>
                    <td className="p-2 border">{c.address}</td>
                    <td className="p-2 border">{c.phone}</td>
                    <td className="p-2 border">{c.email}</td>
                    <td className="p-2 border">{(c.items || []).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  if (selectedReport === "inspection") {
    // Simple inspection list (all items)
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Inspection Report</h2>
        <div className="bg-white rounded shadow p-3">
          {items.length === 0 ? (
            <div className="text-gray-500">No items to inspect</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Company</th>
                  <th className="p-2 border">Next Test</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="p-2 border">{it.id}</td>
                    <td className="p-2 border">{it.description}</td>
                    <td className="p-2 border">{it.company}</td>
                    <td className="p-2 border">{it.nextTestDate}</td>
                    <td className="p-2 border">{it.testStatus || "Unknown"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  if (selectedReport === "newitemform") {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">New Item Form</h2>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-600">This report contains a blank template for entering a new item. You can copy and paste into the Add Item modal or CSV export/import.</p>

          <pre className="mt-3 bg-gray-50 p-2 rounded text-xs">
{`{
  "id": 27,
  "description": "Lights",
  "location": "Haars Nursery",
  "serial": "1113",
  "nextTestDate": "2025-09-22",
  "equipmentType": "Class II - Double Insulated",
  "testerName": "Bobby",
  "identifier": "1112",
  "company": "Haars Nursery"
}`}
          </pre>
        </div>
      </div>
    );
  }

  if (selectedReport === "failed") {
    const failed = items.filter((it) => (it.testStatus || "").toLowerCase() === "failed");
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Failed Equipment</h2>
        <div className="bg-white rounded shadow p-3">
          {failed.length === 0 ? (
            <div className="text-gray-500">No failed equipment</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Company</th>
                  <th className="p-2 border">Identifier</th>
                </tr>
              </thead>
              <tbody>
                {failed.map((it) => (
                  <tr key={it.id}>
                    <td className="p-2 border">{it.id}</td>
                    <td className="p-2 border">{it.description}</td>
                    <td className="p-2 border">{it.company}</td>
                    <td className="p-2 border">{it.identifier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return <div className="p-4">Select a report</div>;
}
