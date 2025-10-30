import React, { useState } from "react";
import "./App.css";
import { sampleJson } from "./constant";
import FlowTreeView from "./components/FlowTreeView";
import QuerySearchBar from "./components/QuerySearchBar";
import JsonDataInput from "./components/JsonDataInput";

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
          <JsonDataInput setJsonData={setJsonData} defaultValue={sampleJson} />
          <div className="visualizer-column">
            <QuerySearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            {searchQuery && (
              <div
                style={{
                  minHeight: 24,
                  fontWeight: 500,
                  fontSize: 15,
                  margin: "4px 0 4px 0",
                }}
              >
                {matchStatus}
              </div>
            )}
            <FlowTreeView
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
