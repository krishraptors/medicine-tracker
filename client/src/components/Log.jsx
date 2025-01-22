/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogs } from "../slices/logSlice";
import {
  createLog,
  getAcknowledgmentLogs,
  updateLog,
  deleteLog,
  getLogById,
  getUser,
  getMedicines,
} from "../services/api";
import Navbar from "./NavBar";
import { setLoading } from "../slices/globalSlice";

const Log = () => {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.logs.acknowledgmentLogs);
  const loading = useSelector((state) => state.global.loading);
  const [formState, setFormState] = useState({
    status: "",
    selectedLog: null,
    selectedMedicine: "",
  });
  const [userDetails, setUserDetails] = useState({ userId: "", name: "" });
  const [medicines, setMedicines] = useState([]);
  const [message, setMessage] = useState({ error: "", success: "" });

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const [logsResponse, userResponse, medicinesResponse] =
          await Promise.all([
            getAcknowledgmentLogs(),
            getUser(localStorage.getItem("userId")),
            getMedicines(),
          ]);

        dispatch(setLogs(logsResponse.data));
        setUserDetails({
          userId: userResponse.data._id,
          name: userResponse.data.name,
        });
        setMedicines(medicinesResponse.data);
      } catch {
        setMessage({
          error: "Failed to fetch data. Please try again.",
          success: "",
        });
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  const showTemporaryMessage = (type, text) => {
    setMessage({ ...message, [type]: text });
    setTimeout(() => setMessage({ ...message, [type]: "" }), 2000);
  };

  const handleCreateLog = async () => {
    if (!formState.selectedMedicine) {
      showTemporaryMessage("error", "Medicine ID is required to create a log.");
      return;
    }

    try {
      await createLog({
        status: formState.status || "taken",
        userId: userDetails.userId,
        medicineId: formState.selectedMedicine,
      });

      setFormState({ status: "", selectedLog: null, selectedMedicine: "" });
      showTemporaryMessage("success", "Log created successfully.");

      const response = await getAcknowledgmentLogs();
      dispatch(setLogs(response.data));
    } catch {
      showTemporaryMessage("error", "Failed to create log. Please try again.");
    }
  };

  const handleUpdateLog = async (id) => {
    if (!formState.status) {
      showTemporaryMessage("error", "Status is required to update the log.");
      return;
    }

    try {
      await updateLog(id, { status: formState.status });

      setFormState({ status: "", selectedLog: null, selectedMedicine: "" });
      showTemporaryMessage("success", "Log updated successfully.");

      const response = await getAcknowledgmentLogs();
      dispatch(setLogs(response.data));
    } catch {
      showTemporaryMessage("error", "Failed to update log. Please try again.");
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await deleteLog(id);

      const response = await getAcknowledgmentLogs();
      dispatch(setLogs(response.data));
      showTemporaryMessage("success", "Log deleted successfully.");
    } catch {
      showTemporaryMessage("error", "Failed to delete log. Please try again.");
    }
  };

  const handleFetchLogById = async (id) => {
    try {
      const log = await getLogById(id);
      setFormState({
        status: log.data.status,
        selectedLog: log.data,
        selectedMedicine: log.data.medicineId._id,
      });
    } catch {
      showTemporaryMessage(
        "error",
        "Failed to fetch log details. Please try again."
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-14 mx-auto p-6 bg-gray-50 shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600">
          Medicine Logs
        </h2>
        {message.error && (
          <div className="text-red-500 mb-4">{message.error}</div>
        )}
        {message.success && (
          <div className="text-green-500 mb-4">{message.success}</div>
        )}

        {!formState.selectedLog ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <select
              value={userDetails.userId}
              disabled
              className="border rounded py-2 px-3 bg-gray-200 cursor-not-allowed"
            >
              <option>{userDetails.name}</option>
            </select>

            <select
              value={formState.selectedMedicine}
              onChange={(e) =>
                setFormState({ ...formState, selectedMedicine: e.target.value })
              }
              className="border rounded py-2 px-3"
            >
              <option value="">Select Medicine</option>
              {medicines.map((medicine) => (
                <option key={medicine._id} value={medicine._id}>
                  {medicine.name}
                </option>
              ))}
            </select>

            <select
              value={formState.status}
              onChange={(e) =>
                setFormState({ ...formState, status: e.target.value })
              }
              className="border rounded py-2 px-3"
            >
              <option value="">Select Status</option>
              <option value="taken">Taken</option>
              <option value="missed">Missed</option>
            </select>

            <button
              onClick={handleCreateLog}
              className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
            >
              Create Log
            </button>
          </div>
        ) : (
          <div className="p-4 border rounded bg-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700">
              Editing Log ID: {formState.selectedLog._id}
            </h3>
            <select
              value={userDetails.userId}
              disabled
              className="border rounded py-2 px-3 mb-4 bg-gray-200 cursor-not-allowed w-full"
            >
              <option>{userDetails.name}</option>
            </select>

            <select
              value={formState.status}
              onChange={(e) =>
                setFormState({ ...formState, status: e.target.value })
              }
              className="border rounded py-2 px-3 mb-4 w-full"
            >
              <option value="">Select Status</option>
              <option value="taken">Taken</option>
              <option value="missed">Missed</option>
            </select>

            <button
              onClick={() => handleUpdateLog(formState.selectedLog._id)}
              className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
            >
              Update Log
            </button>
          </div>
        )}

        <table className="min-w-full border-collapse border border-gray-300 mt-6">
          <thead>
            <tr className="bg-indigo-100">
              <th className="border border-gray-300 px-4 py-2">
                Medicine Name
              </th>
              <th className="border border-gray-300 px-4 py-2">Dosage</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Timestamp</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="bg-white hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {log?.medicineId?.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {log?.medicineId?.dosage}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {log.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(log.timestamp).toLocaleString("en-GB")}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleFetchLogById(log._id)}
                    className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLog(log._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Log;
