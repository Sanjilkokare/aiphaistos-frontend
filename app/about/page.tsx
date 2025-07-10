"use client";

export default function AboutPage() {
  const screenshots = ["/screenshot1.png", "/screenshot2.png"];
  const pdfURL = "/AIPHAISTOS_Project_Enhanced_v3_cleaned.pdf";

  return (
    <main className="min-h-screen bg-black text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-400">📘 About AIPHAISTOS Project</h1>
      <p className="mb-4 text-gray-300 leading-relaxed">
        The <strong>AIPHAISTOS</strong> project is a cutting-edge multimodal QA system built to extract
        precise answers from architectural blueprints, industrial manuals, and multi-format technical documents.
        Our production system is capable of processing over <strong>50,000+</strong> documents with
        high-speed hybrid retrieval and deep reasoning.
      </p>

      <h2 className="text-xl text-green-400 font-semibold mb-2">📌 Core Features</h2>
      <ul className="list-disc ml-6 mb-6 text-gray-300">
        <li>Hybrid Retrieval (FAISS + BM25) for PDF, TXT, and OCR documents</li>
        <li>LayoutLMv3 integration for blueprint visual understanding</li>
        <li>FastAPI + Next.js frontend for seamless document Q&A</li>
        <li>Fallback reranking using LLMs like Zephyr</li>
        <li>Handles 50K+ document storage and semantic queries</li>
      </ul>

      <h2 className="text-xl text-yellow-300 font-semibold mb-2">📄 Project Plan PDF</h2>
      <iframe
        src={pdfURL}
        className="w-full h-[500px] mb-6 border border-gray-600 rounded"
        title="Project Plan PDF"
      />

      <h2 className="text-xl text-pink-400 font-semibold mb-2">🖼️ Implementation Screenshots</h2>
      <div className="space-y-4 mb-8">
        {screenshots.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Screenshot ${idx + 1}`}
            className="w-full border border-gray-600 rounded"
          />
        ))}
      </div>

      <h2 className="text-xl text-blue-300 font-semibold mb-2">👥 Credits</h2>
      <ul className="text-gray-300 leading-loose">
        <li><strong>Professor:</strong> Dr. Stefan Heineman</li>
        <li><strong>Student:</strong> Sanjil Kokare</li>
        <li><strong>Email:</strong> skokare.official@gmail.com</li>
        <li><strong>GitHub:</strong> <a href="https://github.com/Sanjilkokare" className="text-blue-400 underline">Sanjilkokare</a></li>
      </ul>
    </main>
  );
}
