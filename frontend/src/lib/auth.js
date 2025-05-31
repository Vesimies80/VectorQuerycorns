// src/lib/auth.js
import axios from "axios";

export async function getOrCreateUserId() {
  let userId = 0;


  if (typeof window !== "undefined") {
    const existing = window.localStorage.getItem("userId");
    if (existing !== "undefined" && existing !== null) {
      console.log("Using existing userId from localStorage:", existing);
      return existing;
    }
  }

  try {
    const url = "/api/login";
    const response = await axios.get(url);
    userId = response.data.user_id;
  } catch (error) {
    console.error("Error fetching user ID:", error);
  }

  // 3. Save in localStorage
  if (typeof window !== "undefined") {
    window.localStorage.setItem("userId", userId);
  }

  console.log("Created new userId:", userId);

  return userId;
}