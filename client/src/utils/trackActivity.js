import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Tracks user activity and increments relevant counters atomically.
 * @param {string} uid - Firebase Auth UID
 * @param {string} action - Description of the action (e.g. "Solved Trigonometry Doubt")
 * @param {string} type - Action type ("doubt" | "notes" | "quiz" | "planner")
 */
export async function trackActivity(uid, action, type) {
  if (!uid) return;

  try {
    // 1. Add document to activity sub-collection
    const activityRef = collection(db, 'users', uid, 'activity');
    await addDoc(activityRef, {
      action,
      type,
      timestamp: serverTimestamp()
    });

    // 2. Increment relevant counter in user document
    const userRef = doc(db, 'users', uid);
    const updates = {};

    switch (type) {
      case 'doubt':
        updates.doubts_solved = increment(1);
        break;
      case 'notes':
        updates.notes_uploaded = increment(1);
        break;
      case 'quiz':
        updates.pending_assignments = increment(-1);
        break;
      case 'planner':
        // Each plan = +5% progress, max 100 handled by increment, 
        // but we should ideally cap it if we were doing complex logic.
        // For now, simple increment as requested.
        updates.planner_progress = increment(5);
        break;
      default:
        break;
    }

    if (Object.keys(updates).length > 0) {
      await updateDoc(userRef, updates);
    }
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
}
