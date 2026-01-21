// Customer-Specific API Hooks
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export function useCustomerCart(userId?: string) {
  return useQuery({
    queryKey: ["/api/cart", userId],
    enabled: !!userId,
  });
}

export function useAddToCart() {
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await apiRequest("POST", "/api/cart", { productId, quantity });
      return response.json();
    },
    onSuccess: (_, { quantity }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
}

export function useUpdateCartItem() {
  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const response = await apiRequest("PATCH", `/api/cart/${itemId}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
}

export function useRemoveFromCart() {
  return useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest("DELETE", `/api/cart/${itemId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async ({ deliveryLocation }: { deliveryLocation: string }) => {
      const response = await apiRequest("POST", "/api/orders", { deliveryLocation });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
}

export function useCustomerOrders(userId?: string) {
  return useQuery({
    queryKey: ["/api/orders", userId],
    enabled: !!userId,
  });
}

export function useCustomerLoyalty(userId?: string) {
  return useQuery({
    queryKey: ["/api/loyalty", userId],
    enabled: !!userId,
  });
}

export function useOrderTracking(orderId?: string) {
  return useQuery({
    queryKey: [`/api/delivery/${orderId}/tracking`, orderId],
    enabled: !!orderId,
    refetchInterval: 5000, // Real-time tracking
  });
}
