import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://manager.escapemaster.es/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const admin = {
  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/admin/login", data);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },
  getOrganizations: async () => {
    const response = await api.get("/admin/organizations");
    return response.data;
  },
  createOrganization: async (data: Record<string, unknown>) => {
    const response = await api.post("/admin/organizations", data);
    return response.data;
  },
  getOrgUsers: async (orgId: string) => {
    const response = await api.get(`/admin/organizations/${orgId}/users`);
    return response.data;
  },
  createUserInOrg: async (orgId: string, data: Record<string, unknown>) => {
    const response = await api.post(`/admin/organizations/${orgId}/users`, data);
    return response.data;
  },
  getPermissions: async () => {
    const response = await api.get("/admin/permissions");
    return response.data;
  },
  getOrgRoles: async (orgId: string) => {
    const response = await api.get(`/admin/organizations/${orgId}/roles`);
    return response.data;
  },
  getRolePermissions: async (roleId: string) => {
    const response = await api.get(`/admin/roles/${roleId}/permissions`);
    return response.data;
  },
  assignPermissionToRole: async (roleId: string, permissionId: string) => {
    const response = await api.post(`/admin/roles/${roleId}/permissions`, {
      permission_id: permissionId,
    });
    return response.data;
  },
  removePermissionFromRole: async (roleId: string, permissionId: string) => {
    const response = await api.delete(`/admin/roles/${roleId}/permissions/${permissionId}`);
    return response.data;
  },
  // Room Management
  getRooms: async () => {
    // Determine endpoint based on API structure. Assuming /admin/rooms or /rooms with admin token
    // Based on previous context, main API has /rooms. Admin usually creates via /rooms but needs full access.
    // If backend doesn't have specific /admin/rooms, we use /rooms
    const response = await api.get("/rooms");
    return response.data;
  },
  getRoom: async (id: string) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },
  createRoom: async (data: Record<string, unknown>) => {
    const response = await api.post("/rooms", data);
    return response.data;
  },
  updateRoom: async (id: string, data: Record<string, unknown>) => {
    const response = await api.put(`/rooms/${id}`, data);
    return response.data;
  },
  uploadRoomImage: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/rooms/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  
  // KYB Verification
  getPendingKYB: async () => {
    const response = await api.get("/kyb/admin/pending");
    return response.data;
  },
  reviewKYBDocument: async (documentId: string, data: { status: string; rejection_reason?: string }) => {
    const response = await api.put(`/kyb/admin/documents/${documentId}`, data);
    return response.data;
  },
  getOrganizationKYBStatus: async (orgId: string) => {
    const response = await api.get(`/kyb/admin/organizations/${orgId}/status`);
    return response.data;
  },
  
  // Payouts
  getPendingPayouts: async () => {
    const response = await api.get("/payouts/admin/pending");
    return response.data;
  },
  processPayouts: async () => {
    const response = await api.post("/payouts/admin/process");
    return response.data;
  },
};

export default api;
