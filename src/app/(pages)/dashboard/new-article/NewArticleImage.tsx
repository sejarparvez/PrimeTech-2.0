import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CgAsterisk } from "react-icons/cg";
import { toast } from "react-toastify";

interface ProductImageProps {
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  error?: string;
}

const MAX_IMAGE_SIZE_KB = 900;

export function ProductImage({ image, setImage, error }: ProductImageProps) {
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_KB * 1024) {
        setImageError(
          `Image size exceeds the maximum limit of ${MAX_IMAGE_SIZE_KB} KB`,
        );
        toast.error(
          `Image size exceeds the maximum limit of ${MAX_IMAGE_SIZE_KB} KB`,
        );
      } else {
        setImage(file);
        setImageError(null);
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          Cover Image
          <CgAsterisk className="h-3 w-3 text-destructive" aria-hidden="true" />
        </CardTitle>
        <CardDescription>
          Upload an image. Maximum file size is {MAX_IMAGE_SIZE_KB} KB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {image ? (
            <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-md">
              <Image
                src={URL.createObjectURL(image)}
                alt="Product image"
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          ) : (
            <div className="h-48 w-full max-w-sm">
              <Label
                htmlFor="image-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground bg-muted"
              >
                <Upload
                  className="h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="mt-2 text-sm text-muted-foreground">
                  Click to upload
                </span>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </Label>
            </div>
          )}
          {(imageError || error) && (
            <p className="text-sm text-destructive" role="alert">
              {imageError || error}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
