import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { AvatarCrop } from '../types';

const DEFAULT_CROP: AvatarCrop = {
  zoom: 1.15,
  x: 0,
  y: -4
};

export const useProfileAvatar = (initialUrl?: string, initialCrop?: AvatarCrop) => {
  const [baseUrl, setBaseUrl] = useState(initialUrl ?? '');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<AvatarCrop>(initialCrop ?? DEFAULT_CROP);

  useEffect(() => {
    setBaseUrl(initialUrl ?? '');
  }, [initialUrl]);

  useEffect(() => {
    if (initialCrop) {
      setCrop(initialCrop);
    }
  }, [initialCrop]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const nextUrl = URL.createObjectURL(file);
      setPreviewUrl(nextUrl);
    },
    [previewUrl]
  );

  const resetPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setCrop(initialCrop ?? DEFAULT_CROP);
  }, [initialCrop, previewUrl]);

  const imageUrl = useMemo(() => previewUrl ?? baseUrl, [previewUrl, baseUrl]);

  return {
    imageUrl,
    crop,
    setCrop,
    hasPreview: Boolean(previewUrl),
    handleFileChange,
    resetPreview,
    setBaseUrl
  };
};