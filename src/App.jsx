import React, { useState } from "react";
import JsonInput, { sampleJson } from "./components/JsonInput";
import TreeVisualizer from "./components/treeVisualizer";
import SearchBar from "./components/SearchBar";
import "./App.css";

export default function App() {
  const [jsonData, setJsonData] = useState(() => {
    try {
      return JSON.parse(sampleJson);
    } catch (err) {
      console.error("Failed to parse initial JSON sample", err);
      return null;
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");
  const [matchStatus, setMatchStatus] = useState("");

  return (
    <div className={`app ${theme}`}>
      <div className="app-container">
        <header className="app-header">
          <h1>JSON Tree Visualizer</h1>
          <div className="theme-toggle">
            <span>Dark/Light</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={() => setTheme(theme === "light" ? "dark" : "light")}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </header>

        <div className="workspace">
          <JsonInput setJsonData={setJsonData} defaultValue={sampleJson} />
          <div className="visualizer-column">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            {searchQuery && (
              <div style={{ minHeight: 24, fontWeight: 500, fontSize: 15, margin: '4px 0 4px 0' }}>
                {matchStatus}
              </div>
            )}
            <TreeVisualizer
              jsonData={jsonData}
              searchQuery={searchQuery}
              setMatchStatus={setMatchStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
