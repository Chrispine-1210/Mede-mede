import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Zap } from "lucide-react";

export default function Events() {
  const { data: events = [] } = useQuery({
    queryKey: ["/api/events"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="font-heading text-4xl font-bold">Events & Promotions</h1>
            <p className="text-muted-foreground mt-2">Check out upcoming events and special occasions</p>
          </div>

          {events.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No events scheduled yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event: any) => (
                <Card key={event.id} className="overflow-hidden hover-elevate">
                  {event.imageUrl && (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="font-heading text-lg">{event.title}</CardTitle>
                      <Badge variant="outline" className="shrink-0 capitalize">
                        {event.eventType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(event.startDate).toLocaleDateString()}
                    </div>
                    {event.discount && (
                      <div className="flex items-center gap-2 text-sm font-medium text-accent">
                        <Zap className="h-4 w-4" />
                        {event.discount}% Discount
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
