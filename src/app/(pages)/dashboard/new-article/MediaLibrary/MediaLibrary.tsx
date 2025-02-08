'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
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

const MAX_FILE_SIZE = 200 * 1024; // 200 KB in bytes

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onInsert, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [previews, setPreviews] = useState<ImageData[]>([]);
  const [selected, setSelected] = useState<ImageData | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInput.current?.click();
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
          bytes: file.size,
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
      toast.error('There was an error uploading your image. Please try again.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setWarning(null);

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      setWarning(
        `The following files exceed the 200 KB limit: ${invalidFiles.join(', ')}`
      );
      toast.error(`Some files exceed the 200 KB limit and were not uploaded.`);
    }

    const previewPromises = validFiles.map(loadImage);
    const loadedPreviews = await Promise.all(previewPromises);
    setPreviews(loadedPreviews);

    const uploadPromises = validFiles.map(uploadImage);
    const uploadImages = await Promise.all(uploadPromises);

    loadedPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setPreviews([]);
    setImages((prev) => [...uploadImages.filter(Boolean), ...prev]);
    setUploading(false);

    if (validFiles.length > 0) {
      toast.success(`Successfully uploaded ${validFiles.length} image(s).`);
    }
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
        toast.error('Failed to load images. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [toast]);

  return (
    <Card className="mx-auto flex h-[95vh] w-[90vw] max-w-5xl flex-col md:h-[90vh] md:w-[70vw]">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-6 py-3">
        <h2 className="text-xl font-medium">Assets</h2>
        <Button onClick={handleUploadClick} disabled={loading || uploading}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload'
          )}
        </Button>
      </CardHeader>

      {warning && (
        <Alert variant="destructive" className="mx-6 my-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      )}

      <CardContent className="flex-1 overflow-hidden p-0">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
        ) : (
          <MediaGallery
            data={[...previews, ...images]}
            onSelect={setSelected}
            selected={selected}
          />
        )}
      </CardContent>

      <CardFooter className="justify-end gap-4 px-6 py-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={!selected || loading || uploading}
          onClick={handleFinish}
        >
          Insert
        </Button>
      </CardFooter>

      <Input
        className="hidden"
        type="file"
        multiple
        accept="image/*"
        ref={fileInput}
        onChange={handleFileChange}
      />
    </Card>
  );
};

export default MediaLibrary;
