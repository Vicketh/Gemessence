import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Save,
  X,
  Image as ImageIcon,
  Tag,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  imageUrl: string;
  images: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  metalType?: string;
  metalColor?: string;
  gemstoneType?: string;
  gemstoneWeight?: string;
  ringSizes?: string[];
  chainLength?: string;
  weight?: string;
  offer?: {
    title: string;
    discount: number;
    validUntil: string;
  };
}

const categories = ["Rings", "Necklaces", "Earrings", "Bracelets", "Engagement", "Wedding", "Sets"];
const metalTypes = ["14k Gold", "18k Gold", "Sterling Silver", "Platinum", "Rose Gold"];
const metalColors = ["Yellow", "White", "Rose"];
const gemstoneTypes = ["Diamond", "Ruby", "Sapphire", "Emerald", "Pearl", "Amethyst"];

export function AdminProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageUploadMethod, setImageUploadMethod] = useState<"upload" | "url">("upload");

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    imageUrl: "",
    images: [],
    category: "",
    featured: false,
    inStock: true,
    stockQuantity: 0,
    sku: "",
    metalType: "",
    metalColor: "",
    gemstoneType: "",
    gemstoneWeight: "",
    ringSizes: [],
    chainLength: "",
    weight: ""
  });

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you'd upload to a cloud service
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...imageUrls],
        imageUrl: prev.imageUrl || imageUrls[0]
      }));
    }
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...formData, id: editingProduct.id } as Product : p));
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        ...formData,
        id: Date.now(),
      } as Product;
      setProducts(prev => [...prev, newProduct]);
      setIsAddingProduct(false);
    }
    resetForm();
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleEditProduct = (product: Product) => {
    setFormData(product);
    setEditingProduct(product);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      compareAtPrice: "",
      imageUrl: "",
      images: [],
      category: "",
      featured: false,
      inStock: true,
      stockQuantity: 0,
      sku: "",
      metalType: "",
      metalColor: "",
      gemstoneType: "",
      gemstoneWeight: "",
      ringSizes: [],
      chainLength: "",
      weight: ""
    });
  };

  const ProductForm = () => (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Product SKU"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (KES)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="compareAtPrice">Compare Price (KES)</Label>
              <Input
                id="compareAtPrice"
                type="number"
                value={formData.compareAtPrice}
                onChange={(e) => handleInputChange("compareAtPrice", e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => handleInputChange("stockQuantity", parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-4 pt-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange("featured", checked)}
                />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.inStock}
                  onCheckedChange={(checked) => handleInputChange("inStock", checked)}
                />
                <Label>In Stock</Label>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Product Images</Label>
            <Tabs value={imageUploadMethod} onValueChange={(value) => setImageUploadMethod(value as "upload" | "url")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Files</TabsTrigger>
                <TabsTrigger value="url">Image URL</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload images</p>
                  </label>
                </div>
              </TabsContent>
              
              <TabsContent value="url">
                <Input
                  placeholder="Enter image URL"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                />
              </TabsContent>
            </Tabs>

            {/* Image Preview */}
            {(formData.images?.length || formData.imageUrl) && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {formData.images?.map((img, index) => (
                  <img key={index} src={img} alt={`Product ${index + 1}`} className="w-full h-20 object-cover rounded" />
                ))}
                {formData.imageUrl && !formData.images?.includes(formData.imageUrl) && (
                  <img src={formData.imageUrl} alt="Product" className="w-full h-20 object-cover rounded" />
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="metalType">Metal Type</Label>
              <Select value={formData.metalType} onValueChange={(value) => handleInputChange("metalType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metal type" />
                </SelectTrigger>
                <SelectContent>
                  {metalTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="metalColor">Metal Color</Label>
              <Select value={formData.metalColor} onValueChange={(value) => handleInputChange("metalColor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metal color" />
                </SelectTrigger>
                <SelectContent>
                  {metalColors.map(color => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gemstoneType">Gemstone Type</Label>
              <Select value={formData.gemstoneType} onValueChange={(value) => handleInputChange("gemstoneType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gemstone" />
                </SelectTrigger>
                <SelectContent>
                  {gemstoneTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gemstoneWeight">Gemstone Weight (carats)</Label>
              <Input
                id="gemstoneWeight"
                value={formData.gemstoneWeight}
                onChange={(e) => handleInputChange("gemstoneWeight", e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="chainLength">Chain Length</Label>
              <Input
                id="chainLength"
                value={formData.chainLength}
                onChange={(e) => handleInputChange("chainLength", e.target.value)}
                placeholder="e.g., 18 inches"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (grams)</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="0.0"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="offerTitle">Offer Title</Label>
              <Input
                id="offerTitle"
                value={formData.offer?.title || ""}
                onChange={(e) => handleInputChange("offer", { ...formData.offer, title: e.target.value })}
                placeholder="Special Offer"
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={formData.offer?.discount || ""}
                onChange={(e) => handleInputChange("offer", { ...formData.offer, discount: parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="validUntil">Valid Until</Label>
            <Input
              id="validUntil"
              type="date"
              value={formData.offer?.validUntil || ""}
              onChange={(e) => handleInputChange("offer", { ...formData.offer, validUntil: e.target.value })}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => {
          setIsAddingProduct(false);
          setEditingProduct(null);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={handleSaveProduct} className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Save Product
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-dual-accent">Product Management</h2>
        <Button onClick={() => setIsAddingProduct(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddingProduct || !!editingProduct} onOpenChange={(open) => {
        if (!open) {
          setIsAddingProduct(false);
          setEditingProduct(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm />
        </DialogContent>
      </Dialog>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {product.featured && (
                    <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-primary">
                      KES {parseFloat(product.price).toLocaleString()}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        KES {parseFloat(product.compareAtPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                {product.offer && (
                  <div className="mt-2 p-2 bg-red-accent/10 rounded text-sm">
                    <span className="font-medium text-red-accent">
                      {product.offer.title} - {product.offer.discount}% OFF
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No products yet</h3>
          <p className="text-muted-foreground mb-4">Start by adding your first product</p>
          <Button onClick={() => setIsAddingProduct(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      )}
    </div>
  );
}