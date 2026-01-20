// Admin-Specific API Hooks
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export function useAllProducts() {
  return useQuery({
    queryKey: ["/api/products"],
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest("POST", "/api/products", productData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: any }) => {
      const response = await apiRequest("PATCH", `/api/products/${productId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ["/api/admin/orders"],
  });
}

export function useUpdateOrderStatus() {
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/orders/${orderId}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
  });
}

export function useAvailableDrivers() {
  return useQuery({
    queryKey: ["/api/driver/available"],
  });
}

export function useAssignDriver() {
  return useMutation({
    mutationFn: async ({ orderId, driverId }: { orderId: string; driverId: string }) => {
      const response = await apiRequest("POST", `/api/orders/${orderId}/assign`, { driverId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
    },
  });
}

export function useDashboardAnalytics(days: number = 30) {
  return useQuery({
    queryKey: ["/api/analytics", days],
  });
}

export function useLowStockProducts() {
  return useQuery({
    queryKey: ["/api/admin/inventory/low-stock"],
  });
}

export function useActiveEvents() {
  return useQuery({
    queryKey: ["/api/events"],
  });
}
