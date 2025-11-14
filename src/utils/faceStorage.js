// src/utils/faceStorage.js
// simple localStorage wrapper to save and read face descriptors & transactions

const FACES_KEY = "registeredFaces_v1";
const TX_KEY = "libraryTransactions_v1";

export function listFaces() {
  try {
    return JSON.parse(localStorage.getItem(FACES_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

export function addFace(profile) {
  // profile: { id, name, descriptor: [..] } or { id, name, descriptors: [[...], ...] }
  const all = listFaces();
  all.push(profile);
  localStorage.setItem(FACES_KEY, JSON.stringify(all));
  return profile;
}

export function clearFaces() {
  localStorage.removeItem(FACES_KEY);
}

export function listTransactions() {
  try {
    return JSON.parse(localStorage.getItem(TX_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

export function addTransaction(tx) {
  // tx: { personId, personName, type: "Borrow"|"Return", bookId, time }
  const all = listTransactions();
  const now = new Date().toISOString();
  all.unshift({ ...tx, time: tx.time || now, id: `T-${Date.now()}` });
  localStorage.setItem(TX_KEY, JSON.stringify(all));
  return all[0];
}
