import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMedicines } from "../slices/medicineSlice";
import {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  getMedicineById,
} from "../services/api";
import Navbar from "./NavBar";
import { setLoading } from "../slices/globalSlice";

const Medicine = () => {
  const dispatch = useDispatch();
  const medicines = useSelector((state) => state.medicines.medicines);
  const loading = useSelector((state) => state.global.loading);

  const [formState, setFormState] = useState({
    name: "",
    dosage: "",
    scheduleTimes: [""],
    selectedMedicine: null,
  });
  const [message, setMessage] = useState({ type: "", content: "" });

  useEffect(() => {
    const fetchMedicines = async () => {
      dispatch(setLoading(true));
      try {
        const response = await getMedicines();
        dispatch(setMedicines(response.data));
      } catch (error) {
        setMessage({ type: "error", content: "Failed to fetch medicines." });
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchMedicines();
  }, [dispatch]);

  const resetForm = () => {
    setFormState({
      name: "",
      dosage: "",
      scheduleTimes: [""],
      selectedMedicine: null,
    });
  };

  const showTemporaryMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: "", content: "" }), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleScheduleChange = (index, value) => {
    const updatedScheduleTimes = [...formState.scheduleTimes];
    updatedScheduleTimes[index] = value;
    setFormState((prevState) => ({
      ...prevState,
      scheduleTimes: updatedScheduleTimes,
    }));
  };

  const handleAddScheduleTime = () => {
    setFormState((prevState) => ({
      ...prevState,
      scheduleTimes: [...prevState.scheduleTimes, ""],
    }));
  };

  const handleSubmit = async () => {
    const { name, dosage, scheduleTimes, selectedMedicine } = formState;
    if (!name || !dosage || scheduleTimes.some((time) => !time)) {
      showTemporaryMessage("error", "All fields are required.");
      return;
    }

    try {
      const schedule = scheduleTimes.map((time) => new Date(time.trim()));
      if (selectedMedicine) {
        await updateMedicine(selectedMedicine._id, {
          name,
          dosage,
          scheduleTime: schedule,
        });
        showTemporaryMessage("success", "Medicine updated successfully.");
      } else {
        await createMedicine({ name, dosage, scheduleTime: schedule });
        showTemporaryMessage("success", "Medicine added successfully.");
      }
      resetForm();
      const response = await getMedicines();
      dispatch(setMedicines(response.data));
    } catch (error) {
      showTemporaryMessage("error", "Operation failed. Please try again.");
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getMedicineById(id);
      const { name, dosage, scheduleTime } = response.data;
      setFormState({
        name,
        dosage,
        scheduleTimes: scheduleTime.map((time) =>
          new Date(time).toISOString().slice(0, 16)
        ),
        selectedMedicine: response.data,
      });
    } catch (error) {
      showTemporaryMessage("error", "Failed to fetch medicine details.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedicine(id);
      const response = await getMedicines();
      dispatch(setMedicines(response.data));
      showTemporaryMessage("success", "Medicine deleted successfully.");
    } catch (error) {
      showTemporaryMessage("error", "Failed to delete medicine.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 mt-14 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Medicine Schedule</h2>

        <div className="mb-6 bg-white p-4 rounded shadow-md">
          <input
            type="text"
            name="name"
            placeholder="Medicine Name"
            value={formState.name}
            onChange={handleInputChange}
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <input
            type="text"
            name="dosage"
            placeholder="Dosage"
            value={formState.dosage}
            onChange={handleInputChange}
            className="border rounded w-full py-2 px-3 mb-4"
          />
          {formState.scheduleTimes.map((time, index) => (
            <input
              key={index}
              type="datetime-local"
              value={time}
              onChange={(e) => handleScheduleChange(index, e.target.value)}
              className="border rounded w-full py-2 px-3 mb-4"
            />
          ))}
          <button
            type="button"
            onClick={handleAddScheduleTime}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
          >
            Add Schedule Time
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            {formState.selectedMedicine ? "Update Medicine" : "Add Medicine"}
          </button>
          {message.content && (
            <p
              className={`mt-4 ${
                message.type === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {message.content}
            </p>
          )}
        </div>

        <table className="w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Dosage</th>
              <th className="border p-2">Schedule</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine._id}>
                <td className="border p-2">{medicine.name}</td>
                <td className="border p-2">{medicine.dosage}</td>
                <td className="border p-2">
                  {medicine.scheduleTime.map((time, idx) => (
                    <div key={idx}>{new Date(time).toLocaleString()}</div>
                  ))}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(medicine._id)}
                    className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(medicine._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded"
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

export default Medicine;
