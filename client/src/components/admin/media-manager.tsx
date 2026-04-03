import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Trash2, GripVertical, Save, Image as ImageIcon, Video, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CloudinaryUploader } from "@/components/ui/cloudinary-uploader";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getHeroSlides, upsertHeroSlide, deleteHeroSlide } from "@/lib/supabase";
import type { CloudinaryResult } from "@/lib/cloudinary";

interface Slide {
  id?: number;
  src: string;
  type: "image" | "video";
  title: string;
  subtitle: string;
  position: number;
}

export function AdminMediaManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSlide, setNewSlide] = useState<Partial<Slide>>({ title: "", subtitle: "", src: "", type: "image" });

  const { data: slides = [], isLoading } = useQuery<Slide[]>({
    queryKey: ["hero_slides"],
    queryFn: getHeroSlides,
  });

  const saveMutation = useMutation({
    mutationFn: (slide: Slide) => upsertHeroSlide(slide),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero_slides"] });
      toast({ title: "Slide saved", description: "Hero slide updated successfully." });
      setEditingSlide(null);
      setIsAdding(false);
      setNewSlide({ title: "", subtitle: "", src: "", type: "image" });
    },
    onError: () => toast({ title: "Error", description: "Failed to save slide.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteHeroSlide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero_slides"] });
      toast({ title: "Slide deleted" });
    },
  });

  const handleAddSlide = () => {
    if (!newSlide.src) { toast({ title: "Upload an image or video first", variant: "destructive" }); return; }
    saveMutation.mutate({
      ...newSlide,
      position: slides.length,
      type: newSlide.type || "image",
      title: newSlide.title || "",
      subtitle: newSlide.subtitle || "",
      src: newSlide.src!,
    } as Slide);
  };

  const handleEditSave = () => {
    if (!editingSlide) return;
    saveMutation.mutate(editingSlide);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-dual-accent">Media Manager</h2>
          <p className="text-sm text-muted-foreground">Manage hero slideshow images & videos. Changes appear live on the homepage.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Add Slide
        </Button>
      </div>

      {/* Hero Slides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" /> Hero Slideshow ({slides.length} slides)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-muted aspect-video rounded-lg" />)}
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No slides yet. Add your first hero slide.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slides.map((slide, index) => {
                const isVid = slide.type === "video" || slide.src?.match(/\.(mp4|webm|mov)$/i);
                return (
                  <motion.div key={slide.id ?? index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group relative">
                    <Card className="overflow-hidden">
                      <div className="relative aspect-video bg-muted">
                        {isVid ? (
                          <video src={slide.src} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">#{index + 1}</span>
                          {isVid ? (
                            <span className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><Video className="h-3 w-3" />Video</span>
                          ) : (
                            <span className="bg-green-600/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><ImageIcon className="h-3 w-3" />Image</span>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="icon" variant="secondary" onClick={() => setEditingSlide(slide)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Slide</AlertDialogTitle>
                                <AlertDialogDescription>Remove this slide from the hero slideshow?</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => slide.id && deleteMutation.mutate(slide.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <p className="font-medium text-sm truncate">{slide.title || "No title"}</p>
                        <p className="text-xs text-muted-foreground truncate">{slide.subtitle || "No subtitle"}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Slide Dialog */}
      <Dialog open={isAdding} onOpenChange={(o) => { if (!o) { setIsAdding(false); setNewSlide({ title: "", subtitle: "", src: "", type: "image" }); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Hero Slide</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <CloudinaryUploader
              folder="gemessence/hero"
              accept="image/*,video/*"
              label="Upload Image or Video for Hero Slide"
              preview={newSlide.src}
              onUpload={(r: CloudinaryResult) => setNewSlide(p => ({ ...p, src: r.secure_url, type: r.resource_type === "video" ? "video" : "image" }))}
            />
            <div className="space-y-2">
              <Label>Slide Title</Label>
              <Input placeholder="e.g. Royal Gold Collection" value={newSlide.title} onChange={e => setNewSlide(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Slide Subtitle</Label>
              <Input placeholder="e.g. Timeless elegance meets modern sophistication" value={newSlide.subtitle} onChange={e => setNewSlide(p => ({ ...p, subtitle: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button onClick={handleAddSlide} disabled={saveMutation.isPending} className="bg-primary">
                <Save className="h-4 w-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Add Slide"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Slide Dialog */}
      <Dialog open={!!editingSlide} onOpenChange={(o) => { if (!o) setEditingSlide(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Hero Slide</DialogTitle></DialogHeader>
          {editingSlide && (
            <div className="space-y-4">
              <CloudinaryUploader
                folder="gemessence/hero"
                accept="image/*,video/*"
                label="Replace Image or Video"
                preview={editingSlide.src}
                onUpload={(r: CloudinaryResult) => setEditingSlide(p => p ? { ...p, src: r.secure_url, type: r.resource_type === "video" ? "video" : "image" } : null)}
              />
              <div className="space-y-2">
                <Label>Slide Title</Label>
                <Input value={editingSlide.title} onChange={e => setEditingSlide(p => p ? { ...p, title: e.target.value } : null)} />
              </div>
              <div className="space-y-2">
                <Label>Slide Subtitle</Label>
                <Input value={editingSlide.subtitle} onChange={e => setEditingSlide(p => p ? { ...p, subtitle: e.target.value } : null)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSlide(null)}>Cancel</Button>
                <Button onClick={handleEditSave} disabled={saveMutation.isPending} className="bg-primary">
                  <Save className="h-4 w-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
