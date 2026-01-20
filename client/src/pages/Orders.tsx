import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Package, Truck, CheckCircle, Clock } from "lucide-react";
import type { Order, OrderItem } from "@shared/schema";

interface OrderWithItems extends Order {
  orderItems?: OrderItem[];
}

export default function Orders() {
  const { data: orders = [], isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
  });

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    },
    processing: {
      icon: Package,
      label: "Processing",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    out_for_delivery: {
      icon: Truck,
      label: "Out for Delivery",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    },
    completed: {
      icon: CheckCircle,
      label: "Completed",
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="font-heading text-4xl font-bold md:text-5xl">My Orders</h1>
            <p className="text-lg text-muted-foreground">
              Track your orders and view order history
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="font-heading text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground">Start shopping to place your first order</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6" data-testid="orders-list">
              {orders.map((order) => {
                const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = statusInfo.icon;

                return (
                  <Card key={order.id} className="hover-elevate" data-testid={`order-${order.id}`}>
                    <CardHeader>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <CardTitle className="font-heading text-xl">
                            Order #{order.id.slice(0, 8)}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt!).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge className={statusInfo.color} data-testid={`badge-status-${order.id}`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Items</h4>
                        <div className="space-y-2">
                          {order.orderItems?.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between rounded-md bg-muted/50 p-3"
                              data-testid={`order-item-${item.id}`}
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.productName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity}g × MWK {item.pricePerGram.toLocaleString()}
                                </p>
                              </div>
                              <p className="font-accent font-semibold">
                                MWK {item.subtotal.toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Delivery Location */}
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Delivery Location</p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-location-${order.id}`}>
                            {order.deliveryLocation}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Total */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-accent text-xl font-semibold text-accent" data-testid={`text-total-${order.id}`}>
                          MWK {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
