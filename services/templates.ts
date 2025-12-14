import api from "./api";

export interface DashboardTemplate {
  id: string;
  name: string;
  description?: string;
  layout: any[];
  is_default: boolean;
  created_at: string;
  updated_at?: string;
}

export const getTemplates = async () => {
  const response = await api.get<DashboardTemplate[]>(
    "/admin/dashboard-templates"
  );
  return response.data;
};

export const getTemplate = async (id: string) => {
  const response = await api.get<DashboardTemplate[]>(
    "/admin/dashboard-templates"
  );
  return response.data.find((t) => t.id === id);
};

export const createTemplate = async (
  data: Omit<DashboardTemplate, "id" | "created_at" | "updated_at">
) => {
  const response = await api.post<DashboardTemplate>(
    "/admin/dashboard-templates",
    data
  );
  return response.data;
};

export const updateTemplate = async (
  id: string,
  data: Partial<DashboardTemplate>
) => {
  const response = await api.put<DashboardTemplate>(
    `/admin/dashboard-templates/${id}`,
    data
  );
  return response.data;
};

export const deleteTemplate = async (id: string) => {
  await api.delete(`/admin/dashboard-templates/${id}`);
};
