const request = async (path, options = {}) => {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    throw new Error(data.message || "The request could not be completed.");
  }

  return data;
};

export const getBackendHealth = () => request("/api/health");

export const registerUser = (payload) =>
  request("/api/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload) =>
  request("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
