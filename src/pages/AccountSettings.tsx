import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, MapPin, Phone, Truck, Key } from "lucide-react";

const accountSettingsSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  location: z.string().min(1, "Location required"),
  vehicleNumber: z.string().optional(),
  driverLicenseNumber: z.string().optional(),
});

type AccountSettingsFormValues = z.infer<typeof accountSettingsSchema>;

export default function AccountSettings() {
  const { user, isDriver, isAdmin, isCustomer } = useAuth();

  const form = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      location: "",
      vehicleNumber: user?.vehicleNumber || "",
      driverLicenseNumber: user?.driverLicenseNumber || "",
    },
  });

  async function onSubmit(values: AccountSettingsFormValues) {
    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        alert("Settings updated successfully!");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile and account preferences
          </p>
        </div>

        {/* Basic Profile */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-settings-firstname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-settings-lastname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" disabled {...field} data-testid="input-settings-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} data-testid="input-settings-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your area" {...field} data-testid="input-settings-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isDriver && (
                  <>
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        Driver Information
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="vehicleNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., MZ AB 1234" {...field} data-testid="input-settings-vehicle" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="driverLicenseNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Driver License Number</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-settings-license" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" data-testid="button-settings-save">
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" data-testid="button-settings-password">
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Role-Specific Info */}
        {isCustomer && (
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program</CardTitle>
              <CardDescription>Earn points on every purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Current Points</p>
                  <p className="text-2xl font-bold text-primary">{user?.loyaltyPoints || 0}</p>
                </div>
                <div className="p-4 bg-secondary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Tier</p>
                  <p className="text-2xl font-bold text-secondary capitalize">{user?.loyaltyTier || "bronze"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isDriver && (
          <Card>
            <CardHeader>
              <CardTitle>Delivery Stats</CardTitle>
              <CardDescription>Your performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="text-2xl font-bold text-primary">{user?.totalDeliveries || 0}</p>
                </div>
                <div className="p-4 bg-secondary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold text-secondary">{user?.averageRating || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
