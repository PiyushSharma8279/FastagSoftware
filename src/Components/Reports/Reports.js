import React from "react";
import jsPDF from "jspdf";

/* Utility: Export CSV */
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

/* Utility: Export PDF */
function downloadPDF(filename, rows) {
  const doc = new jsPDF();
  doc.setFontSize(12);

  let y = 10;

  // Header row
  doc.text("Companies Report", 10, y);
  y += 10;

  // Table headers
  const header = rows[0];
  doc.text(header.join(" | "), 10, y);
  y += 10;

  // Table rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].map((v) => String(v));
    doc.text(row.join(" | "), 10, y);
    y += 10;

    // Prevent writing outside page
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  }

  doc.save(filename);
}

export default function Reports({ selectedReport, companies = [], items = [] }) {

  /* --------------------- COMPANIES REPORT --------------------- */
  if (selectedReport === "companies") {
    const rows = [["ID", "Name", "Address", "Phone", "Email", "Items"]];
    companies.forEach((c) => {
      rows.push([
        c.id,
        `"${c.companyName}"`,
        `"${c.address || ""}"`,
        `"${c.phone || ""}"`,
        `"${c.email || ""}"`,
        (c.items || []).length,
      ]);
    });

    return (
      <div className="p-3 md:p-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Companies</h2>

          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm md:text-base"
              onClick={() => downloadCSV("companies.csv", rows)}
            >
              Export CSV
            </button>

            <button
              className="px-3 py-1.5 bg-red-600 text-white rounded text-sm md:text-base"
              onClick={() => downloadPDF("companies.pdf", rows)}
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded shadow p-3 overflow-x-auto">
          {companies.length === 0 ? (
            <div className="text-gray-500 text-sm md:text-base">No companies</div>
          ) : (
            <table className="w-full text-xs md:text-sm min-w-[700px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">CompanyName</th>
                  <th className="p-2 border">Address</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Items</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2 border text-center">{c.id}</td>
                    <td className="p-2 border break-words text-center">{c.companyName}</td>
                    <td className="p-2 border break-words text-center">{c.address}</td>
                    <td className="p-2 border text-center">{c.phone}</td>
                    <td className="p-2 border break-words text-center">{c.email}</td>
                    <td className="p-2 border text-center">{(c.items || []).length}</td>
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
    return (
      <div className="p-3 md:p-4">
        <h2 className="text-lg md:text-xl font-semibold mb-3">Inspection Report</h2>

        <div className="bg-white rounded shadow p-3 overflow-x-auto">
          {items.length === 0 ? (
            <div className="text-gray-500 text-sm md:text-base">No items to inspect</div>
          ) : (
            <table className="w-full text-xs md:text-sm min-w-[800px]">
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
                    <td className="p-2 border break-words">{it.description}</td>
                    <td className="p-2 border break-words">{it.company}</td>
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

  /* --------------------- NEW ITEM FORM --------------------- */
  if (selectedReport === "newitemform") {
    return (
      <div className="p-3 md:p-4">
        <h2 className="text-lg md:text-xl font-semibold mb-3">New Item Form</h2>

        <div className="bg-white rounded shadow p-4 text-xs md:text-sm overflow-auto">
          <p className="text-gray-600">
            This report contains a blank template for entering a new item.
          </p>

          <pre className="mt-3 bg-gray-50 p-3 rounded overflow-x-auto text-[10px] md:text-xs">
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

  /* --------------------- FAILED REPORT --------------------- */
  if (selectedReport === "failed") {
    const failed = items.filter(
      (it) => (it.testStatus || "").toLowerCase() === "failed"
    );

    return (
      <div className="p-3 md:p-4">
        <h2 className="text-lg md:text-xl font-semibold mb-3">Failed Equipment</h2>

        <div className="bg-white rounded shadow p-3 overflow-x-auto">
          {failed.length === 0 ? (
            <div className="text-gray-500 text-sm md:text-base">No failed equipment</div>
          ) : (
            <table className="w-full text-xs md:text-sm min-w-[600px]">
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
                    <td className="p-2 border break-words">{it.description}</td>
                    <td className="p-2 border break-words">{it.company}</td>
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

