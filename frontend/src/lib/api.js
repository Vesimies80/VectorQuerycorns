// src/lib/api.js
import axios from "axios";

export async function queryBackend({ index, prompt, userId }) {
  try {
    const resp = await axios.get("/api/proooompt", {
      params: {
        proooompt: prompt,
        user_id: userId,
      },
    });

    console.log("queryBackend response:", resp.data);
    return resp.data;
  } catch (err) {
    console.error("queryBackend error:", err);
    throw err;
  }
}

/**
 * Fetch previous conversations for a given userId.
 * Calls: GET /api/previous/proooooooompts?user_id={userId}
 */
export async function fetchPreviousPrompts(userId) {
  try {
    const resp = await axios.get("/api/previous/proooooooompts", {
      params: { user_id: userId },
    });
    console.log("fetchPreviousPrompts response:", resp.data);
    return resp.data; // expected to be an array of { index, title, text, chart? }
  } catch (err) {
    console.error("fetchPreviousPrompts error:", err);
    throw err;
  }
}