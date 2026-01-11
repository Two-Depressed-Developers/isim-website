import Image, { ImageProps } from "next/image";
import { getStrapiMedia } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  objectFit?: "cover" | "contain";
} & ImageProps;

export function StrapiImage({
  src,
  alt,
  height,
  width,
  className,
  fill,
  sizes,
  preload,
  loading,
  objectFit = "cover",
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
      preload={preload}
      loading={preload ? undefined : loading}
      {...imageProps}
      style={fill ? { objectFit } : undefined}
    />
  );
}
