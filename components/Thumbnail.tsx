import { cn, getFileIcon } from "@/lib/utils";
import Image from "next/image";
import React from "react";
interface Props {
  type: string;
  extension: string;
  url?: string;
  className?: string;
  imageClassName?: string;
}
const Thumbnail = ({
  extension,
  type,
  url = "",
  className,
  imageClassName,
}: Props) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        height={100}
        width={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image"
        )}
      />
    </figure>
  );
};

export default Thumbnail;
