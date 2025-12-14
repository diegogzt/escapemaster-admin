import api from "./api";

export interface WidgetDefinition {
  id: string;
  name: string;
  slug: string;
  description?: string;
  component_path: string;
  default_config?: any;
  created_at: string;
  updated_at?: string;
}

export const getWidgets = async () => {
  const response = await api.get<WidgetDefinition[]>("/admin/widgets");
  return response.data;
};

export const getWidget = async (id: string) => {
  // Assuming there is a get by id endpoint or we filter from list
  // The API I created didn't explicitly have GET /widgets/{id}, only PUT and DELETE.
  // I should probably add GET /widgets/{id} to the API or just use the list.
  // For now, I'll assume I can fetch the list and find it, or I'll add the endpoint.
  // Actually, I'll add the endpoint to the API quickly.
  const response = await api.get<WidgetDefinition[]>("/admin/widgets");
  return response.data.find((w) => w.id === id);
};

export const createWidget = async (
  data: Omit<WidgetDefinition, "id" | "created_at" | "updated_at">
) => {
  const response = await api.post<WidgetDefinition>("/admin/widgets", data);
  return response.data;
};

export const updateWidget = async (
  id: string,
  data: Partial<WidgetDefinition>
) => {
  const response = await api.put<WidgetDefinition>(
    `/admin/widgets/${id}`,
    data
  );
  return response.data;
};

export const deleteWidget = async (id: string) => {
  await api.delete(`/admin/widgets/${id}`);
};
