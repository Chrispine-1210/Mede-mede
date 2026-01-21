import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useDriverDeliveries, useUpdateDriverLocation, useAcceptDelivery, useSetDriverAvailability, useDriverStats } from "@/hooks/useDriverAPI";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, CheckCircle, Truck } from "lucide-react";

export default function DriverDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);

  const { data: stats = {} } = useDriverStats(user?.id) as { data: any };
  const { data: deliveries = [] } = useDriverDeliveries(user?.id) as { data: any[] };

  const updateLocationMutation = useUpdateDriverLocation();
  const toggleAvailability = useSetDriverAvailability();
  const acceptDelivery = useAcceptDelivery();

  const handleUpdateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocationMutation.mutate({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
          speed: position.coords.speed || 0,
        });
      },
      (error) => {
        toast({ title: "Location error", description: "Could not get location", variant: "destructive" });
      }
    );
  };

  const startTracking = () => {
    setIsTrackingLocation(true);
    const interval = setInterval(() => {
      handleUpdateLocation();
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  };

  if (authLoading) return null;

  const availableDeliveries = deliveries.filter((d: any) => d.status === "pending");
  const activeDeliveries = deliveries.filter((d: any) => d.status === "out_for_delivery" || d.status === "assigned");
  const completedDeliveries = deliveries.filter((d: any) => d.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold">Driver Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {user?.firstName || "Driver"}</p>
            </div>
            <Button
              onClick={() => toggleAvailability.mutate(!stats.isAvailable)}
              variant={stats.isAvailable ? "destructive" : "default"}
              data-testid="button-toggle-availability"
            >
              {stats.isAvailable ? "Go Offline" : "Go Online"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Deliveries</p>
                    <p className="text-2xl font-bold">{stats.totalDeliveries || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Navigation className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Deliveries</p>
                    <p className="text-2xl font-bold">{activeDeliveries.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-2xl font-bold">{stats.averageRating || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Deliveries */}
          {activeDeliveries.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-2xl">Active Deliveries</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateLocation()}
                    data-testid="button-update-location"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Update Location
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeDeliveries.map((delivery: any) => (
                    <div key={delivery.id} className="flex items-center justify-between border-l-4 border-l-primary p-4 bg-card rounded-lg">
                      <div>
                        <h3 className="font-medium">Order #{delivery.id.slice(0, 8)}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" /> {delivery.deliveryLocation}
                        </p>
                        <p className="text-sm font-accent text-accent">MWK {delivery.totalAmount.toLocaleString()}</p>
                      </div>
                      <Badge>{delivery.status === "out_for_delivery" ? "In Transit" : "Assigned"}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Deliveries */}
          {availableDeliveries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Available Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableDeliveries.map((delivery: any) => (
                    <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                      <div>
                        <h3 className="font-medium">Order #{delivery.id.slice(0, 8)}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" /> {delivery.deliveryLocation}
                        </p>
                        <p className="text-sm font-accent text-accent">MWK {delivery.totalAmount.toLocaleString()}</p>
                      </div>
                      <Button
                        onClick={() => acceptDelivery.mutate(delivery.id)}
                        disabled={acceptDelivery.isPending}
                        data-testid={`button-accept-${delivery.id}`}
                      >
                        {acceptDelivery.isPending ? "Accepting..." : "Accept"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Deliveries */}
          {completedDeliveries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Completed Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedDeliveries.slice(0, 5).map((delivery: any) => (
                    <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                      <div>
                        <h3 className="font-medium">Order #{delivery.id.slice(0, 8)}</h3>
                        <p className="text-sm text-muted-foreground">MWK {delivery.totalAmount.toLocaleString()}</p>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
