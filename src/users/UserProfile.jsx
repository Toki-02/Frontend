// src/users/UserProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  User as UserIcon,
  BadgeCheck,
  Mail,
  MapPin,
  CalendarDays,
  Camera,
  Activity,
  BookOpen,
  RefreshCcw,
} from "lucide-react";
import CameraModal from "../components/CameraModal";
import { toast } from "react-toastify";
import {
  getReservationsForUser,
  getTransactions,
  getBookById,
} from "../services/fakeBackend";

export default function UserProfile() {
  const { user } = useAuth();
  const userEmail = user?.email || "demo@user.local";

  const [profile, setProfile] = useState({
    name: user?.name || "Guest User",
    email: userEmail,
    address: "",
    membership: "Student",
  });

  const [faceImage, setFaceImage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [joinedAt, setJoinedAt] = useState(null);

  const [activeReservations, setActiveReservations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [customActivity, setCustomActivity] = useState([]);

  useEffect(() => {
    const storedProfile = JSON.parse(
      localStorage.getItem(`lib_user_profile_${userEmail}`) || "null"
    );
    if (storedProfile) setProfile((p) => ({ ...p, ...storedProfile, email: userEmail }));

    const storedFace = localStorage.getItem(`lib_user_face_${userEmail}`);
    if (storedFace) setFaceImage(storedFace);

    let j = localStorage.getItem(`lib_user_joined_${userEmail}`);
    if (!j) {
      j = new Date().toISOString();
      localStorage.setItem(`lib_user_joined_${userEmail}`, j);
    }
    setJoinedAt(j);

    const savedActivity = JSON.parse(
      localStorage.getItem(`lib_user_activity_${userEmail}`) || "[]"
    );
    setCustomActivity(savedActivity);

    setActiveReservations(getReservationsForUser(userEmail) || []);
    const tx = (getTransactions() || []).filter(
      (t) =>
        (t.userName || "").trim().toLowerCase() ===
        (storedProfile?.name || user?.name || "Guest User").trim().toLowerCase()
    );
    setTransactions(tx);
  }, [userEmail, user?.name]);

  const membershipId = useMemo(() => {
    const base = (userEmail.split("@")[0] || "USER").replace(/[^A-Za-z0-9]/g, "");
    return `LIB${base.toUpperCase().slice(0, 6)}`;
  }, [userEmail]);

  const stats = useMemo(() => {
    const borrowed = transactions.filter((t) => t.type === "borrow").length;
    const returned = transactions.filter((t) => t.type === "return").length;
    return {
      activeReservations: activeReservations.length,
      borrowed,
      returned,
    };
  }, [activeReservations.length, transactions]);

  const activityTimeline = useMemo(() => {
    const rows = [];
    customActivity.forEach((a) => {
      rows.push({
        kind: "custom",
        title: a.title || "Activity",
        description: a.description || "",
        timestamp: a.timestamp || new Date().toISOString(),
        icon: <Activity className="w-4 h-4 text-sky-600" />,
      });
    });

    activeReservations.forEach((r) => {
      const book = getBookById?.(r.bookId);
      rows.push({
        kind: "reservation",
        title: `Reserved: ${book?.title || `Book #${r.bookId}`}`,
        description: `Expires ${new Date(r.expiresAt).toLocaleString()}`,
        timestamp: r.reservedAt,
        icon: <BookOpen className="w-4 h-4 text-sky-600" />,
      });
    });

    transactions.forEach((t) => {
      rows.push({
        kind: t.type,
        title:
          t.type === "borrow"
            ? `Borrowed: ${t.bookTitle}`
            : `Returned: ${t.bookTitle}`,
        description:
          t.type === "borrow"
            ? `Author: ${t.author || "-"}`
            : `Author: ${t.author || "-"}`,
        timestamp: t.timestamp,
        icon:
          t.type === "borrow" ? (
            <BookOpen className="w-4 h-4 text-emerald-600" />
          ) : (
            <RefreshCcw className="w-4 h-4 text-indigo-600" />
          ),
      });
    });

    return rows.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [customActivity, activeReservations, transactions]);

  const handleFaceCapture = (dataUrl) => {
    setFaceImage(dataUrl);
    localStorage.setItem(`lib_user_face_${userEmail}`, dataUrl);
    toast.success("Face ID updated!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100 px-6 md:px-12 py-10 text-sky-950">
      <h1 className="text-3xl font-bold text-sky-900 mb-8 text-center">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
        <div className="lg:col-span-2 bg-white/90 border border-sky-100 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-sky-100 border border-sky-200 shadow-sm">
              {faceImage ? (
                <img
                  src={faceImage}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-sky-600/80" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl md:text-2xl font-bold text-sky-900">
                  {profile.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-sky-200 bg-sky-50 text-sky-700">
                  <BadgeCheck className="w-3 h-3" />
                  {profile.membership}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-indigo-200 bg-indigo-50 text-indigo-700">
                  ID: {membershipId}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-sky-800/90">
                <div className="inline-flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky-600" />
                  <span>{profile.email}</span>
                </div>
                {profile.address && (
                  <div className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span>{profile.address}</span>
                  </div>
                )}
                {joinedAt && (
                  <div className="inline-flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-sky-600" />
                    <span>Joined {new Date(joinedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5">
                {[{ label: "Active Reservations", value: "3"}, { label: "Borrowed", value: "2"}, { label: "Returned", value: "1"}].map((s) => (
                  <div key={s.label} className="rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-sky-900">{s.value}</div>
                    <div className="text-[11px] uppercase tracking-wide text-sky-700/80">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 border border-sky-100 rounded-2xl shadow-lg p-6">
          <h3 className="text-base font-semibold text-sky-900 mb-2">Face ID</h3>
          <p className="text-sm text-sky-700/80 mb-3">
            {faceImage ? "Face ID is enrolled. You can rescan anytime." : "Scan your face to enable faster reservations."}
          </p>
          <button
            onClick={() => setCameraOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm shadow-md"
          >
            <Camera className="w-4 h-4" />
            {faceImage ? "Rescan Face" : "Enroll Face"}
          </button>
          {faceImage && (
            <div className="mt-4 rounded-xl overflow-hidden border border-sky-100">
              <img src={faceImage} alt="Face" className="w-full h-40 object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-sky-900 mb-4">Activity Timeline</h2>
        <div className="bg-white/90 rounded-2xl border border-sky-100 shadow-md p-4 md:p-6">
          {activityTimeline.length === 0 ? (
            <p className="text-sky-700/80 text-sm">No activities yet.</p>
          ) : (
            <ul className="space-y-3">
              {activityTimeline.map((a, idx) => (
                <motion.li key={idx} whileHover={{ y: -2 }} className="flex items-start gap-3 border-b last:border-b-0 border-sky-100 pb-3">
                  <div className="mt-0.5">{a.icon}</div>
                  <div className="flex-1">
                    <div className="text-sky-900 font-medium">{a.title}</div>
                    {a.description && (
                      <div className="text-xs text-sky-700/80 mt-0.5">{a.description}</div>
                    )}
                  </div>
                  <div className="text-[11px] text-sky-500">{new Date(a.timestamp).toLocaleString()}</div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CameraModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleFaceCapture}
      />
    </div>
  );
}
