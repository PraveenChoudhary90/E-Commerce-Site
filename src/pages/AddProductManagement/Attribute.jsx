
import React, { useEffect, useState } from "react";
import {
  createAttribute,
  deleteAttribute,
  getAllAttributes,
  updateAttribute,
} from "../../api/product-management-api"; 


const styles = {
  card: {
    maxWidth: 900,
    margin: "24px auto",
    padding: 18,
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(12, 20, 30, 0.08)",
    background: "linear-gradient(180deg,#ffffff,#fbfdff)",
    fontFamily: "Inter, Roboto, system-ui, -apple-system, sans-serif",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  formRow: { display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 12 },
  field: { flex: 1, position: "relative" },
  floatingLabelInput: {
    width: "100%",
    padding: "14px 12px 12px 12px",
    borderRadius: 8,
    border: "1px solid #e6eef6",
    outline: "none",
    fontSize: 14,
  },
  label: {
    position: "absolute",
    left: 12,
    top: 8,
    fontSize: 12,
    color: "#62748a",
    pointerEvents: "none",
  },
  smallButton: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
  addBtn: { background: "#0b69ff", color: "white" },
  cancelBtn: { background: "#f3f4f6", color: "#333" },
  dangerBtn: { background: "#ff4d4f", color: "white" },
  chip: {
    display: "inline-flex",
    gap: 8,
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #e6eef6",
    background: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  listRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 8px",
    borderBottom: "1px solid #f1f5f9",
  },
  treeParent: { cursor: "pointer", display: "flex", gap: 8, alignItems: "center" },
};

const Attribute = () => {
  const [attributes, setAttributes] = useState([]);
  const [parentName, setParentName] = useState("");
  const [childInputs, setChildInputs] = useState([""]); 
  const [parentSelectId, setParentSelectId] = useState(""); 
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", kind: "" }); 
  const [expandedParents, setExpandedParents] = useState({}); 

  
  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    setLoading(true);
    try {
      const data = await getAllAttributes();
      
      setAttributes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to load attributes", kind: "error" });
    } finally {
      setLoading(false);
    }
  };

  
  const resetForm = () => {
    setParentName("");
    setChildInputs([""]);
    setParentSelectId("");
    setEditingId(null);
    setMessage({ text: "", kind: "" });
  };

  
  const checkLocalDuplicates = () => {
    const trimmedParent = parentName.trim();
    const childTrimmed = childInputs.map((c) => c.trim()).filter(Boolean);

    
    const dupChild = childTrimmed.some((c, i) => childTrimmed.indexOf(c) !== i);
    if (dupChild) return { ok: false, msg: "Duplicate names found among children." };

    
    if (trimmedParent && childTrimmed.includes(trimmedParent)) {
      return { ok: false, msg: "One of the children has same name as parent." };
    }

    
    const allNames = attributes.map((a) => a.name.toLowerCase());
    if (!editingId && trimmedParent && allNames.includes(trimmedParent.toLowerCase())) {
      return { ok: false, msg: "An attribute with this parent name already exists." };
    }

    
    const existingChildConflicts = childTrimmed.filter((c) =>
      allNames.includes(c.toLowerCase())
    );
    if (existingChildConflicts.length) {
      return {
        ok: true,
        warn: true,
        msg:
          "Note: Some child names already exist globally: " +
          existingChildConflicts.join(", "),
      };
    }

    return { ok: true };
  };

  
 const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage({ text: "", kind: "" });

  const trimmedParent = parentName.trim();
  const childTrimmed = childInputs.map((c) => c.trim()).filter(Boolean);
  const targetParentId = parentSelectId || null;

  // Validation
  if (!trimmedParent && childTrimmed.length === 0) {
    setMessage({ text: "Provide a parent name or at least one child.", kind: "error" });
    return;
  }

  // Duplicate children in form
  const dupChild = childTrimmed.some((c, i) => childTrimmed.indexOf(c) !== i);
  if (dupChild) {
    setMessage({ text: "Duplicate names found among children in form.", kind: "error" });
    return;
  }

  // Child same as parent
  if (trimmedParent && childTrimmed.includes(trimmedParent)) {
    setMessage({ text: "One of the children has same name as parent.", kind: "error" });
    return;
  }

  // Parent global uniqueness
  const existingParents = attributes.filter((a) => !a.parentAttribute);
  if (!editingId && trimmedParent && existingParents.some((p) => p.name.toLowerCase() === trimmedParent.toLowerCase())) {
    setMessage({ text: "A parent with this name already exists.", kind: "error" });
    return;
  }

  // Children uniqueness under same parent
  const childrenUnderParent = attributes.filter(
    (a) => (a.parentAttribute?._id || a.parentAttribute || null) === targetParentId
  );
  const childConflicts = childTrimmed.filter((c) =>
    childrenUnderParent.some((child) => child.name.toLowerCase() === c.toLowerCase())
  );
  if (childConflicts.length) {
    setMessage({ text: "Child name(s) already exist under this parent: " + childConflicts.join(", "), kind: "error" });
    return;
  }

  setLoading(true);
  try {
    // EDITING EXISTING ATTRIBUTE
    if (editingId) {
      await updateAttribute(editingId, { name: trimmedParent });
      setMessage({ text: "Attribute updated", kind: "success" });
      await loadAttributes();
      resetForm();
      return;
    }

    // CREATE PARENT
    let createdParentId = null;
    if (trimmedParent) {
      const created = await createAttribute({ name: trimmedParent });
      createdParentId = created?._id;
    }

    // FINAL PARENT ID for children
    const finalParentId = createdParentId || targetParentId || null;

    // CREATE CHILDREN
    for (const cname of childTrimmed) {
      await createAttribute({
        name: cname,
        parentAttribute: finalParentId || undefined,
      });
    }

    setMessage({ text: "Created successfully", kind: "success" });
    await loadAttributes();
    resetForm();
  } catch (err) {
    console.error(err);
    const errMsg = err?.response?.data?.message || err?.message || "Save failed";
    setMessage({ text: errMsg, kind: "error" });
  } finally {
    setLoading(false);
  }
};
 
  const handleEdit = (attr) => {
    setEditingId(attr._id);
    setParentName(attr.name || "");
    setChildInputs([""]);
    setParentSelectId("");
    setMessage({ text: "Editing mode: update the name & click Update", kind: "info" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attribute? This will detach or reset its children.")) return;
    setLoading(true);
    try {
      await deleteAttribute(id);
      setMessage({ text: "Deleted", kind: "success" });
      await loadAttributes();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Delete failed", kind: "error" });
    } finally {
      setLoading(false);
    }
  };

  
  const addChildInput = () => setChildInputs((s) => [...s, ""]);
  const removeChildInput = (idx) => setChildInputs((s) => s.filter((_, i) => i !== idx));
  const setChildValue = (idx, value) => setChildInputs((s) => s.map((v, i) => (i === idx ? value : v)));

  
  const buildTree = () => {
    const map = {};
    attributes.forEach((a) => {
      map[a._id] = { ...a, childrenArr: [] };
    });
    attributes.forEach((a) => {
      const pid = a.parentAttribute ? a.parentAttribute._id || a.parentAttribute : null;
      if (pid && map[pid]) {
        map[pid].childrenArr.push(map[a._id]);
      }
    });
    
    return Object.values(map).filter((n) => !n.parentAttribute);
  };

  const toggleExpand = (id) => setExpandedParents((s) => ({ ...s, [id]: !s[id] }));

  
  const roots = buildTree();

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}>Attributes </h3>
        <div style={{ color: "#6b7280", fontSize: 13 }}>{loading ? "Loading..." : "Ready"}</div>
      </div>

      
      <form onSubmit={handleSubmit} style={{ marginTop: 14 }}>
        <div style={styles.formRow}>
          <div style={styles.field}>
            <label style={{ ...styles.label }}>Parent / Attribute name</label>
            <input
              style={styles.floatingLabelInput}
              placeholder=""
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
            />
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
              If creating a parent, fill this. Leave empty to only create children.
            </div>
          </div>

          <div style={{ width: 220 }}>
            <label style={{ ...styles.label }}>Or choose existing parent</label>
            <select
              value={parentSelectId}
              onChange={(e) => setParentSelectId(e.target.value)}
              style={{ ...styles.floatingLabelInput, paddingTop: 12 }}
            >
              <option value="">-- Use existing parent (optional) --</option>
              {attributes.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8, fontSize: 13, color: "#374151" }}>Child attributes</div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
           
            {childInputs.map((c, idx) => (
              <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  value={c}
                  onChange={(e) => setChildValue(idx, e.target.value)}
                  placeholder={`Child ${idx + 1}`}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #e6eef6",
                    minWidth: 180,
                  }}
                />
                <button
                  type="button"
                  title="Remove child"
                  onClick={() => removeChildInput(idx)}
                  style={{
                    ...styles.smallButton,
                    background: "#fff",
                    border: "1px solid #eee",
                  }}
                >
                  −
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addChildInput}
              style={{ ...styles.smallButton, ...styles.addBtn }}
            >
              + Add child
            </button>
          </div>

          <div style={{ marginTop: 8, fontSize: 12, color: "#94a3b8" }}>
            Tip: you can create a parent and several children in one go.
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.smallButton, ...styles.addBtn }}
          >
            {editingId ? "Update" : "Create"}
          </button>

          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              style={{ ...styles.smallButton, ...styles.cancelBtn }}
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                
                setParentName("");
                setChildInputs([""]);
                setParentSelectId("");
                setMessage({ text: "", kind: "" });
              }}
              style={{ ...styles.smallButton, ...styles.cancelBtn }}
            >
              Clear
            </button>
          )}
        </div>

        {message.text && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background:
                message.kind === "success"
                  ? "#ECFDF5"
                  : message.kind === "error"
                  ? "#FEF2F2"
                  : "#F8FAFC",
              color: message.kind === "error" ? "#991B1B" : "#064E3B",
            }}
          >
            {message.text}
          </div>
        )}
      </form>

      {/* LIST / TREE */}
      <div style={{ marginTop: 20 }}>
        <h4 style={{ marginBottom: 8 }}>Attributes</h4>

        {attributes.length === 0 ? (
          <div style={{ color: "#64748b" }}>No attributes yet.</div>
        ) : (
          <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #eef2f7" }}>
            {roots.map((p) => (
              <div key={p._id}>
                <div style={styles.listRow}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div
                      onClick={() => toggleExpand(p._id)}
                      title="Expand / Collapse"
                      style={styles.treeParent}
                    >
                      <div style={{ width: 20, textAlign: "center" }}>
                        {p.childrenArr?.length ? (expandedParents[p._id] ? "▾" : "▸") : "•"}
                      </div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ color: "#94a3b8", fontSize: 13 }}>
                        {p.childrenArr?.length ? `(${p.childrenArr.length})` : ""}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleEdit(p)}
                      style={{ ...styles.smallButton, background: "#fff", border: "1px solid #e6eef6" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      style={{ ...styles.smallButton, ...styles.dangerBtn }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* children list (collapsible) */}
                {expandedParents[p._id] && p.childrenArr && p.childrenArr.length > 0 && (
                  <div style={{ paddingLeft: 36, background: "#fbfdff" }}>
                    {p.childrenArr.map((c) => (
                      <div key={c._id} style={{ ...styles.listRow, paddingLeft: 8 }}>
                        <div style={{ color: "#334155" }}>— {c.name}</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => handleEdit(c)}
                            style={{ ...styles.smallButton, background: "#fff", border: "1px solid #e6eef6" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            style={{ ...styles.smallButton, ...styles.dangerBtn }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attribute;
