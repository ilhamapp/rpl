import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import CurrencyInput from 'react-currency-input-field';

interface ProductFormProps {
  initialData?: InsertProduct;
  onSubmit: (data: InsertProduct) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function ProductForm({ initialData, onSubmit, isLoading, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "",
    },
  });

  const handleSubmit = async (data: InsertProduct) => {
    try {
      await onSubmit(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input 
          id="name" 
          placeholder="e.g. Minimalist Chair"
          className="bg-background"
          {...form.register("name")} 
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <CurrencyInput
            id="price"
            name="price"
            placeholder="0.00"
            defaultValue={initialData ? initialData.price / 100 : 0}
            decimalsLimit={2}
            prefix="$"
            onValueChange={(_value, _name, values) => {
              // Convert to cents
              const cents = values?.float ? Math.round(values.float * 100) : 0;
              form.setValue("price", cents);
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {form.formState.errors.price && (
            <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input 
            id="stock" 
            type="number"
            {...form.register("stock", { valueAsNumber: true })} 
          />
          {form.formState.errors.stock && (
            <p className="text-sm text-destructive">{form.formState.errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Describe your product..."
          className="min-h-[100px] resize-none"
          {...form.register("description")} 
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
        <Input 
          id="imageUrl" 
          placeholder="https://..."
          {...form.register("imageUrl")} 
        />
        <p className="text-xs text-muted-foreground">Leave empty for a placeholder</p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
