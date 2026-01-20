import React, { useState } from 'react';
import {
  SkillLevel,
  type Mission,
  type Hero,
  type Category,
  type Report,
  type IapPack,
  type StoreItem,
  type NftTheme,
  Archetype
} from '../types';

import { useTranslations } from '../i18n';

import {
  ArrowLeft,
  Loader,
  Coins,
  Gem,
  List,
  Zap,
  UserCircle,
  Store,
  Broadcast,
  MapPin,
  Target,
  Box,
  ShieldCheck,
  Monitor,
  Package,
  Search,
  ListFilter
} from './icons';

import { CATEGORIES_WITH_ICONS } from '../constants';

import CollectionCodex from './CollectionCodex';
import NftMintingStation from './NftMintingStation';
import StoreView from './StoreView';
import HeroPersonaManager from './HeroPersonaManager';
import HeroProfileTab from './HeroProfileTab'; // ✅ FIXED: DEFAULT IMPORT
import TacticalVault from './TacticalVault';

interface HeroHubProps {
  onReturnToHub: () => void;
  missions: Mission[];
  isLoadingMissions: boolean;
  hero: Hero;
  setHero: React.Dispatch<React.SetStateAction<Hero>>;
  heroLocation: string;
  setHeroLocation: (loc: string) => void;
  onGenerateNewMissions: (prefs: {
    skillLevel: SkillLevel;
    categories: Category[];
    location?: string;
  }) => void;
  onMintNft: (prompt: string, theme: NftTheme, dpalCategory: Category) => Promise<Report>;
  reports: Report[];
  iapPacks: IapPack[];
  storeItems: StoreItem[];
  onInitiateHCPurchase: (pack: IapPack) => void;
  onInitiateStoreItemPurchase: (item: StoreItem) => void;
  onAddHeroPersona: (description: string, archetype: Archetype) => Promise<void>;
  onDeleteHeroPersona: (personaId: string) => void;
  onEquipHeroPersona: (personaId: string | null) => void;
  onGenerateHeroBackstory: () => Promise<void>;
  onNavigateToMissionDetail: (mission: Mission) => void;
  onNavigate: (view: any) => void;
  activeTab: any;
  setActiveTab: (tab: any) => void;
}

const QUICK_LOCATIONS = [
  'San Jose, CA',
  'Los Angeles, CA',
  'Chicago, IL',
  'New York, NY',
  'London, UK'
];

const HeroHub: React.FC<HeroHubProps> = ({
  onReturnToHub,
  missions,
  isLoadingMissions,
  hero,
  setHero,
  heroLocation,
  setHeroLocation,
  onGenerateNewMissions,
  onMintNft,
  reports,
  iapPacks,
  storeItems,
  onInitiateHCPurchase,
  onInitiateStoreItemPurchase,
  onAddHeroPersona,
  onDeleteHeroPersona,
  onEquipHeroPersona,
  onGenerateHeroBackstory,
  onNavigateToMissionDetail,
  onNavigate,
  activeTab,
  setActiveTab
}) => {
  const { t } = useTranslations();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMissions = async (prefs: {
    skillLevel: SkillLevel;
    categories: Category[];
    location?: string;
  }) => {
    setIsGenerating(true);
    await onGenerateNewMissions(prefs);
    setIsGenerating(false);
  };

  const tabs = [
    { id: 'profile', label: 'Operative_Dossier', icon: UserCircle },
    { id: 'missions', label: 'Field_Log', icon: List },
    { id: 'training', label: 'Holodeck', icon: Monitor },
    { id: 'vault', label: 'Coin_Exchange', icon: Coins },
    { id: 'collection', label: 'Asset_Archive', icon: Package },
    { id: 'mint', label: 'Forge', icon: Gem },
    { id: 'store', label: 'Market', icon: Store }
  ];

  return (
    <div className="text-white font-mono min-h-screen animate-fade-in">
      <button
        onClick={onReturnToHub}
        className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-cyan-400"
      >
        <ArrowLeft className="w-6 h-6" />
        Terminal_Return
      </button>

      <div className="flex gap-2 mt-10 mb-14 overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl uppercase text-xs font-black tracking-widest transition ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-zinc-500 hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'profile' && (
        <HeroProfileTab
          hero={hero}
          setHero={setHero}
          onNavigate={onNavigate}
          onAddHeroPersona={onAddHeroPersona}
          onDeleteHeroPersona={onDeleteHeroPersona}
          onEquipHeroPersona={onEquipHeroPersona}
          onGenerateBackstory={onGenerateHeroBackstory}
        />
      )}

      {activeTab === 'collection' && (
        <CollectionCodex reports={reports} hero={hero} onReturn={() => setActiveTab('missions')} />
      )}

      {activeTab === 'mint' && (
        <NftMintingStation hero={hero} setHero={setHero} onMintNft={onMintNft} reports={reports} />
      )}

      {activeTab === 'store' && (
        <StoreView
          hero={hero}
          iapPacks={iapPacks}
          storeItems={storeItems}
          onInitiateHCPurchase={onInitiateHCPurchase}
          onInitiateStoreItemPurchase={onInitiateStoreItemPurchase}
          onReturn={() => setActiveTab('missions')}
          isEmbedded
        />
      )}

      {activeTab === 'vault' && (
        <TacticalVault hero={hero} setHero={setHero} onReturn={() => setActiveTab('missions')} reports={reports} />
      )}
    </div>
  );
};

export default HeroHub;
