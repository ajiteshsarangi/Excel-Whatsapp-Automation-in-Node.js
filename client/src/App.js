import React, { useState, useMemo, useEffect } from "react";
import "./App.css";
import axios from "axios";
import data from "./data.json";
import * as XLSX from "xlsx";
var QRCode = require("qrcode.react");

const App = () => {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(["0"]);
  const [msg, setMessage] = useState(
    "Hi, This is a computer generated message. Please do not reply."
  );
  const [qrcode, setQRCode] = useState(false);
  const [items, setItems] = useState([]);
  //  -----------------------
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
    });
  };
  // ------------------------
  const getQRCode = async () => {
    setLoading(true);
    const res = await axios.post("/api", { phone, msg });
    setQRCode(res.data);
    setLoading(false);
  };
  useEffect(() => {
    items.map((e) => {
      phone.push(`${e.Phone}`);
    });
  }, [items]);

  console.log(phone);
  console.log(msg);
  return (
    <div>
      <div>
        <label htmlFor="files" class="drop-container">
          <span class="drop-title">Drop files here</span>
          or
          <input
            id="files"
            type="file"
            accept="file/*"
            required
            onChange={(e) => {
              const file = e.target.files[0];
              readExcel(file);
            }}
          />
        </label>
      </div>
      {/* Phone Number:
      <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      Message:
      <input value={msg} onChange={(e) => setMessage(e.target.value)} /> */}

      <button onClick={getQRCode} class="button-9" role="button">
        Get QRCode
      </button>
      {!loading && qrcode && (
        <div>
          <QRCode
            value={qrcode}
            style={{
              height: "200px",
              width: "200px",
              display: "flex",
              alignItems: "center",
              margin: "auto",
            }}
          />
        </div>
      )}
      <div
        style={{
          textAlign: "center",
          margin: "auto",
        }}
      >
        {loading && "Waiting for QRCode..."}
      </div>
    </div>
  );
};

export default App;
