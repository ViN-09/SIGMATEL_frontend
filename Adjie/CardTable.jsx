import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

/**
 * @param {string} title 
 * @param {Array<Object>} data
 * @param {Array<string>} columns
 * @param {function} onDelete
 * @param {function} onUpdate
 */

export function TableDapot({ title, data = [], columns, onEdit, onAdd, onDelete, hideColumns = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [contextMenu, setContextMenu] = useState(null);

  // HANDLE DATA KOSONG
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ padding: 10, textAlign: "center" }}>
        <p className="text-muted">Data kosong atau tidak valid.</p>
      </div>
    );
  }

  // DETEKSI KOLOM DARI DATA
  const detectedCols = new Set();
  data.forEach((row) => {
    if (row && typeof row === "object") {
      Object.keys(row).forEach((key) => detectedCols.add(key));
    }
  });

  let cols = columns?.length ? columns : Array.from(detectedCols);
  cols = cols.filter(col => !hideColumns.includes(col));

  if (cols.length === 0) {
    return (
      <div style={{ padding: 10, textAlign: "center" }}>
        <p className="text-muted">Tidak ada kolom untuk ditampilkan.</p>
      </div>
    );
  }

  // MODAL DETAIL
  const handleShow = (value) => {
    setModalContent(value);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  // CONTEXT MENU
  const handleContextMenu = (e, row) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      row: row || null,
    });
  };

  const handleEmptyAreaContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      row: null,
    });
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleEdit = () => {
    if (onEdit && contextMenu?.row) {
      onEdit(contextMenu.row);
    }
    setContextMenu(null);
  };

  const handleAdd = () => {
    if (onAdd) onAdd();
    setContextMenu(null);
  };

  const handleDelete = () => {
    if (onDelete && contextMenu?.row) {
      onDelete(contextMenu.row);
    } else if (contextMenu?.row) {
      if (window.confirm("Yakin hapus data ini?")) {
        alert("Deleted ID: " + contextMenu.row?.id ?? "N/A");
      }
    }
    setContextMenu(null);
  };

  return (
    <>
      <div
        style={{ width: "100%", overflowX: "auto" }}
        className="plain-table-crud"
        onContextMenu={handleEmptyAreaContextMenu}
      >
        {title && <h5 className="mb-3">{title}</h5>}

        <table style={{ borderRadius: "12px", overflow: "hidden" }}>
          <thead
            className="table-light"
            style={{
              backgroundColor: "var(--accent--primary)",
              color: "black",
            }}
          >
            <tr>
              {cols.map((key) => (
                <th key={key} style={{ textTransform: "capitalize", fontWeight: "600" }}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row?.id || idx}
                id={row?.id || ""}
                onContextMenu={(e) => handleContextMenu(e, row)}
                style={{ cursor: "context-menu" }}
              >
                {cols.map((key) => (
                  <td
                    key={key}
                    style={{
                      borderBottom: "1px solid #ececec",
                      padding: "8px 12px",
                      fontSize: "13px",
                      verticalAlign: "middle",
                    }}
                    onDoubleClick={() => onEdit && row && onEdit(row)}
                  >
                    {["List_NE", "listNE", "Address"].includes(key) && row?.[key] ? (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleShow(row[key])}
                        title="Lihat Detail"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    ) : (
                      String(row?.[key] ?? "-")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONTEXT MENU */}
      {contextMenu &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              top: contextMenu.y,
              left: contextMenu.x,
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              zIndex: 3000,
              overflow: "hidden",
              animation: "fadeInScale 0.15s ease",
            }}
          >
            {contextMenu.row ? (
              <>
                <div onClick={handleEdit} style={menuStyle("#333")}>
                  ✏️ Edit
                </div>
                <div onClick={handleAdd} style={menuStyle("#28a745")}>
                  ➕ Add New
                </div>
                <div onClick={handleDelete} style={menuStyle("crimson")}>
                  🗑️ Delete
                </div>
              </>
            ) : (
              <div onClick={handleAdd} style={menuStyle("#28a745")}>
                ➕ Add New
              </div>
            )}
          </div>,
          document.body
        )}

      {/* MODAL */}
      {showModal &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.25)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeInBg 0.25s ease",
            }}
            onClick={handleClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                borderRadius: "18px",
                width: "min(90%, 700px)",
                overflow: "hidden",
                animation: "fadeInScale 0.3s ease",
              }}
            >
              <div style={{
                background: "var(--accent--primary)",
                color: "white",
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
              }}>
                <span>Detail List_NE</span>
                <button className="btn-close" style={{ filter: "invert(1)" }} onClick={handleClose}></button>
              </div>

              <div style={{
                padding: "20px",
                maxHeight: "65vh",
                overflowY: "auto",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
              }}>
                {modalContent}
              </div>

              <div style={{ padding: "10px 20px", textAlign: "right" }}>
                <button
                  className="btn"
                  onClick={handleClose}
                  style={{
                    backgroundColor: "var(--accent--primary)",
                    color: "white",
                    borderRadius: "10px",
                    padding: "6px 16px",
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

const menuStyle = (color) => ({
  padding: "8px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
  color: color,
  transition: "background 0.2s",
  onMouseEnter: (e) => (e.currentTarget.style.background = "#f0f0f0"),
  onMouseLeave: (e) => (e.currentTarget.style.background = "white"),
});


