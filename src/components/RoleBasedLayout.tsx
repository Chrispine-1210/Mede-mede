import { useAuth } from "@/hooks/useAuth";
import { RoleService, UserRole } from "@/types/roles";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RoleBasedLayoutProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: { action: string; resource: string };
  fallback?: React.ReactNode;
}

export function RoleBasedLayout({
  children,
  requiredRole,
  requiredPermission,
  fallback,
}: RoleBasedLayoutProps) {
  const { user, isAuthenticated } = useAuth();

  // Check authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to be signed in to access this page.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check required role
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This page is only for {RoleService.getConfig(requiredRole).label}s.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check permission
  if (
    requiredPermission &&
    !RoleService.hasPermission(user.role as UserRole, requiredPermission.action, requiredPermission.resource)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access this feature.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}
