import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Phone, Mail, DollarSign, MessageSquare, Store, Building2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

interface Settings {
  store_name: string;
  support_email: string;
  support_phone: string;
  whatsapp_number: string;
  whatsapp_message: string;
  default_currency: string;
  mpesa_till_number: string;
  mpesa_business_number: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_branch: string;
}

const DEFAULT_SETTINGS: Settings = {
  store_name: "Gemessence",
  support_email: "support@gemessence.co.ke",
  support_phone: "+254797534189",
  whatsapp_number: "+254797534189",
  whatsapp_message: "Hello! I'm interested in your jewelry collection.",
  default_currency: "KES",
  mpesa_till_number: "",
  mpesa_business_number: "",
  bank_name: "",
  bank_account_name: "",
  bank_account_number: "",
  bank_branch: "",
};

export function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast({ title: "Settings saved", description: "Your settings have been updated successfully." });
      } else {
        toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function update(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Manage your store and payment settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      {/* Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" /> Store Settings
          </CardTitle>
          <CardDescription>Basic store information displayed to customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="store_name">Store Name</Label>
            <Input id="store_name" value={settings.store_name} onChange={(e) => update("store_name", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="support_email">Support Email</Label>
            <Input id="support_email" type="email" value={settings.support_email} onChange={(e) => update("support_email", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="support_phone">Support Phone</Label>
            <Input id="support_phone" value={settings.support_phone} onChange={(e) => update("support_phone", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="default_currency">Default Currency</Label>
            <Input id="default_currency" value={settings.default_currency} onChange={(e) => update("default_currency", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> WhatsApp Settings
          </CardTitle>
          <CardDescription>Configure the WhatsApp floating button</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
            <Input id="whatsapp_number" value={settings.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsapp_message">Default Message</Label>
            <Textarea id="whatsapp_message" value={settings.whatsapp_message} onChange={(e) => update("whatsapp_message", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* M-Pesa Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" /> M-Pesa Payment Details
          </CardTitle>
          <CardDescription>Displayed to customers during checkout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="mpesa_till_number">Till Number (Buy Goods)</Label>
            <Input id="mpesa_till_number" placeholder="e.g. 123456" value={settings.mpesa_till_number} onChange={(e) => update("mpesa_till_number", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mpesa_business_number">Paybill Number (Pay Bill)</Label>
            <Input id="mpesa_business_number" placeholder="e.g. 654321" value={settings.mpesa_business_number} onChange={(e) => update("mpesa_business_number", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Bank Transfer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Bank Transfer Details
          </CardTitle>
          <CardDescription>Displayed to customers who choose bank transfer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="bank_name">Bank Name</Label>
            <Input id="bank_name" placeholder="e.g. Kenya Commercial Bank" value={settings.bank_name} onChange={(e) => update("bank_name", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bank_account_name">Account Name</Label>
            <Input id="bank_account_name" placeholder="e.g. Gemessence Ltd" value={settings.bank_account_name} onChange={(e) => update("bank_account_name", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bank_account_number">Account Number</Label>
            <Input id="bank_account_number" placeholder="e.g. 1234567890" value={settings.bank_account_number} onChange={(e) => update("bank_account_number", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bank_branch">Branch</Label>
            <Input id="bank_branch" placeholder="e.g. Nairobi CBD" value={settings.bank_branch} onChange={(e) => update("bank_branch", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
