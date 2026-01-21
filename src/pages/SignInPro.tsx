import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, Loader2 } from "lucide-react";
import { UserRole, RoleConfigurations } from "@/types/roles";
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import shopImage from '@assets/generated_images/welcoming_cannabis_shop_interior.png';
import driverImage from '@assets/generated_images/professional_delivery_driver.png';
import adminImage from '@assets/generated_images/admin_dashboard_analytics.png';

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const roleImages = {
  customer: shopImage,
  admin: adminImage,
  driver: driverImage,
};

export default function SignInPro() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);
  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormValues) {
    try {
      await login({ email: values.email, password: values.password });
      toast({
        title: "Welcome Back!",
        description: `Signed in successfully as ${RoleConfigurations[selectedRole].label}`,
      });
      
      // Redirect based on role
      if (selectedRole === UserRole.ADMIN) {
        setLocation("/admin");
      } else if (selectedRole === UserRole.DRIVER) {
        setLocation("/driver");
      } else {
        setLocation("/shop");
      }
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    }
  }

  const roleConfig = RoleConfigurations[selectedRole];
  const roleImage = roleImages[selectedRole];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-2 items-center">
        {/* Left - Image & Role Info */}
        <div className="hidden lg:flex flex-col justify-center items-center space-y-6">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full">
            <img
              src={roleImage}
              alt={roleConfig.label}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <h2 className="font-heading text-3xl font-bold mb-2">{roleConfig.label}</h2>
              <p className="text-lg text-white/90">{roleConfig.description}</p>
            </div>
          </div>

          {/* Role Features */}
          <Card className="w-full bg-muted/50">
            <CardContent className="pt-6 space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">Key Features:</p>
              <ul className="space-y-2">
                {roleConfig.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3 text-sm">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right - Form Section */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Leaf className="h-8 w-8 text-primary" />
                <span className="font-heading text-2xl font-bold">Mede-Mede Spot</span>
              </div>
              <div>
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>Choose your role and access your account</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Role Tabs */}
              <Tabs
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
                data-testid="tabs-signin-roles"
              >
                <TabsList className="grid w-full grid-cols-3">
                  {Object.values(UserRole).map((role) => (
                    <TabsTrigger key={role} value={role} data-testid={`tab-signin-${role}`}>
                      {RoleConfigurations[role].label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.values(UserRole).map((role) => (
                  <TabsContent key={role} value={role}>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@example.com"
                                  {...field}
                                  disabled={isLoggingIn}
                                  data-testid={`input-signin-email-${role}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your password"
                                  {...field}
                                  disabled={isLoggingIn}
                                  data-testid={`input-signin-password-${role}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full"
                          disabled={isLoggingIn}
                          data-testid={`button-signin-submit-${role}`}
                        >
                          {isLoggingIn ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            `Sign In as ${RoleConfigurations[role].label}`
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="border-t pt-6 space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-primary font-semibold hover:underline" data-testid="link-to-signup-pro">
                    Create one
                  </a>
                </p>

                <a href="/" className="block">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    data-testid="button-back-home"
                  >
                    Back to Home
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
