import "../styles/navbar.css";

function Navbar({ searchTerm, setSearchTerm }) {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        FileFlow
      </div>

      <div className="navbar-search">
        <input
            type="text"
            placeholder="Search files and folders..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="navbar-user">
        <div className="user-avatar">
          U
        </div>

        <span className="user-name">
          User
        </span>
      </div>
    </header>
  );
}

export default Navbar;