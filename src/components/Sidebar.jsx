import "../styles/sidebar.css";

function Sidebar({ currentSection, setCurrentSection }) {
  return (
    <aside className="sidebar">

      <nav className="sidebar-nav">

        <button
        className={`sidebar-item ${
            currentSection === "dashboard" ? "active" : ""
        }`}
        onClick={() => setCurrentSection("dashboard")}
        >
          <span className="sidebar-icon">⌂</span>
          <span>Dashboard</span>
        </button>
        
        <a href="#" className="sidebar-item">
          <span className="sidebar-icon">📁</span>
          <span>My Files</span>
        </a>

        <a href="#" className="sidebar-item">
          <span className="sidebar-icon">★</span>
          <span>Favorites</span>
        </a>

        <button
            className={`sidebar-item ${
                currentSection === "trash" ? "active" : ""
            }`}
            onClick={() => setCurrentSection("trash")}
            >
            <span className="sidebar-icon">🗑</span>
            <span>Trash</span>
        </button>

      </nav>

      <div className="sidebar-storage">

        <h3>Storage</h3>

        <div className="storage-bar">
          <div className="storage-used"></div>
        </div>

        <p>7.2 GB of 10 GB used</p>

      </div>

    </aside>
  );
}

export default Sidebar;