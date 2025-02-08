'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type React from 'react';
import { LuCheck } from 'react-icons/lu';

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
    <ScrollArea className="h-full w-full">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 p-6">
        {data.map((image, index) => (
          <div
            key={image.id || index}
            className={cn(
              'relative flex cursor-pointer flex-col rounded-md border border-input transition-all',
              {
                'ring-2 ring-ring ring-offset-2': selected?.id === image?.id,
                'pointer-events-none opacity-20': !Boolean(image?.id),
              }
            )}
            onClick={() => onSelect(image)}
          >
            {image?.id && (
              <div
                className={cn(
                  'invisible absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-input bg-background text-foreground',
                  {
                    'visible bg-primary text-primary-foreground':
                      selected?.id === image.id,
                  }
                )}
              >
                {selected?.id === image.id && (
                  <LuCheck aria-hidden="true" className="w-4.5 h-4.5" />
                )}
              </div>
            )}

            <div className="flex h-40 w-full justify-center bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,transparent_0%_50%)_50%/20px_20px]">
              <img
                src={image.url || '/placeholder.svg'}
                alt={image.display_name}
                className="max-h-full object-contain"
              />
            </div>

            <div className="flex flex-col gap-1.5 border-t border-input p-2">
              <div className="truncate text-sm font-bold">
                {image.display_name}
              </div>
              <div className="text-xs text-muted-foreground">
                <span>{image.format.toUpperCase()}</span>
                <span> • </span>
                <span>
                  {image?.width} x {image?.height}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MediaGallery;
