// src/components/VolunteerTable.jsx
// Searchable, filterable table with CSV export and pagination
import { useState, useMemo } from "react";
import { Search, Download, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const AREAS = [
  "All Areas",
  "Child Education",
  "Women Empowerment",
  "Environment & Sustainability",
  "Healthcare & Wellness",
  "Rural Development",
  "Disaster Relief",
  "Digital Literacy",
  "Animal Welfare",
  "Senior Citizen Support",
  "Youth Development",
];

const PAGE_SIZE = 10;

function exportCSV(data) {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Skills",
    "Area of Interest",
    "Message",
    "Registered At",
  ];
  const rows = data.map((v) => [
    v.name,
    v.email,
    v.phone,
    (v.skills || []).join("; "),
    v.areaOfInterest,
    v.message || "",
    v.registeredAt?.toDate
      ? v.registeredAt.toDate().toLocaleString()
      : "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `nayepankh_volunteers_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function VolunteerTable({ volunteers }) {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("All Areas");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return volunteers.filter((v) => {
      const matchSearch =
        v.name?.toLowerCase().includes(search.toLowerCase()) ||
        v.email?.toLowerCase().includes(search.toLowerCase()) ||
        v.phone?.includes(search);
      const matchArea =
        areaFilter === "All Areas" || v.areaOfInterest === areaFilter;
      return matchSearch && matchArea;
    });
  }, [volunteers, search, areaFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleAreaFilter = (e) => {
    setAreaFilter(e.target.value);
    setPage(1);
  };

  return (
    <div className="table-wrapper">
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            id="volunteer-search"
            type="text"
            className="search-input"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="toolbar-right">
          <div className="filter-box">
            <Filter size={14} />
            <select
              id="area-filter"
              className="filter-select"
              value={areaFilter}
              onChange={handleAreaFilter}
            >
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <button
            id="export-csv-btn"
            className="btn btn-export"
            onClick={() => exportCSV(filtered)}
            disabled={filtered.length === 0}
            title="Export visible volunteers as CSV"
          >
            <Download size={15} />
            Export CSV ({filtered.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="vol-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Skills</th>
              <th>Area of Interest</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">
                  No volunteers found matching your filters.
                </td>
              </tr>
            ) : (
              paginated.map((v, idx) => (
                <tr key={v.id} className="vol-row">
                  <td className="row-num">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td className="name-cell">{v.name}</td>
                  <td className="email-cell">{v.email}</td>
                  <td>{v.phone}</td>
                  <td>
                    <div className="skill-tags">
                      {(v.skills || []).slice(0, 2).map((s) => (
                        <span key={s} className="skill-tag">
                          {s}
                        </span>
                      ))}
                      {(v.skills || []).length > 2 && (
                        <span className="skill-tag skill-tag-more">
                          +{v.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="area-badge">{v.areaOfInterest}</span>
                  </td>
                  <td className="date-cell">
                    {v.registeredAt?.toDate
                      ? v.registeredAt.toDate().toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span className="page-info">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </span>
        <div className="page-controls">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
            )
            .reduce((acc, p, i, arr) => {
              if (i > 0 && p - arr[i - 1] > 1)
                acc.push(<span key={`ellipsis-${p}`} className="page-ellipsis">…</span>);
              acc.push(
                <button
                  key={p}
                  className={`page-btn ${page === p ? "page-btn-active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
              return acc;
            }, [])}
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
