import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit, Tag, Percent, DollarSign } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

interface Coupon {
  id: number;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: string;
  minOrderAmount: string | null;
  maxDiscountAmount: string | null;
  usageLimit: number | null;
  usageCount: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
}

export function AdminCouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    usageLimit: "",
    endDate: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/coupons`, { credentials: "include" });
      if (res.ok) {
        setCoupons(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscountAmount: "",
      usageLimit: "",
      endDate: "",
      isActive: true,
    });
    setDialogOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditing(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType as "percentage" | "fixed",
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || "",
      maxDiscountAmount: coupon.maxDiscountAmount || "",
      usageLimit: coupon.usageLimit?.toString() || "",
      endDate: coupon.endDate ? coupon.endDate.slice(0, 10) : "",
      isActive: coupon.isActive,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!formData.code || !formData.discountValue) {
      toast({ title: "Error", description: "Code and discount value are required.", variant: "destructive" });
      return;
    }

    const body: Record<string, any> = {
      code: formData.code.toUpperCase().trim(),
      description: formData.description || undefined,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
    };
    if (formData.minOrderAmount) body.minOrderAmount = parseFloat(formData.minOrderAmount);
    if (formData.maxDiscountAmount) body.maxDiscountAmount = parseFloat(formData.maxDiscountAmount);
    if (formData.usageLimit) body.usageLimit = parseInt(formData.usageLimit);
    if (formData.endDate) body.endDate = formData.endDate;
    body.isActive = formData.isActive;

    const url = editing
      ? `${API_BASE}/api/admin/coupons/${editing.id}`
      : `${API_BASE}/api/admin/coupons`;
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast({ title: "Success", description: `Coupon ${editing ? "updated" : "created"} successfully.` });
        setDialogOpen(false);
        fetchCoupons();
      } else {
        const err = await res.json().catch(() => ({ message: "Failed" }));
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save coupon.", variant: "destructive" });
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/coupons/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast({ title: "Deleted", description: "Coupon deleted." });
        fetchCoupons();
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete coupon.", variant: "destructive" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Coupons & Discounts</h2>
          <p className="text-muted-foreground">Manage promotional codes for customers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" /> New Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Coupon Code</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  maxLength={50}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description (optional)</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 20% off all orders"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Discount Type</Label>
                  <Select value={formData.discountType} onValueChange={(v) => setFormData({ ...formData, discountType: v as "percentage" | "fixed" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (KES)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === "percentage" ? "20" : "5000"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Min Order Amount (KES)</Label>
                  <Input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Max Discount Cap (KES)</Label>
                  <Input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    placeholder="For % discounts"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Usage Limit</Label>
                  <Input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="Unlimited"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Expiry Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={(v) => setFormData({ ...formData, isActive: v })} />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSave} className="w-full">
                {editing ? "Update" : "Create"} Coupon
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No coupons yet. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="font-mono font-bold">{coupon.code}</span>
                      </div>
                      {coupon.description && (
                        <p className="text-xs text-muted-foreground mt-1">{coupon.description}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {coupon.discountType === "percentage" ? (
                          <Percent className="h-3 w-3 text-primary" />
                        ) : (
                          <DollarSign className="h-3 w-3 text-primary" />
                        )}
                        <span className="font-semibold">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `KES ${parseFloat(coupon.discountValue).toLocaleString()}`}
                        </span>
                      </div>
                      {coupon.maxDiscountAmount && (
                        <p className="text-xs text-muted-foreground">Cap: KES {parseFloat(coupon.maxDiscountAmount).toLocaleString()}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        {coupon.usageCount}
                      </span>
                      {coupon.usageLimit && (
                        <span className="text-muted-foreground"> / {coupon.usageLimit}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {coupon.minOrderAmount ? `KES ${parseFloat(coupon.minOrderAmount).toLocaleString()}` : "None"}
                    </TableCell>
                    <TableCell>
                      {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.isActive ? "default" : "secondary"}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(coupon)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
