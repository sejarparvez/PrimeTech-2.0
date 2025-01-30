'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

interface ProductImageProps {
  image: string | null;
  deletedImage: string | null;
  handleAddNewImage: (file: File, url: string) => void;
  handleDeleteImage: (url: string) => void;
}

const MAX_IMAGE_SIZE_KB = 900;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function EditArticleImage({
  image,
  deletedImage,
  handleAddNewImage,
  handleDeleteImage,
}: ProductImageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.size > MAX_IMAGE_SIZE_KB * 1024) {
        toast.error(
          `Image size exceeds the maximum limit of ${MAX_IMAGE_SIZE_KB} KB`
        );
        return;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = URL.createObjectURL(file);
        const img = document.createElement('img');
        img.onload = () => {
          handleAddNewImage(file, imageUrl);
          setLocalImageUrl(imageUrl);
          setIsLoading(false);
        };
        img.onerror = () => {
          toast.error('Failed to load image. Please try again.');
          setIsLoading(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [handleAddNewImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDeleteClick = useCallback(() => {
    if (image) {
      handleDeleteImage(image);
    }
    setLocalImageUrl(null);
  }, [image, handleDeleteImage]);

  const displayImage =
    localImageUrl || (image && deletedImage !== image ? image : null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Product Image
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </CardTitle>
          <CardDescription>
            Upload a product image. Maximum file size is {MAX_IMAGE_SIZE_KB} KB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'grid gap-2',
              isDragging && 'border-2 border-dashed border-primary'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {displayImage ? (
              <div className="relative w-full">
                <Image
                  alt="Product image"
                  className="aspect-square h-60 w-full rounded-md object-cover"
                  height={300}
                  src={displayImage}
                  width={300}
                />
                <Button
                  variant="destructive"
                  className="absolute right-1 top-1 scale-75 rounded-full"
                  size="icon"
                  type="button"
                  onClick={handleDeleteClick}
                  aria-label="Delete image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                className={cn(
                  'flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-secondary p-4 text-center',
                  isDragging && 'border-primary'
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : (
                  <>
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your image here, or click to select
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFile(file);
                    }
                  }}
                  disabled={isLoading}
                  aria-label="Upload product image"
                />
              </label>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
