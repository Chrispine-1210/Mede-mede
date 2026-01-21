import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, Check, Loader2 } from "lucide-react";
import { RoleSelector } from "@/components/RoleSelector";
import { UserRole } from "@/types/roles";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import appImage from '@assets/generated_images/user_enjoying_mobile_app.png';

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be valid"),
  location: z.string().min(1, "Please select your location"),
  role: z.enum(["customer", "admin", "driver"], {
    errorMap: () => ({ message: "Please select your account type" }),
  }),
  businessName: z.string().optional(),
  licenseNumber: z.string().optional(),
  vehicleNumber: z.string().optional(),
  driverLicenseNumber: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [, setLocation] = useLocation();
  const { register, isRegistering } = useAuth();
  const { toast } = useToast();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      role: "customer",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      await register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
        phoneNumber: values.phone,
        vehicleNumber: values.vehicleNumber,
        driverLicenseNumber: values.driverLicenseNumber,
      });
      
      toast({
        title: "Account Created!",
        description: "Welcome to Mede-Mede Spot. You're now signed in.",
      });

      // Redirect based on role
      if (values.role === "admin") {
        setLocation("/admin");
      } else if (values.role === "driver") {
        setLocation("/driver");
      } else {
        setLocation("/shop");
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-2 items-center">
        {/* Left - Image Section */}
        <div className="hidden lg:flex flex-col justify-center items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={appImage} 
              alt="Join Mede-Mede Spot"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <h2 className="font-heading text-3xl font-bold mb-2">Join Our Community</h2>
              <p className="text-lg text-white/90">Start as a customer, seller, or driver</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 space-y-3 w-full">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground">Premium quality products</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground">Fast delivery in Area 25</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground">Earn as a driver or seller</span>
            </div>
          </div>
        </div>

        {/* Right - Form Section */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="space-y-4 pb-6 sticky top-0 bg-card z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Leaf className="h-8 w-8 text-primary" />
                <span className="font-heading text-2xl font-bold">Mede-Mede Spot</span>
              </div>
              <div>
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>Choose your role and join our platform</CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose Your Role</FormLabel>
                        <FormControl>
                          <RoleSelector
                            selectedRole={field.value as UserRole}
                            onRoleChange={field.onChange}
                            showDescriptions={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                              disabled={isRegistering}
                              data-testid="input-signup-firstname"
                            />
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
                            <Input
                              placeholder="Doe"
                              {...field}
                              disabled={isRegistering}
                              data-testid="input-signup-lastname"
                            />
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
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                            disabled={isRegistering}
                            data-testid="input-signup-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+265 1 23 456 789"
                            {...field}
                            disabled={isRegistering}
                            data-testid="input-signup-phone"
                          />
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
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isRegistering}>
                          <FormControl>
                            <SelectTrigger data-testid="select-signup-location">
                              <SelectValue placeholder="Select your area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="area25">Area 25</SelectItem>
                            <SelectItem value="lilongwe-central">Lilongwe Central</SelectItem>
                            <SelectItem value="lilongwe-south">Lilongwe South</SelectItem>
                            <SelectItem value="lilongwe-north">Lilongwe North</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Role-Specific Fields */}
                  {form.watch('role') === 'admin' && (
                    <>
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your business name" 
                                {...field} 
                                disabled={isRegistering}
                                data-testid="input-signup-businessname" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="licenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Business license" 
                                {...field} 
                                disabled={isRegistering}
                                data-testid="input-signup-licensenumber" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {form.watch('role') === 'driver' && (
                    <>
                      <FormField
                        control={form.control}
                        name="vehicleNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., MZ AB 1234" 
                                {...field} 
                                disabled={isRegistering}
                                data-testid="input-signup-vehiclenumber" 
                              />
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
                              <Input 
                                placeholder="License number" 
                                {...field} 
                                disabled={isRegistering}
                                data-testid="input-signup-drivelicense" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="At least 6 characters"
                            {...field}
                            disabled={isRegistering}
                            data-testid="input-signup-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                            disabled={isRegistering}
                            data-testid="input-signup-confirmpassword"
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
                    disabled={isRegistering}
                    data-testid="button-signup-submit"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 space-y-4 border-t pt-6">
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a href="/signin" className="text-primary font-semibold hover:underline" data-testid="link-to-signin">
                    Sign in
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
