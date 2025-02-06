import { Check } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';

interface MediaGalleryProps {
  data: any[];
  selected: any | null;
  onSelect: (image: any) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  data,
  selected,
  onSelect,
}) => {
  return (
    <div className="grid h-full grid-cols-2 gap-4 overflow-y-auto p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {data.map((image, index) => (
        <div
          key={image.id || index}
          className={`relative flex h-[200px] cursor-pointer flex-col overflow-hidden rounded-lg border border-border transition-all ${
            selected?.id === image?.id
              ? 'ring-2 ring-primary'
              : 'hover:ring-2 hover:ring-primary/50'
          } ${!image?.id ? 'pointer-events-none opacity-50' : ''}`}
          onClick={() => onSelect(image)}
        >
          <div className="relative flex-grow">
            <Image
              src={image.url || '/placeholder.svg'}
              alt={image.display_name}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
            <div
              className={`absolute left-2 top-2 rounded-full bg-primary p-1 text-primary-foreground transition-opacity ${
                selected?.id === image.id
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <Check className="h-4 w-4" />
            </div>
          </div>
          <div className="bg-card p-2">
            <p className="truncate text-sm font-medium">{image.display_name}</p>
            <p className="text-xs text-muted-foreground">
              {image.format.toUpperCase()} • {image?.width} x {image?.height}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaGallery;
