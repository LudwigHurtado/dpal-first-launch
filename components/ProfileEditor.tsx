import React, { useMemo, useState } from 'react';
import type { UserProfile } from '../types';
import { useProfileAvatar } from '../hooks/useProfileAvatar';
import ProfileAvatar from './ProfileAvatar';
import { Camera, Check, MapPin, ShieldCheck, User } from './icons';

interface ProfileEditorProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel?: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, onCancel }) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [handle, setHandle] = useState(profile.handle);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [role, setRole] = useState(profile.role);
  const [reputation, setReputation] = useState(profile.reputation);
  const [lastActive, setLastActive] = useState(profile.lastActive);

  const {
    imageUrl,
    crop,
    setCrop,
    handleFileChange,
    resetPreview,
    hasPreview
  } = useProfileAvatar(profile.avatarUrl, profile.avatarCrop);

  const handleInput = (value: string) => value.replace(/\s+/g, ' ').trimStart();

  const trustLabel = useMemo(() => {
    if (reputation >= 900) return 'Exceptional';
    if (reputation >= 700) return 'Trusted';
    if (reputation >= 500) return 'Established';
    return 'Emerging';
  }, [reputation]);

  const handleSave = () => {
    onSave({
      ...profile,
      displayName: handleInput(displayName) || profile.displayName,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      bio,
      location,
      role,
      reputation,
      lastActive,
      avatarUrl: imageUrl || undefined,
      avatarCrop: crop
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(280px,320px)_1fr] gap-10">
      <div className="space-y-6">
        <div className="rounded-[2.5rem] border border-zinc-800 bg-zinc-950/70 p-6 text-center">
          <ProfileAvatar
            name={displayName}
            handle={handle}
            imageUrl={imageUrl}
            crop={crop}
            className="mx-auto h-[220px] w-[220px]"
          />
          <div className="mt-6 space-y-3">
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-cyan-300 transition hover:bg-cyan-500/20">
              <Camera className="h-4 w-4" />
              Upload Image
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            {hasPreview && (
              <button
                type="button"
                onClick={resetPreview}
                className="text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500 hover:text-zinc-300"
              >
                Reset Preview
              </button>
            )}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-zinc-800 bg-zinc-900/70 p-6 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Cropping Preview</p>
          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">Zoom</label>
              <input
                type="range"
                min={1}
                max={2.2}
                step={0.05}
                value={crop.zoom}
                onChange={e => setCrop({ ...crop, zoom: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">Horizontal</label>
              <input
                type="range"
                min={-25}
                max={25}
                step={1}
                value={crop.x}
                onChange={e => setCrop({ ...crop, x: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">Vertical</label>
              <input
                type="range"
                min={-25}
                max={25}
                step={1}
                value={crop.y}
                onChange={e => setCrop({ ...crop, y: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2.5rem] border border-zinc-800 bg-zinc-950/70 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Display Name</label>
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-4 py-3 text-sm font-semibold text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Handle</label>
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-black/70 px-4 py-3">
                <User className="h-4 w-4 text-cyan-400" />
                <input
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Location</label>
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-black/70 px-4 py-3">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Role / Title</label>
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-black/70 px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <input
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Reputation</label>
              <input
                type="range"
                min={100}
                max={1000}
                step={5}
                value={reputation}
                onChange={e => setReputation(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                <span>{reputation}</span>
                <span>{trustLabel}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Last Active</label>
              <input
                value={lastActive}
                onChange={e => setLastActive(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-4 py-3 text-sm font-semibold text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-[10px] font-black uppercase tracking-[0.4em] text-white transition hover:bg-emerald-500"
          >
            <Check className="h-4 w-4" />
            Save Profile
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;