// src/utils/profileSync.js
// Singleton to sync profile image instantly between components

const STORAGE_KEY = "profileImage";
const PROFILE_DATA_KEY = "profileData";
const EVENT_NAME = "profile-updated";

let currentImage = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
})();

const subscribers = new Set();

function notifyAll(detail = {}) {
  subscribers.forEach((cb) => {
    try {
      cb(detail);
    } catch (err) {
      console.error("profileSync subscriber error", err);
    }
  });

  try {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
  } catch {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

export function setImage(image, extraProfileData = null) {
  currentImage = image || null;
  try {
    if (image) localStorage.setItem(STORAGE_KEY, image);
    else localStorage.removeItem(STORAGE_KEY);

    if (extraProfileData) {
      const existing = JSON.parse(localStorage.getItem(PROFILE_DATA_KEY) || "{}");
      const merged = { ...existing, ...extraProfileData, profile_image: image };
      localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(merged));
    }
  } catch (e) {
    console.warn("profileSync localStorage write failed", e);
  }

  notifyAll({ image, timestamp: Date.now() });
}

export function getImageSync() {
  return currentImage;
}

export function subscribe(cb) {
  if (typeof cb !== "function") return () => {};
  subscribers.add(cb);
  cb({ image: currentImage, timestamp: Date.now() });
  return () => subscribers.delete(cb);
}

export const EVENT = EVENT_NAME;
