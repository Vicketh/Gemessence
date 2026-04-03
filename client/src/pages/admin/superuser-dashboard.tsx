import { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield, Users, Settings, Phone, CreditCard,
  UserPlus, UserMinus, Save, RefreshCw, MessageCircle,
  Key, Globe, Smartphone
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function SuperUserDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: admins = [], isLoading: adminsLoading } = useQuery<any[]>({
    queryKey: ["/api/superuser/admins"],
    queryFn: async () => {
      const res = await fetch("/api/superuser/admins");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: settings = {}, isLoading: settingsLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/superuser/settings"],
    queryFn: async () => {
      const res = await fetch("/api/superuser/settings");
      if (!res.ok) return {};
      return res.json();
    },
  });

  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [promoteUsername, setPromoteUsername] = useState("");

  const mergedSettings = { ...settings, ...settingsForm };

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await fetch("/api/superuser/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/settings"] });
      setSettingsForm({});
      toast({ title: "Settings saved", description: "App settings updated successfully." });
    },
    onError: () => toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" }),
  });

  const promoteAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`/api/superuser/admins/${userId}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to promote");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/admins"] });
      toast({ title: "Admin promoted", description: "User has been granted admin access." });
    },
  });

  const demoteAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`/api/superuser/admins/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to demote");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/admins"] });
      toast({ title: "Admin removed", description: "Admin access has been revoked." });
    },
  });

  const handleSettingChange = (key: string, value: string) => {
    setSettingsForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    if (Object.keys(settingsForm).length === 0) {
      toast({ title: "No changes", description: "No settings were modified." });
      return;
    }
    saveSettingsMutation.mutate(settingsForm);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-dual-accent">Superuser Dashboard</h1>
            <p className="text-muted-foreground text-sm">Full system control — manage admins, settings, and integrations</p>
          </div>
        </div>

        <Tabs defaultValue="admins" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="admins"><Users className="h-4 w-4 mr-2" />Admin Management</TabsTrigger>
            <TabsTrigger value="integrations"><Globe className="h-4 w-4 mr-2" />Integrations</TabsTrigger>
            <TabsTrigger value="security"><Key className="h-4 w-4 mr-2" />Security & Config</TabsTrigger>
          </TabsList>

          {/* ADMIN MANAGEMENT */}
          <TabsContent value="admins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" /> Promote User to Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Input
                  placeholder="Enter username to promote"
                  value={promoteUsername}
                  onChange={(e) => setPromoteUsername(e.target.value)}
                  className="max-w-xs"
                />
                <Button
                  onClick={() => {
                    const admin = admins.find((a: any) => a.username === promoteUsername);
                    if (admin) promoteAdminMutation.mutate(admin.id);
                    else toast({ title: "User not found", variant: "destructive" });
                  }}
                  disabled={!promoteUsername}
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Promote
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Admins ({admins.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {adminsLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" /> Loading admins...
                  </div>
                ) : admins.length === 0 ? (
                  <p className="text-muted-foreground">No admins found.</p>
                ) : (
                  <div className="space-y-3">
                    {admins.map((admin: any) => (
                      <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {admin.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{admin.username}</p>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {admin.isSuperUser && <Badge className="bg-primary">Superuser</Badge>}
                          <Badge variant="outline">Admin</Badge>
                          {!admin.isSuperUser && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <UserMinus className="h-4 w-4 mr-1" /> Demote
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Admin Access</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Remove admin privileges from {admin.username}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => demoteAdminMutation.mutate(admin.id)}>
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* INTEGRATIONS */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-500" /> WhatsApp Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>WhatsApp Phone Number</Label>
                  <Input
                    placeholder="+254797534189"
                    value={mergedSettings.whatsapp_number ?? ""}
                    onChange={(e) => handleSettingChange("whatsapp_number", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Include country code, e.g. +254712345678</p>
                </div>
                <div className="space-y-2">
                  <Label>Default WhatsApp Message</Label>
                  <Input
                    placeholder="Hello! I'm interested in your jewelry collection."
                    value={mergedSettings.whatsapp_message ?? ""}
                    onChange={(e) => handleSettingChange("whatsapp_message", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" /> M-Pesa Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>M-Pesa Business Shortcode</Label>
                    <Input
                      placeholder="174379"
                      value={mergedSettings.mpesa_shortcode ?? ""}
                      onChange={(e) => handleSettingChange("mpesa_shortcode", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>M-Pesa Consumer Key</Label>
                    <Input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={mergedSettings.mpesa_consumer_key ?? ""}
                      onChange={(e) => handleSettingChange("mpesa_consumer_key", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>M-Pesa Consumer Secret</Label>
                    <Input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={mergedSettings.mpesa_consumer_secret ?? ""}
                      onChange={(e) => handleSettingChange("mpesa_consumer_secret", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>M-Pesa Passkey</Label>
                    <Input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={mergedSettings.mpesa_passkey ?? ""}
                      onChange={(e) => handleSettingChange("mpesa_passkey", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-500" /> Card Payment (Stripe)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stripe Publishable Key</Label>
                    <Input
                      placeholder="pk_live_..."
                      value={mergedSettings.stripe_publishable_key ?? ""}
                      onChange={(e) => handleSettingChange("stripe_publishable_key", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stripe Secret Key</Label>
                    <Input
                      type="password"
                      placeholder="sk_live_..."
                      value={mergedSettings.stripe_secret_key ?? ""}
                      onChange={(e) => handleSettingChange("stripe_secret_key", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={saveSettingsMutation.isPending} className="gold-glow">
                <Save className="h-4 w-4 mr-2" />
                {saveSettingsMutation.isPending ? "Saving..." : "Save All Settings"}
              </Button>
            </div>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" /> Store Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Store Name</Label>
                    <Input
                      placeholder="Gemessence"
                      value={mergedSettings.store_name ?? ""}
                      onChange={(e) => handleSettingChange("store_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input
                      placeholder="support@gemessence.co.ke"
                      value={mergedSettings.support_email ?? ""}
                      onChange={(e) => handleSettingChange("support_email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Phone</Label>
                    <Input
                      placeholder="+254797534189"
                      value={mergedSettings.support_phone ?? ""}
                      onChange={(e) => handleSettingChange("support_phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <Input
                      placeholder="KES"
                      value={mergedSettings.default_currency ?? ""}
                      onChange={(e) => handleSettingChange("default_currency", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Shield className="h-5 w-5" /> Superuser Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                  <p><span className="text-muted-foreground">Username:</span> <span className="text-primary font-bold">superuser</span></p>
                  <p><span className="text-muted-foreground">Password:</span> <span className="text-primary font-bold">GemSuper@2025!</span></p>
                  <p><span className="text-muted-foreground">URL:</span> <span className="text-primary">/admin</span></p>
                </div>
                <p className="text-xs text-muted-foreground">⚠️ Change this password after first login by updating the ADMIN_PASSWORD env variable.</p>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={saveSettingsMutation.isPending} className="gold-glow">
                <Save className="h-4 w-4 mr-2" />
                {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
