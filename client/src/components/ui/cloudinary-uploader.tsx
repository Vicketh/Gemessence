import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadToCloudinary, type CloudinaryResult } from "@/lib/cloudinary";

interface CloudinaryUploaderProps {
  onUpload: (result: CloudinaryResult) => void;
  onMultiUpload?: (results: CloudinaryResult[]) => void;
  folder?: string;
  accept?: string;
  multiple?: boolean;
  label?: string;
  preview?: string;
  className?: string;
}

export function CloudinaryUploader({
  onUpload,
  onMultiUpload,
  folder = "gemessence",
  accept = "image/*,video/*",
  multiple = false,
  label = "Upload Image or Video",
  preview,
  className = "",
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(preview || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      if (multiple && onMultiUpload) {
        const results: CloudinaryResult[] = [];
        for (let i = 0; i < files.length; i++) {
          const result = await uploadToCloudinary(files[i], folder, (pct) => {
            setProgress(Math.round(((i + pct / 100) / files.length) * 100));
          });
          results.push(result);
        }
        onMultiUpload(results);
        if (results[0]) setLocalPreview(results[0].secure_url);
      } else {
        const result = await uploadToCloudinary(files[0], folder, setProgress);
        onUpload(result);
        setLocalPreview(result.secure_url);
      }
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const isVideo = localPreview && (localPreview.includes("/video/") || localPreview.match(/\.(mp4|webm|mov)$/i));

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading to Cloudinary...</p>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-primary font-medium">{progress}%</p>
          </div>
        ) : localPreview ? (
          <div className="relative">
            {isVideo ? (
              <video src={localPreview} className="max-h-48 mx-auto rounded-lg object-cover" controls />
            ) : (
              <img src={localPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
            )}
            <p className="text-xs text-muted-foreground mt-2">Click to replace</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">Drag & drop or click to browse</p>
            <p className="text-xs text-muted-foreground">Images & videos supported</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
          <X className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
