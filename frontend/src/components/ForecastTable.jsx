import React, { useState } from "react";
import axios from "axios";

const ForecastTable = () => {
  const [vendorId, setVendorId] = useState("");
  const [forecastData, setForecastData] = useState([]);

  const handleFetchForecast = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/forecast-all/${vendorId}`);
      setForecastData(res.data.result.forecasts || []);
    } catch (error) {
      console.error("Error fetching forecast:", error);
      setForecastData([]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">📈 View Tomorrow’s Forecast</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Vendor ID"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleFetchForecast}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Get Forecast
        </button>
      </div>

      {forecastData.length > 0 ? (
        <table className="w-full text-left border-t border-gray-200">
          <thead>
            <tr className="text-sm font-semibold">
              <th className="py-2">Item ID</th>
              <th className="py-2">Date</th>
              <th className="py-2">Predicted Qty</th>
            </tr>
          </thead>
          <tbody>
            {forecastData.map((item, index) => (
              <tr key={index} className="border-t text-sm">
                <td className="py-2">{item.item_id}</td>
                <td className="py-2">{item.date}</td>
                <td className="py-2">{item.predicted_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 mt-2">No forecast yet. Enter vendor ID above.</p>
      )}
    </div>
  );
};

export default ForecastTable;
