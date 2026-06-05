const ROOM_API_URL = "/api/room";
const BILLING_API_URL = "/api/billing";
const MICRO_API_URL = "/api/micro";

function baseUrlFor(path) {
  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/invoices") ||
    path.startsWith("/payments")
  ) {
    return BILLING_API_URL;
  }

  if (path.startsWith("/auth") || path.startsWith("/api/sso") || path.startsWith("/api/search") || path.startsWith("/api/reports")) {
    return MICRO_API_URL;
  }

  return ROOM_API_URL;
}

export async function api(path, options = {}) {
  const response = await fetch(`${baseUrlFor(path)}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function money(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")} VND`;
}

export function queryString(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "ALL") {
      searchParams.set(key, value);
    }
  });
  const text = searchParams.toString();
  return text ? `?${text}` : "";
}

export function toNumberPayload(data, fields) {
  const result = { ...data };
  fields.forEach((field) => {
    result[field] = Number(result[field]);
  });
  return result;
}
