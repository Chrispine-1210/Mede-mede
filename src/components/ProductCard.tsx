import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  isAddingToCart?: boolean;
}

export function ProductCard({ product, onAddToCart, isAddingToCart }: ProductCardProps) {
  const strainColors: Record<string, string> = {
    Indica: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    Sativa: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Hybrid: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  };

  return (
    <Card 
      className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]" 
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-6xl">🌿</div>
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-xl font-medium text-card-foreground line-clamp-1" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h3>
            <Badge 
              className={`${strainColors[product.strainType] || strainColors.Hybrid} shrink-0`}
              data-testid={`badge-strain-${product.id}`}
            >
              {product.strainType}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="font-accent text-2xl font-semibold text-accent" data-testid={`text-price-${product.id}`}>
              MWK {product.pricePerGram?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-muted-foreground">per gram</p>
          </div>
          
          <Button
            size="icon"
            onClick={() => onAddToCart(product.id)}
            disabled={!product.isAvailable || isAddingToCart}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        
        {product.isAvailable && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            {product.stockQuantity} grams available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
