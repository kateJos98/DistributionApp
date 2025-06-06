import { Link } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ menu }) {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ width: "250px", backgroundColor: "#1E1E2F", color: "#fff", height: "100vh", padding: "10px" }}>
      <h2 style={{ textAlign: "center" }}>Dashboard</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {menu.map((item, index) => (
          <li key={index}>
            <div
              onClick={() => setOpen(open === index ? null : index)}
              style={{ cursor: "pointer", padding: "10px", fontWeight: "bold" }}
            >
              {item.label}
            </div>
            {item.submenu && open === index && (
              <ul style={{ paddingLeft: "15px" }}>
                {item.submenu.map((sub, i) => (
                  <li key={i}>
                    <Link to={`/${item.label.toLowerCase().replace(/\s/g, "-")}/${sub.toLowerCase()}`} style={{ color: "#bbb", textDecoration: "none" }}>
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {!item.submenu && (
              <Link to={`/${item.label.toLowerCase().replace(/\s/g, "-")}`} style={{ color: "#bbb", textDecoration: "none", display: "block", paddingLeft: "10px" }}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
