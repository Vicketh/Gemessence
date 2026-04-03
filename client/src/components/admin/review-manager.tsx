import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  User,
  Calendar,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Review {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  createdAt: string;
  isApproved: boolean;
  isFeatured: boolean;
  isVisible: boolean;
  adminResponse?: string;
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: 1,
    productId: 1,
    productName: "Royal Gold Chain Necklace",
    userId: 1,
    userName: "Sarah Johnson",
    userAvatar: "",
    rating: 5,
    title: "Absolutely stunning!",
    comment: "This necklace exceeded my expectations. The craftsmanship is incredible and it looks even better in person. I've received so many compliments!",
    images: [],
    createdAt: "2024-03-10",
    isApproved: true,
    isFeatured: true,
    isVisible: true,
  },
  {
    id: 2,
    productId: 2,
    productName: "Luxury Chain Bracelet",
    userId: 2,
    userName: "Michael Chen",
    userAvatar: "",
    rating: 4,
    title: "Great quality",
    comment: "Beautiful bracelet with excellent build quality. The gold finish is perfect and it feels substantial. Worth every penny.",
    images: [],
    createdAt: "2024-03-08",
    isApproved: true,
    isFeatured: false,
    isVisible: true,
  },
  {
    id: 3,
    productId: 1,
    productName: "Royal Gold Chain Necklace",
    userId: 3,
    userName: "Emma Wilson",
    userAvatar: "",
    rating: 5,
    title: "Perfect for special occasions",
    comment: "I bought this for my anniversary and it was perfect. The packaging was beautiful and the necklace is exactly as described. Highly recommend!",
    images: [],
    createdAt: "2024-03-05",
    isApproved: false,
    isFeatured: false,
    isVisible: true,
  },
  {
    id: 4,
    productId: 3,
    productName: "Artisan Gold Chain Set",
    userId: 4,
    userName: "David Brown",
    userAvatar: "",
    rating: 2,
    title: "Not as expected",
    comment: "The product looks different from the photos. The gold seems lighter than advertised.",
    images: [],
    createdAt: "2024-03-03",
    isApproved: false,
    isFeatured: false,
    isVisible: true,
  }
];

export function AdminReviewManager() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending" | "featured">("all");

  const filteredReviews = reviews.filter(review => {
    switch (filterStatus) {
      case "approved":
        return review.isApproved;
      case "pending":
        return !review.isApproved;
      case "featured":
        return review.isFeatured;
      default:
        return true;
    }
  });

  const handleApproveReview = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, isApproved: !review.isApproved } : review
    ));
  };

  const handleFeatureReview = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, isFeatured: !review.isFeatured } : review
    ));
  };

  const handleToggleVisibility = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, isVisible: !review.isVisible } : review
    ));
  };

  const handleDeleteReview = (reviewId: number) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const handleSaveAdminResponse = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, adminResponse } : review
    ));
    setAdminResponse("");
    setSelectedReview(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-primary text-primary' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const getStatusColor = (review: Review) => {
    if (!review.isApproved) return "destructive";
    if (review.isFeatured) return "default";
    return "secondary";
  };

  const getStatusText = (review: Review) => {
    if (!review.isApproved) return "Pending";
    if (review.isFeatured) return "Featured";
    return "Approved";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-dual-accent">Review Management</h2>
        <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{reviews.filter(r => r.isApproved).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{reviews.filter(r => !r.isApproved).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Featured</p>
                <p className="text-2xl font-bold">{reviews.filter(r => r.isFeatured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`${!review.isVisible ? 'opacity-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.userAvatar} />
                      <AvatarFallback>{review.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{review.userName}</h3>
                      <p className="text-sm text-muted-foreground">{review.productName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(review)}>
                      {getStatusText(review)}
                    </Badge>
                    {!review.isVisible && <Badge variant="outline">Hidden</Badge>}
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-medium mb-2">{review.title}</h4>
                )}
                
                <p className="text-muted-foreground mb-4">{review.comment}</p>

                {review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                {review.adminResponse && (
                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium mb-1">Admin Response:</p>
                    <p className="text-sm">{review.adminResponse}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={review.isApproved}
                        onCheckedChange={() => handleApproveReview(review.id)}
                      />
                      <Label className="text-sm">Approved</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={review.isFeatured}
                        onCheckedChange={() => handleFeatureReview(review.id)}
                        disabled={!review.isApproved}
                      />
                      <Label className="text-sm">Featured on Homepage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={review.isVisible}
                        onCheckedChange={() => handleToggleVisibility(review.id)}
                      />
                      <Label className="text-sm">Visible</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review);
                        setAdminResponse(review.adminResponse || "");
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Respond
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Review</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No reviews found</h3>
          <p className="text-muted-foreground">
            {filterStatus === "all" 
              ? "No reviews have been submitted yet."
              : `No ${filterStatus} reviews found.`
            }
          </p>
        </div>
      )}

      {/* Admin Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Respond to Review</h3>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Review by {selectedReview.userName}:</p>
              <p className="text-sm bg-muted p-2 rounded">{selectedReview.comment}</p>
            </div>
            <Textarea
              placeholder="Write your response..."
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              rows={4}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedReview(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleSaveAdminResponse(selectedReview.id)}>
                Save Response
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}