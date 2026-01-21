import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, BarChart3, Truck } from "lucide-react";
import { UserRole, RoleConfigurations } from "@/types/roles";

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  showDescriptions?: boolean;
}

const roleIcons = {
  customer: ShoppingBag,
  admin: BarChart3,
  driver: Truck,
};

export function RoleSelector({ selectedRole, onRoleChange, showDescriptions = true }: RoleSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Object.values(UserRole).map((role) => {
        const config = RoleConfigurations[role];
        const Icon = roleIcons[role];
        const isSelected = selectedRole === role;

        return (
          <Card
            key={role}
            className={`cursor-pointer transition-all ${
              isSelected
                ? 'border-primary bg-primary/5 ring-2 ring-primary'
                : 'hover-elevate'
            }`}
            onClick={() => onRoleChange(role)}
            data-testid={`role-card-${role}`}
          >
            <CardContent className="p-6 space-y-4">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                isSelected ? 'bg-primary/20' : 'bg-muted'
              }`}>
                <Icon className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>

              <div className="space-y-2">
                <h3 className="font-heading font-semibold">{config.label}</h3>
                {showDescriptions && (
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                )}
              </div>

              <ul className="space-y-1 text-xs text-muted-foreground">
                {config.features.slice(0, 2).map((feature) => (
                  <li key={feature.name} className="flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    {feature.name}
                  </li>
                ))}
              </ul>

              {isSelected && (
                <Button size="sm" className="w-full" data-testid={`button-role-selected-${role}`}>
                  Selected
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
