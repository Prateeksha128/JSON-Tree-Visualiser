import React, { useEffect, useState } from "react";
import { sampleJson } from "../constant";


function JsonInput({ setJsonData, defaultValue = sampleJson }) {
    const [input, setInput] = useState(defaultValue);
    const [error, setError] = useState("");

    useEffect(() => {
        try {
            const parsed = JSON.parse(defaultValue);
            setJsonData(parsed);
            setError("");
        } catch (err) {
            console.error("Failed to parse default JSON", err);
        }
    }, [defaultValue, setJsonData]);

    const handleVisualize = () => {
        try {
            const parsed = JSON.parse(input);
            setError("");
            setJsonData(parsed);
        } catch (error) {
            setError(`Invalid JSON: ${error.message}`);
        }
    };

    return (
        <section className="json-input">
            <label className="json-input__label" htmlFor="json-editor">
                Paste or type JSON data
            </label>
            <textarea
                id="json-editor"
                className="json-input__textarea"
                value={input}
                spellCheck={false}
                onChange={(e) => setInput(e.target.value)}
            />
            <button className="primary-btn" onClick={handleVisualize}>
                Generate Tree
            </button>
            {error && <p className="json-input__error">{error}</p>}
        </section>
    );
}

export default JsonInput;
