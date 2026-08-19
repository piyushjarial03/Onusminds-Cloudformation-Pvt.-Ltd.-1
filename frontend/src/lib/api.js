import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, withCredentials: true });

export const fileUrl = (u) =>
  !u ? "" : u.startsWith("/") ? `${process.env.REACT_APP_BACKEND_URL}${u}` : u;

export const formatApiError = (e) => {
  const d = e?.response?.data?.detail;
  if (!d) return e?.message || "Something went wrong. Please try again.";
  if (typeof d === "string") return d;
  if (Array.isArray(d))
    return d.map((x) => (x && typeof x.msg === "string" ? x.msg : JSON.stringify(x))).join(" ");
  return String(d);
};
