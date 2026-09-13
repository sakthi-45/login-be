const BACKEND_URL = "https://backend-ruddy-rho-94.vercel.app";

const request = async (path, options = {}) => {
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // Check if the response is JSON and parse it accordingly
    var a = 0

    const contentType = response.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      // Handles network errors like CORS blocking or connection drops
      throw new Error("Unable to connect to backend server.");
    }
    throw error;
  }
};

// Backend health check
export const getBackendHealth = () =>
  request("/api/health");

// Register user
export const registerUser = (payload) =>
  request("/api/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Login user
export const loginUser = (payload) =>
  request("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });