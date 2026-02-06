import { type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit2, Trash2, Package } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-xl hover:border-border transition-all duration-300 overflow-hidden"
    >
      {/* Image Area */}
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center bg-secondary/30 text-muted-foreground ${product.imageUrl ? 'hidden' : ''}`}>
          <Package className="w-12 h-12 opacity-20" />
        </div>
        
        {/* Quick Actions Overlay */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur shadow-sm">
                <MoreHorizontal className="h-4 w-4 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit2 className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(product)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-display font-semibold text-lg leading-tight line-clamp-1">{product.name}</h3>
          <span className="font-mono font-medium text-lg whitespace-nowrap">
            {formatCurrency(product.price)}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
            <Package className="w-3 h-3" />
            <span>{product.stock} in stock</span>
          </div>
          
          <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
        </div>
      </div>
    </motion.div>
  );
}
