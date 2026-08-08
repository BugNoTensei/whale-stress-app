import React from "react";
import whaleIcon from "../../assets/icon/whaleicon.png";

interface WhaleSharkIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
}

export const WhaleSharkIcon: React.FC<WhaleSharkIconProps> = ({
  className = "w-10 h-6 object-contain",
  width,
  height,
  alt = "Whale Shark Icon",
}) => {
  return (
    <img
      src={whaleIcon}
      alt={alt}
      className={`inline-block select-none object-contain pointer-events-none ${className}`}
      style={{ width, height }}
    />
  );
};
