import React from 'react';
import type { AvatarCrop } from '../types';

interface ProfileAvatarProps {
  name: string;
  handle?: string;
  imageUrl?: string;
  crop?: AvatarCrop;
  size?: number;
  className?: string;
  variant?: 'hex' | 'circle';
  highlight?: boolean;
}

const getInitials = (name: string, handle?: string) => {
  const fromName = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');

  if (fromName) return fromName;

  const sanitized = handle?.replace('@', '').trim();
  if (!sanitized) return 'DP';

  return sanitized.slice(0, 2).toUpperCase();
};

const DEFAULT_CROP: AvatarCrop = {
  zoom: 1.15,
  x: 0,
  y: -4
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  name,
  handle,
  imageUrl,
  crop = DEFAULT_CROP,
  size,
  className,
  variant = 'hex',
  highlight = true
}) => {
  const initials = getInitials(name, handle);
  const hasImage = Boolean(imageUrl);
  const frameStyle: React.CSSProperties = size ? { width: size, height: size } : {};

  const imageStyle: React.CSSProperties = hasImage
    ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${Math.max(1, crop.zoom) * 110}%`,
        backgroundPosition: `${50 + crop.x}% ${50 + crop.y}%`
      }
    : {};

  const clipPath =
    variant === 'hex'
      ? 'polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0% 50%)'
      : undefined;

  return (
    <div className={`relative ${className ?? ''}`} style={frameStyle}>
      {highlight && (
        <div className="absolute -inset-6 rounded-[2.5rem] bg-cyan-500/10 blur-[40px]" />
      )}
      <div
        className="relative h-full w-full rounded-[2.5rem] p-[2px] bg-gradient-to-tr from-cyan-500 via-blue-500 to-emerald-400 shadow-[0_0_35px_rgba(6,182,212,0.35)]"
        style={clipPath ? { clipPath } : undefined}
      >
        <div
          className="relative h-full w-full overflow-hidden bg-zinc-950 border border-cyan-500/30"
          style={clipPath ? { clipPath } : { borderRadius: '9999px' }}
        >
          {hasImage ? (
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-500"
              style={imageStyle}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-3xl font-black tracking-widest text-white">
              {initials}
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none ring-1 ring-white/10" />
        </div>
      </div>
      <div className="absolute -inset-3 rounded-[3rem] border border-cyan-500/20 pointer-events-none" />
    </div>
  );
};

export default ProfileAvatar;