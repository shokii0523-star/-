import React, { useState, useEffect } from "react";

import { Html5QrcodeScanner } from "html5-qrcode";

export default function InventoryApp() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  });

  const [tab, setTab] = useState("active");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", expiry: "", location: "", done: false });
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!form.name) return;
    setItems([...items, { ...form, id: Date.now() }]);
    setForm({ name: "", expiry: "", location: "", done: false });
  };

  const toggleDone = (id) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const today = new Date();
  const getColor = (expiry) => {
    if (!expiry) return "";
    const diff = (new Date(expiry) - today) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "bg-red-200";
    if (diff <= 3) return "bg-red-100";
    if (diff <= 7) return "bg-yellow-100";
    return "bg-green-100";
  };

  const filtered = items
    .filter((i) => (tab === "active" ? !i.done : i.done))
    .filter((i) => i.name.includes(search));

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <input
        className="p-2 border rounded-xl w-full shadow"
        placeholder="検索（商品名）"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 gap-3 p-4 rounded-2xl shadow">
        {scanning && (
          <div id="scanner" className="w-full"></div>
        )}
        <button
          className="p-2 rounded-xl border"
          onClick={() => {
            setScanning(true);
            const scanner = new Html5QrcodeScanner(
              "scanner",
              { fps: 10, qrbox: 250 },
              false
            );
            scanner.render((text) => {
              setForm({ ...form, name: text });
              setScanning(false);
              scanner.clear();
            });
          }}
        >バーコード読み取り</button>
        <input
          className="p-2 border rounded-xl"
          placeholder="商品名"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="p-2 border rounded-xl"
          type="date"
          value={form.expiry}
          onChange={(e) => setForm({ ...form, expiry: e.target.value })}
        />
        <input
          className="p-2 border rounded-xl"
          placeholder="保管場所"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <button className="p-2 rounded-xl shadow" onClick={addItem}>追加</button>
      </div>

      <div className="flex gap-4">
        <button className={`p-2 px-4 rounded-xl ${tab === "active" ? "shadow" : "border"}`} onClick={() => setTab("active")}>未</button>
        <button className={`p-2 px-4 rounded-xl ${tab === "done" ? "shadow" : "border"}`} onClick={() => setTab("done")}>済</button>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className={`p-4 rounded-2xl shadow flex justify-between items-center ${getColor(item.expiry)}`}>
            <div>
              <p className="font-semibold">{item.name}</p>
              <p>賞味期限: {item.expiry || "未入力"}</p>
              <p>保管場所: {item.location}</p>
            </div>
            <button
              className="p-2 rounded-xl border"
              onClick={() => toggleDone(item.id)}
            >
              {item.done ? "済" : "未"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

