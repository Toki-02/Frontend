// src/pages/RegisterFace/RegisterFace.jsx
import React, { useState } from "react";
import { Camera } from "lucide-react";
import CameraModal from "../../components/CameraModal";
import { addFaceRecord } from "../../services/fakeBackend";

export default function RegisterFace() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
    dob: "",
    membership: "",
    idNumber: "",
    department: "",
    remarks: "",
    photo: null,
  });

  const [openCamera, setOpenCamera] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCapture = (img) => {
    setForm((prev) => ({ ...prev, photo: img }));
    setOpenCamera(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) {
      alert("Please enter your full name.");
      return;
    }
    if (!form.photo) {
      alert("Please capture your face before submitting.");
      return;
    }

    const name = `${form.firstName} ${form.lastName}`;
    const newRecord = addFaceRecord({ name, photo: form.photo });

    if (newRecord) {
      alert(`✅ ${name} registered successfully!`);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        address: "",
        dob: "",
        membership: "",
        idNumber: "",
        department: "",
        remarks: "",
        photo: null,
      });
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full text-gray-900 flex flex-col items-center justify-start bg-gradient-to-tr from-[#F0FAFF]/90 to-[#D8ECF8]/90 px-6 sm:px-12 lg:px-24 py-16">
      <h2 className="text-4xl font-extrabold text-blue-500 mb-10 drop-shadow-md text-center">
        Register Patron Face
      </h2>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Left: Camera */}
        <div className="flex flex-col items-center justify-start space-y-6">
          <div className="w-[180px] h-[180px] rounded-full border-4 border-blue-400 flex items-center justify-center bg-white/50 shadow-md overflow-hidden">
            {form.photo ? (
              <img
                src={form.photo}
                alt="Captured"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Camera size={56} className="text-blue-500 opacity-90" />
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpenCamera(true)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold text-white shadow-md w-full text-center transition-all duration-200"
          >
            Capture Face
          </button>
        </div>

        {/* Right: Info Fields */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name *"
            className="p-3 bg-white/80 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name *"
            className="p-3 bg-white/80 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-3 bg-white/80 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition md:col-span-2"
          />
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            className="p-3 bg-white/80 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="p-3 bg-white/80 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition md:col-span-2"
          />
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            className="p-3 bg-white/80 border border-gray-300 rounded-md text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
          />
          <select
            name="membership"
            value={form.membership}
            onChange={handleChange}
            className="p-3 bg-white/80 border border-gray-300 rounded-md text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
          >
            <option value="">Membership Type</option>
            <option value="Student">Student</option>
            <option value="Employee">Employee</option>
            <option value="Guest">Guest</option>
          </select>
          <input
            name="idNumber"
            value={form.idNumber}
            onChange={handleChange}
            placeholder="ID Number"
            className="p-3 bg-white/80 border border-gray-300 rounded-md text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
          />
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department / Course"
            className="p-3 bg-white/80 border border-gray-300 rounded-md text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
          />
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Remarks or Notes"
            rows="4"
            className="p-3 bg-white/80 border border-gray-300 rounded-md text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition md:col-span-2"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-3 flex justify-end mt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white shadow-md transition-all duration-200"
          >
            Register User
          </button>
        </div>
      </form>

      <CameraModal
        open={openCamera}
        onClose={() => setOpenCamera(false)}
        onCapture={handleCapture}
      />
    </div>
  );
}
