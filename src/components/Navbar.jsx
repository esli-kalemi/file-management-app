import "../styles/navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        FileFlow
      </div>

      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search files and folders..."
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