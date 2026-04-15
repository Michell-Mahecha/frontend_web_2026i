"use client";

import { useState, useEffect } from "react";

const API_KEY = "NiQAm9c6CJKtNRy5BHcdcDda5kyvj0TdwnhXvK8Q";
const BASE_URL = "https://api.nasa.gov/planetary/apod";


function RadioButton({ id, name, value, label, checked, onChange }) {
  return (
    <label htmlFor={id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
      <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
function ApodCard({ item }) {
  const isVideo = item.media_type === "video";
  return (
    <div>
      <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.2rem" }}>{item.title}</h2>
      <p style={{ fontSize: "0.85rem", color: "#555", margin: "0 0 1rem" }}>{item.date}</p>

      {isVideo ? (
        <p style={{ margin: "0 0 1rem" }}>
          <a href={item.url} target="_blank" rel="noopener noreferrer"
            style={{ color: "#0070f3", textDecoration: "underline" }}>
            Abrir video en una nueva pestaña
          </a>
        </p>
      ) : (
        <img src={item.hdurl || item.url} alt={item.title}
          style={{ width: "100%", maxHeight: 480, objectFit: "cover", borderRadius: 8, display: "block", marginBottom: "1rem" }}
        />
      )}

      <p style={{ fontSize: "0.93rem", lineHeight: 1.7, color: "#222", margin: 0 }}>{item.explanation}</p>
      {item.copyright && (
        <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.6rem", textAlign: "right" }}>© {item.copyright}</p>
      )}
    </div>
  );
}
export default function Home() {
  const [mode, setMode] = useState("today");
  const [date, setDate] = useState("");
  const [count, setCount] = useState(3);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function buildUrl() {
    const params = new URLSearchParams({ api_key: API_KEY });
    if (mode === "date" && date) params.append("date", date);
    else if (mode === "count") params.append("count", count);
    return `${BASE_URL}?${params.toString()}`;
  }

  useEffect(() => {
    if (mode === "today") {
      fetchApod();
    }
  }, [mode]);

  async function fetchApod() {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(buildUrl());
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || `Error ${res.status}`);
      }
      const data = await res.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message || "Error al consultar la API.");
    } finally {
      setLoading(false);
    }
  }
}