// Driver-Specific API Hooks
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export function useDriverDeliveries(driverId?: string) {
  return useQuery({
    queryKey: ["/api/driver/deliveries", driverId],
    enabled: !!driverId,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

export function useUpdateDriverLocation() {
  return useMutation({
    mutationFn: async ({ latitude, longitude, speed }: { latitude: string; longitude: string; speed?: number }) => {
      const response = await apiRequest("POST", "/api/driver/location", { latitude, longitude, speed });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/driver/deliveries"] });
    },
  });
}

export function useAcceptDelivery() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiRequest("POST", `/api/driver/accept/${orderId}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/driver/deliveries"] });
    },
  });
}

export function useSetDriverAvailability() {
  return useMutation({
    mutationFn: async (isAvailable: boolean) => {
      const response = await apiRequest("PATCH", "/api/driver/availability", { isAvailable });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/driver/stats"] });
    },
  });
}

export function useDriverStats(driverId?: string) {
  return useQuery({
    queryKey: ["/api/driver/stats", driverId],
    enabled: !!driverId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useDeliveryTracking(orderId?: string) {
  return useQuery({
    queryKey: [`/api/delivery/${orderId}/tracking`, orderId],
    enabled: !!orderId,
    refetchInterval: 5000, // Real-time tracking
  });
}

export function useDriverHistory(driverId?: string) {
  return useQuery({
    queryKey: ["/api/driver/history", driverId],
    enabled: !!driverId,
  });
}
