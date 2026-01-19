import React from 'react';
import type { UserProfile } from '../types';
import ProfileAvatar from './ProfileAvatar';
import { Activity, Award, Clock, MapPin, ShieldCheck, User } from './icons';

interface ProfileViewProps {
  profile: UserProfile;
  onEdit?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onEdit }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,320px)_1fr] gap-10">
      <div className="flex flex-col items-center lg:items-start gap-6">
        <ProfileAvatar
          name={profile.displayName}
          handle={profile.handle}
          imageUrl={profile.avatarUrl}
          crop={profile.avatarCrop}
          className="w-[clamp(200px,24vw,260px)] h-[clamp(200px,24vw,260px)]"
        />
        <div className="flex flex-col gap-3 text-center lg:text-left">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-cyan-400">Identity</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{profile.displayName}</h2>
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.35em] text-cyan-300">
              <User className="h-4 w-4" />
              {profile.handle}
            </div>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed max-w-sm">{profile.bio}</p>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-cyan-600 px-5 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-white transition hover:bg-cyan-500"
            >
              <ShieldCheck className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div className="rounded-[2.5rem] border border-zinc-800 bg-zinc-950/70 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Role</p>
              <h3 className="text-2xl font-black text-white">{profile.role}</h3>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3">
              <Award className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-emerald-300">Trust Score</p>
                <p className="text-lg font-black text-white">{profile.reputation.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3">
              <MapPin className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">Location</p>
                <p className="text-sm font-semibold text-white">{profile.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3">
              <Clock className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">Last Active</p>
                <p className="text-sm font-semibold text-white">{profile.lastActive}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-zinc-800 bg-zinc-900/70 p-8">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Reputation Index</p>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <Activity className="h-4 w-4" />
              Verified Active
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
              <span>Community Trust</span>
              <span>{Math.min(100, Math.round(profile.reputation / 10))}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-zinc-950">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                style={{ width: `${Math.min(100, Math.round(profile.reputation / 10))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;