import { useState } from "react";
import axios from "axios";

function SalesInput() {
  const [vendorId, setVendorId] = useState("");
  const [input, setInput] = useState("");
  const [parsedItems, setParsedItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/parse-log", {
        text: input,
      });
      setParsedItems(response.data.parsed_items);
    } catch (error) {
      console.error("Error parsing log:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!vendorId || !parsedItems || parsedItems.length === 0) {
      alert("Vendor ID and parsed items are required.");
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post("http://localhost:8000/save-parsed-log", {
        vendorId: Number(vendorId),
        items: parsedItems.map(item => ({
    item: item.name || item.item,  // normalize key
    quantity: item.quantity
  }))
      });
      alert("Sales log saved successfully!");
    } catch (error) {
      console.error("Error saving parsed log:", error);
      alert("Failed to save log.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">📝 Log Today’s Sales</h2>

      <label className="block mb-1 font-medium">Vendor ID:</label>
      <input
        type="number"
        value={vendorId}
        onChange={(e) => setVendorId(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
        placeholder="Enter your Vendor ID"
      />

      <textarea
        className="w-full p-3 border border-gray-300 rounded resize-none"
        rows="4"
        placeholder='e.g. "Sold 5 bananas and 3 apples"'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mt-4"
      >
        {loading ? "Parsing..." : "Parse Sales Log"}
      </button>

      {parsedItems && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Parsed Items:</h3>
          <ul className="list-disc pl-5">
            {parsedItems.map((item, index) => (
              <li key={index}>
                <strong>{item.name || item.item || item.item_name}</strong>: {item.quantity}
              </li>
            ))}
          </ul>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            {saving ? "Saving..." : "Save Parsed Log"}
          </button>
        </div>
      )}
    </div>
  );
}

export default SalesInput;
