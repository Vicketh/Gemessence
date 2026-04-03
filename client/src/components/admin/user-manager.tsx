import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Ban, 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  ShoppingBag,
  Eye,
  UserX,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  county?: string;
  isVerified: boolean;
  isAdmin: boolean;
  isSuspended: boolean;
  createdAt: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  avatar?: string;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    phone: "+254712345678",
    address: "123 Main St",
    city: "Nairobi",
    county: "Nairobi",
    isVerified: true,
    isAdmin: false,
    isSuspended: false,
    createdAt: "2024-01-15",
    lastLogin: "2024-03-15",
    totalOrders: 5,
    totalSpent: 125000,
  },
  {
    id: 2,
    username: "jane_smith",
    email: "jane@example.com",
    phone: "+254723456789",
    address: "456 Oak Ave",
    city: "Mombasa",
    county: "Mombasa",
    isVerified: true,
    isAdmin: false,
    isSuspended: false,
    createdAt: "2024-02-01",
    lastLogin: "2024-03-14",
    totalOrders: 3,
    totalSpent: 85000,
  },
  {
    id: 3,
    username: "mike_wilson",
    email: "mike@example.com",
    phone: "+254734567890",
    address: "789 Pine Rd",
    city: "Kisumu",
    county: "Kisumu",
    isVerified: false,
    isAdmin: false,
    isSuspended: true,
    createdAt: "2024-02-20",
    lastLogin: "2024-03-10",
    totalOrders: 1,
    totalSpent: 25000,
  }
];

const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-001",
    date: "2024-03-10",
    total: 45000,
    status: "Delivered",
    items: 2
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    date: "2024-03-05",
    total: 80000,
    status: "Processing",
    items: 1
  }
];

export function AdminUserManager() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "suspended">("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && !user.isSuspended) ||
                         (filterStatus === "suspended" && user.isSuspended);
    
    return matchesSearch && matchesFilter;
  });

  const handleSuspendUser = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isSuspended: !user.isSuspended } : user
    ));
  };

  const UserDetailsModal = ({ user }: { user: User }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {user.username}
          {user.isSuspended && <Badge variant="destructive">Suspended</Badge>}
          {user.isAdmin && <Badge className="bg-primary">Admin</Badge>}
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders ({user.totalOrders})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{user.address}</p>
                      <p className="text-sm text-muted-foreground">{user.city}, {user.county}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {user.lastLogin && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Login</p>
                      <p className="font-medium">{new Date(user.lastLogin).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="font-medium">{user.totalOrders}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary">KES</span>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="font-medium text-primary">KES {user.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={user.isSuspended ? "default" : "destructive"}>
                  {user.isSuspended ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Reactivate Account
                    </>
                  ) : (
                    <>
                      <UserX className="h-4 w-4 mr-2" />
                      Suspend Account
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {user.isSuspended ? "Reactivate" : "Suspend"} User Account
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {user.isSuspended 
                      ? `Are you sure you want to reactivate ${user.username}'s account? They will regain access to all features.`
                      : `Are you sure you want to suspend ${user.username}'s account? They will lose access to their account and won't be able to place orders.`
                    }
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleSuspendUser(user.id)}>
                    {user.isSuspended ? "Reactivate" : "Suspend"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{order.orderNumber}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()} • {order.items} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">KES {order.total.toLocaleString()}</p>
                    <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground">Activity tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-dual-accent">User Management</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{users.filter(u => !u.isSuspended).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold">{users.filter(u => u.isSuspended).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{users.filter(u => u.isVerified).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{user.username}</h3>
                      {user.isAdmin && <Badge className="bg-primary text-xs">Admin</Badge>}
                      {user.isVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>{user.totalOrders} orders</span>
                      <span>KES {user.totalSpent.toLocaleString()}</span>
                      <span>{user.city}, {user.county}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.isSuspended ? (
                    <Badge variant="destructive">Suspended</Badge>
                  ) : (
                    <Badge variant="default">Active</Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant={user.isSuspended ? "default" : "destructive"}
                        size="sm"
                      >
                        {user.isSuspended ? (
                          <UserCheck className="h-4 w-4" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {user.isSuspended ? "Reactivate" : "Suspend"} User
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {user.isSuspended 
                            ? `Reactivate ${user.username}'s account?`
                            : `Suspend ${user.username}'s account?`
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSuspendUser(user.id)}>
                          {user.isSuspended ? "Reactivate" : "Suspend"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        {selectedUser && <UserDetailsModal user={selectedUser} />}
      </Dialog>
    </div>
  );
}