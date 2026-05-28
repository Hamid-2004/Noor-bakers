"use client";

import clsx from "clsx";
import Image, { ImageProps } from "next/image";

type PremiumImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
  containerClassName?: string;
  hoverZoom?: boolean;
};

export function PremiumImage({
  alt,
  className,
  containerClassName,
  hoverZoom = false,
  fill,
  src,
  ...props
}: PremiumImageProps) {
  if (fill) {
    return (
      <div className={clsx("absolute inset-0 overflow-hidden", containerClassName)}>
        <Image
          alt={alt}
          src={src}
          fill
          sizes={props.sizes ?? "(max-width: 768px) 100vw, 50vw"}
          className={clsx(
            "object-cover transition-transform duration-500 ease-out will-change-transform",
            hoverZoom && "group-hover:scale-105",
            className,
          )}
          {...props}
        />
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      src={src}
      className={clsx(
        "object-cover transition-transform duration-500 ease-out will-change-transform",
        hoverZoom && "group-hover:scale-105",
        className,
      )}
      {...props}
    />
  );
}
