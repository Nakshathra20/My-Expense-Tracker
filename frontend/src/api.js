// This file talks to the backend using fetch().
// Every page uses apiRequest() instead of repeating fetch code.

// import.meta.env is how a Vite frontend accesses environment variables.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("token"); // the saved login ticket
}

export function logout() {
  localStorage.removeItem("token"); // remove the login ticket from the local storage.
}

//apiRequest("/expenses", "POST", { description: "Tea", amount: 20, date: "2026-11-02" })
export async function apiRequest(path, method = "GET", body) {
  const headers = { "Content-Type": "application/json" };


  const token = getToken(); // get the token from the local storage.
  if (token) {
    headers.Authorization = "Bearer " + token; // add the token to the headers. bearer is the standard for authentication.
  }

  const response = await fetch(API_URL + path, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : undefined, 
  });

  const data = await response.json().catch(() => ({})); // if the response is not JSON, return an empty object.

  if (!response.ok) { 
    const error = new Error(data.message || "Something went wrong."); // data.message is the message from the backend. if it is not there, return "Something went wrong.".
    error.status = response.status;
    throw error;
  }

  return data;
}