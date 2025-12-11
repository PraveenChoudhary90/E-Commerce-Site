import { useState, useEffect } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { referralManagement, getReferralPercentages } from "../api/auth-api";
import Swal from "sweetalert2";
import PageLoader from "../components/ui/PageLoader";
import { FaTrash } from "react-icons/fa";
import SettingsForm from "../components/Settings";


export default function ReferralManagement() {
  const [level, setLevel] = useState(1);
  const [percentage, setPercentage] = useState(0);
  const [levels, setLevels] = useState({});
  const [loading, setLoading] = useState(false);
  const [maxLevel, setMaxLevel] = useState(10);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        const response = await getReferralPercentages();
        console.log("xbzxbj",response)
        if (response) {
          setLevels(response.percentages);
          const fetchedMax = Math.max(
            10,
            ...Object.keys(response.percentages).map(Number)
          );
          setMaxLevel(fetchedMax);
        }
      } catch (error) {
        console.error("Error fetching referral levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const handleAdd = () => {
    if (percentage > 0) {
      setLevels((prev) => ({
        ...prev,
        [level]: percentage,
      }));
      setPercentage(0);
      if (level > maxLevel) {
        setMaxLevel(level);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await referralManagement(levels);
      console.log("dfnbj",response)
      if (response) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Referral levels updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLevel = () => {
    setMaxLevel((prev) => prev + 1);
  };

  const handleDeleteLevel = (lvlToDelete) => {
    if (lvlToDelete !== maxLevel) {
      // Prevent deletion if it's not the highest level
      Swal.fire({
        icon: "warning",
        title: "Not Allowed",
        text: `You can only delete the highest level (Level ${maxLevel}).`,
      });
      return;
    }

    const updatedLevels = { ...levels };
    delete updatedLevels[lvlToDelete];

    // Adjust maxLevel down by 1 or stop at 10
    let newMax = maxLevel - 1;
    while (newMax > 10 && !(newMax in updatedLevels)) {
      newMax--;
    }

    setLevels(updatedLevels);
    setMaxLevel(Math.max(newMax, 10));
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="p-4 col-span-1 flex flex-col md:flex-row gap-6 items-start justify-between">
        {/* Referral Percentages */}
        <div className="flex flex-col gap-6 w-full md:w-1/2 p-4 bg-purple-50 rounded-xl shadow-lg">
          <h2 className=" text-2xl font-bold text-purple-700">
            LEVEL INCOME
          </h2>

          <div className="flex gap-3 flex-wrap justify-between items-center">
            <select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="border border-purple-300 rounded-lg p-2 text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 w-1/3"
            >
              {[...Array(maxLevel)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Level {i + 1}
                </option>
              ))}
            </select>

            <InputField
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="border border-purple-300 rounded-lg p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter %"
            />

            <Button
              title="Add"
              onClick={handleAdd}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-sm shadow-md"
            />

            <Button
              title="Add Level +"
              onClick={handleAddLevel}
              className="bg-purple-100 text-purple-700 font-semiboldadow-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-purple-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-purple-100 text-purple-700">
                  <th className="border border-purple-200 p-2 text-sm">LEVEL</th>
                  <th className="border border-purple-200 p-2 text-sm">PERCENTAGE (%)</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxLevel }, (_, i) => {
                  const lvl = i + 1;
                  return (
                    <tr key={lvl} className="even:bg-purple-50">
                      <td className="border border-purple-200 p-2 text-center text-purple-700 font-semibold flex items-center justify-center gap-2">
                        Level {lvl}
                        {lvl > 10 && (
                          <button
                            onClick={() => handleDeleteLevel(lvl)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                      <td className="border border-purple-200 p-2 text-center text-purple-600 font-medium">
                        {levels[lvl] != null ? `${levels[lvl]}%` : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center">
            <Button
              title="Save Referral Percentages"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 text-base shadow-md"
            />
          </div>
        </div>
        {/* End Referral Percentages */}

        {/* <div className="w-full md:1/2"> */}
        <SettingsForm />
        {/* </div> */}

      </div>
    </>
  );
}