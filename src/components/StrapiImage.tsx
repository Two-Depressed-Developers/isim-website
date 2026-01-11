import Image, { ImageProps } from "next/image";
import { getStrapiMedia } from "@/lib/utils";

type ImageWithoutSrc = Omit<ImageProps, "src">;

type Props = {
  imageLink: string;
} & ImageWithoutSrc;

export function StrapiImage({ imageLink, alt, ...props }: Props) {
  if (!imageLink) return null;

  const imageUrl =
    getStrapiMedia(imageLink) ??
    `https://placehold.co/${props.width ?? 400}x${props.height ?? 400}`;

  return <Image src={imageUrl} alt={alt} {...props} />;
}
