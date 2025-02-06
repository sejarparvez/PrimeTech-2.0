import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import MediaGallery from './MediaGallery';

interface MediaLibraryProps {
  onInsert?: (image: ImageData) => void;
  onClose?: () => void;
}

interface ImageData {
  id?: string;
  url: string;
  created_at?: string;
  bytes?: number;
  format: string;
  display_name: string;
  width: number;
  height: number;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onInsert, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [previews, setPreviews] = useState<ImageData[]>([]);
  const [selected, setSelected] = useState<ImageData | null>(null);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    setShowUploadConfirm(true);
  };

  const handleUploadConfirm = () => {
    setShowUploadConfirm(false);
    fileInput.current?.click();
  };

  const handleUploadCancel = () => {
    setShowUploadConfirm(false);
  };

  const loadImage = (file: File): Promise<ImageData> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        resolve({
          url,
          width: image.width,
          height: image.height,
          format: file.type.split('/')[1],
          display_name: file.name.split(/\.\w+$/)[0],
        });
      };
      image.src = url;
    });
  };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/dashboard/single-article/image', {
        method: 'POST',
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    const previewPromises = Array.from(files).map(loadImage);
    const loadedPreviews = await Promise.all(previewPromises);
    setPreviews(loadedPreviews);

    const uploadPromises = Array.from(files).map(uploadImage);
    const uploadImages = await Promise.all(uploadPromises);

    loadedPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setPreviews([]);
    setImages((prev) => [...uploadImages, ...prev]);
    setUploading(false);
  };

  const handleFinish = () => selected !== null && onInsert?.(selected);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/single-article/image');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="mx-auto flex h-[600px] max-h-[90vh] w-[90vw] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-lg">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-2xl font-bold text-foreground">Assets</h2>
        {!showUploadConfirm ? (
          <Button
            onClick={handleUploadClick}
            disabled={loading || uploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Alert className="p-2">
              <AlertDescription>
                Please avoid uploading unnecessary images and ensure copyright
                compliance.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleUploadConfirm}
              className="flex items-center gap-2"
            >
              Continue
            </Button>
            <Button
              variant="outline"
              onClick={handleUploadCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </header>

      <div className="h-[calc(100%-120px)] flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <MediaGallery
            data={[...previews, ...images]}
            onSelect={setSelected}
            selected={selected}
          />
        )}
      </div>

      <footer className="flex items-center justify-end gap-4 border-t border-border px-6 py-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleFinish}
          disabled={!selected || loading || uploading}
        >
          Insert
        </Button>
      </footer>

      <input
        className="hidden"
        type="file"
        multiple
        accept="image/*"
        ref={fileInput}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default MediaLibrary;
