import Image from "next/image";
import { getStrapiMedia } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  height?: number;
  width?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
};

export function StrapiImage({
  src,
  alt,
  height,
  width,
  className,
  fill,
  sizes,
  priority,
}: Props) {
  if (!src) return null;

  const imageUrl = getStrapiMedia(src);
  const imageFallback = `https://placehold.co/${width ?? 400}x${height ?? 400}`;

  const imageProps = fill
    ? { fill: true, sizes: sizes ?? "100vw" }
    : { width, height };

  return (
    <Image
      src={imageUrl ?? imageFallback}
      alt={alt}
      className={className}
      priority={priority}
      {...imageProps}
      style={fill ? { objectFit: "cover" } : undefined}
    />
  );
}
