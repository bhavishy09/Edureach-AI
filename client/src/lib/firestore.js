// Firestore CRUD helpers for EduReach AI
// All documents include created_at and user_id for RAG compatibility

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ─────────────────────────────────────────
// USERS COLLECTION
// ─────────────────────────────────────────

/**
 * Create a new user document in Firestore
 * @param {string} userId - Firebase UID or generated ID
 * @param {object} userData - User data
 */
export async function createUser(userId, userData) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    user_id: userId,
    name: userData.name || '',
    role: userData.role, // "student" | "teacher" | "admin"
    email: userData.email || '',
    phone: userData.phone || '',
    school_code: userData.school_code || '',
    teacher_id: userData.teacher_id || '',
    class: userData.class || '',
    board: userData.board || '',
    created_at: serverTimestamp(),
    last_login: serverTimestamp(),
  });
}

/**
 * Get a user document by ID
 */
export async function getUser(userId) {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Update last_login timestamp
 */
export async function updateLastLogin(userId) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { last_login: serverTimestamp() });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email) {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

// ─────────────────────────────────────────
// SCHOOL CODES COLLECTION
// ─────────────────────────────────────────

/**
 * Create a new school code in Firestore
 */
export async function createSchoolCode(schoolData) {
  const codeRef = doc(db, 'school_codes', schoolData.school_code);
  await setDoc(codeRef, {
    school_code: schoolData.school_code,
    school_name: schoolData.school_name,
    created_by: 'admin',
    created_at: serverTimestamp(),
    status: 'active',
    teacher_count: 0,
  });
}

/**
 * Get all school codes
 */
export async function getAllSchoolCodes() {
  const q = query(collection(db, 'school_codes'), orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Verify if a school code exists and is active
 */
export async function verifySchoolCode(code) {
  const codeRef = doc(db, 'school_codes', code);
  const snap = await getDoc(codeRef);
  if (!snap.exists()) return { valid: false, reason: 'School code not found' };
  const data = snap.data();
  if (data.status !== 'active') return { valid: false, reason: 'School code is inactive' };
  return { valid: true, data };
}

/**
 * Delete a school code
 */
export async function deleteSchoolCode(code) {
  const codeRef = doc(db, 'school_codes', code);
  await deleteDoc(codeRef);
}

/**
 * Increment teacher count for a school code
 */
export async function incrementTeacherCount(code) {
  const codeRef = doc(db, 'school_codes', code);
  const snap = await getDoc(codeRef);
  if (snap.exists()) {
    await updateDoc(codeRef, {
      teacher_count: (snap.data().teacher_count || 0) + 1,
    });
  }
}

// ─────────────────────────────────────────
// CHAT LOGS COLLECTION
// (RAG-compatible: plain strings, timestamps)
// ─────────────────────────────────────────

/**
 * Save a chat log entry
 * Messages/responses stored as plain strings for direct embedding
 */
export async function saveChatLog(logData) {
  const ref = await addDoc(collection(db, 'chat_logs'), {
    user_id: logData.user_id,
    role: logData.role, // "student" | "teacher"
    message: logData.message, // plain string
    response: logData.response, // plain string
    created_at: serverTimestamp(),
    session_id: logData.session_id || '',
  });
  return ref.id;
}

/**
 * Get chat logs for a user
 */
export async function getChatLogs(userId) {
  const q = query(
    collection(db, 'chat_logs'),
    where('user_id', '==', userId),
    orderBy('created_at', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
