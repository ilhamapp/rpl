import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { ProductForm } from "@/components/ProductForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, PackageOpen, LayoutGrid, List } from "lucide-react";
import { type Product, type InsertProduct } from "@shared/schema";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { data: products, isLoading, error } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleCreate = async (data: InsertProduct) => {
    await createMutation.mutateAsync(data);
    setIsCreateOpen(false);
    toast({ title: "Product created", description: "Successfully added to inventory" });
  };

  const handleUpdate = async (data: InsertProduct) => {
    if (!editingProduct) return;
    await updateMutation.mutateAsync({ id: editingProduct.id, ...data });
    setEditingProduct(null);
    toast({ title: "Product updated", description: "Changes have been saved" });
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    await deleteMutation.mutateAsync(deletingProduct.id);
    setDeletingProduct(null);
    toast({ title: "Product deleted", description: "Item removed from inventory" });
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <PackageOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl leading-none">Inventory</h1>
              <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide uppercase">Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Create New Product</DialogTitle>
                  <DialogDescription>
                    Add a new item to your inventory catalog.
                  </DialogDescription>
                </DialogHeader>
                <ProductForm 
                  onSubmit={handleCreate} 
                  isLoading={createMutation.isPending} 
                  onCancel={() => setIsCreateOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-[400px] animate-pulse border border-border/40" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to load products</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              There was an error connecting to the server. Please try again later.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry Connection</Button>
          </div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-border rounded-3xl bg-white/50">
            <div className="p-6 bg-secondary rounded-full mb-6">
              <PackageOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="font-display text-2xl font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
              Your inventory is empty. Start by adding your first product to the catalog.
            </p>
            <Button size="lg" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground font-medium">
                Showing <span className="text-foreground font-bold">{products?.length}</span> products
              </p>
              <div className="flex items-center gap-2 p-1 bg-white border rounded-lg">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-secondary">
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-muted-foreground">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {products?.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={setEditingProduct}
                    onDelete={setDeletingProduct}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </main>

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Edit Product</DialogTitle>
            <DialogDescription>Make changes to product details below.</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              initialData={editingProduct}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold text-foreground">{deletingProduct?.name}</span> from your inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
