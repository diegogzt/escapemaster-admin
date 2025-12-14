import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  login: async (data: any) => {
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
  createOrganization: async (data: any) => {
    const response = await api.post("/admin/organizations", data);
    return response.data;
  },
  getOrgUsers: async (orgId: string) => {
    const response = await api.get(`/admin/organizations/${orgId}/users`);
    return response.data;
  },
  createUserInOrg: async (orgId: string, data: any) => {
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
};

export default api;
