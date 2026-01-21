import { Minus, Plus, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  pricePerGram: number;
  quantity: number;
  imageUrl?: string;
}

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: (location: string) => void;
  deliveryLocation: string;
  setDeliveryLocation: (location: string) => void;
  isCheckingOut?: boolean;
}

export function CartSheet({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  deliveryLocation,
  setDeliveryLocation,
  isCheckingOut = false,
}: CartSheetProps) {
  const total = items.reduce((sum, item) => sum + item.pricePerGram * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg" data-testid="sheet-cart">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl">Shopping Cart</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? "Your cart is empty" : `${items.length} item(s) in cart`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
            <div className="text-6xl opacity-50">🛒</div>
            <p className="text-muted-foreground">Start shopping to add items</p>
            <Button onClick={onClose} data-testid="button-continue-shopping">
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border p-3 hover-elevate"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl">🌿</div>
                      )}
                    </div>
                    
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm" data-testid={`text-cart-item-name-${item.id}`}>
                          {item.productName}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => onRemoveItem(item.id)}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium" data-testid={`text-quantity-${item.id}`}>
                            {item.quantity}g
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="font-accent text-sm font-semibold" data-testid={`text-subtotal-${item.id}`}>
                          MWK {(item.pricePerGram * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter your delivery address in Area 25"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  data-testid="input-delivery-location"
                />
              </div>

              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="font-accent text-2xl text-accent" data-testid="text-cart-total">
                  MWK {total.toLocaleString()}
                </span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => onCheckout(deliveryLocation)}
                disabled={!deliveryLocation.trim() || isCheckingOut}
                data-testid="button-checkout"
              >
                {isCheckingOut ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
