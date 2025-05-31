// src/lib/api.js
import axios from "axios";

export async function queryBackend({ index, prompt, userId }) {
  try {
    const resp = await axios.get(
      "/api/proooompt",
      {
        params: {
          proooompt: prompt,
          user_id: userId,
        },
      }
    );

    console.log("queryBackend response:", resp.data);
    return resp.data;
  } catch (err) {
    console.error("queryBackend error:", err);
    throw err;
  }
}