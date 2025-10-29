import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [stateData, setStateData] = useState([]);

  async function fetchStates() {
    const {
      data: {
        data: { states },
      },
    } = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        country: "India",
      }
    );
    setStates(states);
  }

  async function fetchSelectedStateData(state) {
    const { data } = await axios.get(
      `https://mgnrega-backend-twfc.onrender.com/data/${state}`
    );
    setStateData(data);
  }

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchSelectedStateData(selectedState);
    }
  }, [selectedState]);

  return (
    <div>
      <h1 className="text-blue-500 text-xs font-extrabold md:text-xl lg:text-2xl text-center mx-auto my-2">
        Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)
      </h1>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 p-4 bg-gray-50 rounded-2xl shadow-md mx-4 my-6">
        <label
          htmlFor="district"
          className="text-sm sm:text-base font-semibold text-gray-700"
        >
          Select State:
        </label>

        <select
          name="selectDistrict"
          id="district"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
        >
          <option value="">Please Select</option>
          {states.map((state) => (
            <option value={state.name} key={state.name}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="p-6">
        {selectedState && (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">
              MGNREGA Data for {selectedState}
            </h2>

            {stateData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Month</th>
                      <th className="border p-2">State</th>
                      <th className="border p-2">District</th>
                      <th className="border p-2">Jobs Created</th>
                      <th className="border p-2">Wages Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stateData.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="border p-2">{item.month}</td>
                        <td className="border p-2">{item.state}</td>
                        <td className="border p-2">{item.district}</td>
                        <td className="border p-2">
                          {item.jobsCreated ? item.jobsCreated : "—"}
                        </td>
                        <td className="border p-2">
                          {item.wagesPaid ? item.wagesPaid.toFixed(2) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No data available for {selectedState}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
