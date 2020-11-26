import React, { useCallback } from "react";
import "./Thumbnail.css";

type ThumbnailProps = {
  id: string;
  alt: string;
  source: string;
  onClick: (id: string) => void;
};

export function Thumbnail({ id, alt, source, onClick }: ThumbnailProps) {
  const imgOnClick = useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  return (
    <img className="Thumbnail" alt={alt} src={source} onClick={imgOnClick} />
  );
}
