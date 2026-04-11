const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_PREFIX = "/api";
const API_URL = API_BASE_URL + API_PREFIX;

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token"); // Simple auth token stored from login

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

// Vehicle specific API functions
export interface Vehicle {
  id: string;
  licencePlate: string;
  model: string | null;
  userId: string;
  // we can add other fields from the backend schema if needed
}

export const vehicleApi = {
  getVehicles: (): Promise<Array<Vehicle>> => fetchApi("/vehicle"),
  getVehicleById: (id: string): Promise<Vehicle> => fetchApi(`/vehicle/${id}`),
  registerVehicle: (data: { licencePlate: string; model?: string }) =>
    fetchApi("/vehicle", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteVehicle: (id: string) =>
    fetchApi(`/vehicle/${id}`, { method: "DELETE" }),
};

// Admin specific API functions
export const adminApi = {
  deleteFloor: (id: string) =>
    fetchApi(`/admin/floor/${id}`, { method: "DELETE" }),
  deleteSlot: (id: string) =>
    fetchApi(`/admin/slot/${id}`, { method: "DELETE" }),
  deleteParkingLot: (id: string) =>
    fetchApi(`/admin/parking-lot/${id}`, { method: "DELETE" }),
};
