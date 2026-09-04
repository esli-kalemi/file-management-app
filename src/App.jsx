import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import { useState } from "react";

function App() {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="app-layout">
        <Sidebar
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
        />

        <main className="main-content">
          <Dashboard
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            searchTerm={searchTerm}
          />
        </main>
      </div>
    </>
  );
}

export default App;