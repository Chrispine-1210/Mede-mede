import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, TrendingUp, Award } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  bronze: "bg-yellow-600",
  silver: "bg-slate-400",
  gold: "bg-yellow-400",
  platinum: "bg-blue-400",
};

const TIER_BENEFITS: Record<string, string[]> = {
  bronze: ["1 point per MWK spent", "Birthday bonus"],
  silver: ["1.2 points per MWK spent", "5% discount", "Priority support"],
  gold: ["1.5 points per MWK spent", "10% discount", "Free delivery"],
  platinum: ["2 points per MWK spent", "15% discount", "VIP support"],
};

export default function Loyalty() {
  const { user, isLoading } = useAuth();
  const { data: account } = useQuery({
    queryKey: ["/api/loyalty"],
  });

  if (isLoading || !user) return null;

  const currentTier = account?.tier || "bronze";
  const points = account?.points || 0;
  const benefits = TIER_BENEFITS[currentTier] || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <h1 className="font-heading text-4xl font-bold">Loyalty Program</h1>

          {/* Current Status */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                    <p className="text-2xl font-bold">{points}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tier</p>
                    <p className="text-2xl font-bold capitalize">{currentTier}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lifetime Spent</p>
                    <p className="text-2xl font-bold">MWK {(account?.totalSpent || 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tier Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Your Tier Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Badge className={`${TIER_COLORS[currentTier]}`} variant="default">
                      ✓
                    </Badge>
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How to Earn */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">How to Earn Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Every Purchase</h3>
                  <p className="text-sm text-muted-foreground">Earn points equal to your order amount (varies by tier)</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Birthday Bonus</h3>
                  <p className="text-sm text-muted-foreground">Receive 100 bonus points during your birthday month</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Referrals</h3>
                  <p className="text-sm text-muted-foreground">Earn 50 points for each friend who makes their first order</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Redeem Points</h3>
                  <p className="text-sm text-muted-foreground">1000 points = MWK 500 discount on your next order</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
