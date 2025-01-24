import clsx from "clsx";
import Image from "next/image";
import React from "react";
import { LuCheck } from "react-icons/lu";

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
    <div className="scrollbar-thin grid flex-1 gap-5 overflow-auto p-6 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
      {data.map((image, index) => (
        <div
          key={image.id || index}
          className={clsx("media-item", {
            "media-item--selected": selected?.id === image?.id,
            "media-item--uploading": !Boolean(image?.id),
          })}
          onClick={() => onSelect(image)}
        >
          {image?.id && (
            <div className="media-item__checkbox">
              {selected?.id === image.id && <LuCheck aria-hidden="true" />}
            </div>
          )}

          <div className="media-item__image-wrapper">
            <Image
              width={200}
              height={200}
              src={image.url}
              alt={image.display_name}
            />
          </div>

          <div className="media-item__info">
            <div className="media-item__name">{image.display_name}</div>
            <div className="media-item__details">
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
  );
};

export default MediaGallery;
