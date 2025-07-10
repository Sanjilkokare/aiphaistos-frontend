// frontend/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [docs, setDocs] = useState<string[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [matchedContext, setMatchedContext] = useState("");
  const [matchedDoc, setMatchedDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/list_docs`);
      setDocs(res.data.docs || []);
    } catch (err) {
      console.error("Failed to fetch docs:", err);
    }
  };

  const uploadPDF = async () => {
    if (!pdfFile) return alert("Please select a file to upload.");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const res = await axios.post(`${API_BASE}/upload_pdf`, formData);
      const newDocId = res.data.doc_id;
      alert(`Uploaded: ${newDocId}`);
      setDocs((prev) => [...new Set([...prev, newDocId])]);
      setSelectedDoc(newDocId);
      setPdfFile(null);
    } catch (err: any) {
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return alert("Enter a question first.");
    setLoading(true);
    setAnswer("");
    setMatchedContext("");
    setMatchedDoc("");

    const payload = { question, doc_id: selectedDoc };
    const endpoint = selectedDoc ? "/ask" : "/ask_any";

    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, payload);
      setAnswer(res.data.answer || "No answer received.");
      setMatchedContext(res.data.context || "");
      setMatchedDoc(res.data.doc_id || "");
    } catch (err: any) {
      alert("Failed to get answer: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-3">📚 AIPHAISTOS QA Demo</h1>
        <Link href="/about">
          <button className="text-sm text-blue-400 underline hover:text-blue-600">View About</button>
        </Link>
      </div>
      <p className="text-gray-400 mb-6">
        This is a <strong>demo version</strong> of the real AIPHAISTOS Project. Our production system processes over <strong>50,000+ documents</strong> and can intelligently answer questions from architectural plans, manuals, and large PDF archives.
      </p>

      {/* Upload PDF */}
      <div className="mb-6">
        <label className="text-sm block mb-1">Upload PDF</label>
        <input
          type="file"
          accept="application/pdf"
          className="bg-gray-800 p-2 border border-gray-700 rounded w-full"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={uploadPDF}
          className={`mt-2 px-4 py-2 rounded text-white ${uploading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      {/* Ask Question */}
      <div className="mb-6">
        <label className="text-sm block mb-1">Ask a question</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="e.g. What is the total crane load capacity?"
          className="bg-gray-800 p-2 border border-gray-700 rounded w-full"
        />
        <label className="text-sm mt-3 block">Optional: Pick a specific document</label>
        <select
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
          className="bg-gray-800 p-2 border border-gray-700 rounded w-full"
        >
          <option value="">Search across all documents</option>
          {docs.map((doc) => (
            <option key={doc} value={doc}>{doc}</option>
          ))}
        </select>
        <button
          onClick={askQuestion}
          className={`mt-3 px-4 py-2 rounded text-white ${loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
          disabled={loading}
        >
          {loading ? "Searching..." : "Ask"}
        </button>
      </div>

      {answer && !loading && (
        <div className="bg-gray-900 border border-gray-700 p-4 rounded mb-6">
          <h2 className="text-green-400 font-semibold mb-2">Answer:</h2>
          <p className="whitespace-pre-wrap mb-4">{answer}</p>
          {matchedContext && (
            <>
              <h3 className="text-blue-400 text-sm mb-1">Matched Context:</h3>
              <p className="text-sm bg-gray-800 p-3 rounded border border-gray-600 whitespace-pre-wrap">
                {matchedContext}
              </p>
            </>
          )}
        </div>
      )}

      {matchedDoc && (
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Matched Document:</p>
          <iframe
            src={`${API_BASE}/static/${matchedDoc}.pdf`}
            className="w-full h-96 border border-gray-700 rounded"
            title="PDF Preview"
          />
        </div>
      )}
    </main>
  );
}
