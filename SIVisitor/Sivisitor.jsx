import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Sivisitor.css";
import Landingsec from "./Landingsec";
import BukuTamu from "./TestBukuTamu";

const VISITOR_MENU = [
    { menu: "Aproval-Tamu", icon: "bi-people" },
    { menu: "Buku-Tamu", icon: "bi-bar-chart" },
    {
        menu: "Berita-Acara",
        icon: "bi-journal-text",
        children: [
            { menu: "Buat-Berita", icon: "bi-plus-circle" },
            { menu: "List-Berita", icon: "bi-list-check" },
            { menu: "BA-To-Aprove", icon: "bi-list-check" },
        ],
    },
];

const COMPONENT_MAP = {
    "Aproval-Tamu": Landingsec,
    "Buku-Tamu": BukuTamu,
    "Buat-Berita": Landingsec,
    "List-Berita": Landingsec,
    "BA-To-Aprove": Landingsec,
};

export default function Sivisitor() {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);

    const ActiveComponent = COMPONENT_MAP[activeMenu] || null;
    const toggleSidebar = () => setIsOpen(prev => !prev);
    const closeSidebar = () => setIsOpen(false);

    const toggleSubmenu = (menuName) => {
        setOpenSubmenu(prev => (prev === menuName ? null : menuName));
    };

    return (
        <div className="layout-visitor">

            {/* Overlay */}
            <div
                className={`overlay ${isOpen ? "active" : ""}`}
                onClick={closeSidebar}
            />

            {/* Sidebar */}
            <aside className={`sidebar-visitor ${isOpen ? "open" : ""}`}>
                <h2 className="logo">VSITOR</h2>

                <nav>
                    <ul className="menu">
                        {VISITOR_MENU.map((item, index) => {
                            const isParentActive =
                                activeMenu === item.menu ||
                                item.children?.some(sub => sub.menu === activeMenu);

                            return (
                                <li key={index}>

                                    {/* MAIN MENU */}
                                    <div
                                        className={`menu-item ${isParentActive ? "active" : ""}`}
                                        onClick={() => {
                                            if (item.children) {
                                                toggleSubmenu(item.menu);
                                            } else {
                                                setActiveMenu(item.menu);
                                                closeSidebar();
                                            }
                                        }}
                                    >
                                        <div className="menu-left">
                                            <i className={`bi ${item.icon}`}></i>
                                            <span>{item.menu}</span>
                                        </div>

                                        {item.children && (
                                            <i
                                                className={`bi ${openSubmenu === item.menu
                                                    ? "bi-chevron-up"
                                                    : "bi-chevron-down"
                                                    }`}
                                            ></i>
                                        )}
                                    </div>

                                    {/* SUBMENU */}
                                    {item.children && (
                                        <ul
                                            className={`submenu ${openSubmenu === item.menu ? "open" : ""
                                                }`}
                                        >
                                            {item.children.map((sub, subIndex) => (
                                                <li
                                                    key={subIndex}
                                                    className={`submenu-item ${activeMenu === sub.menu ? "active-sub" : ""
                                                        }`}
                                                    onClick={() => {
                                                        setActiveMenu(sub.menu);
                                                        closeSidebar();
                                                    }}
                                                >
                                                    <i className={`bi ${sub.icon}`}></i>
                                                    <span>{sub.menu}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main */}
            <main className="main-visitor">
                <header className="header-visitor">
                    <button className="hamburger" onClick={toggleSidebar}>
                        <i className="bi bi-list"></i>
                    </button>
                    <h1>{activeMenu || "Welcome"}</h1>
                </header>

                <div className="content-visitor">
                    {ActiveComponent && <ActiveComponent />}
                </div>
            </main>
        </div>
    );
}