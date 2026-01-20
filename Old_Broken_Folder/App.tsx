import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import MainContentPanel from './components/MainContentPanel';
import HeroHub from './components/HeroHub';
import MainMenu from './components/MainMenu';
import CategorySelectionView from './components/CategorySelectionView';
import ReportSubmissionView from './components/ReportSubmissionView';
import ReportCompleteView from './components/ReportCompleteView';
import ReputationAndCurrencyView from './components/ReputationAndCurrencyView';
import MissionDetailView from './components/MissionDetailView';
import MissionCompleteView from './components/MissionCompleteView';
import LiveIntelligenceView from './components/LiveIntelligenceView';
import GenerateMissionView from './components/GenerateMissionView';
import TrainingHolodeckView from './components/TrainingHolodeckView';
import TransparencyDatabaseView from './components/TransparencyDatabaseView';
import IncidentRoomView from './components/IncidentRoomView';
import LedgerScanner from './components/LedgerScanner';
import EcosystemOverview from './components/EcosystemOverview';
import AiSetupView from './components/AiSetupView';
import TutorialMissionView from './components/TutorialMissionView';
import TestAccessGate from './components/TestAccessGate';

import {
  Category,
  type Report,
  type Mission,
  type Hero,
  type Rank,
  type ChatMessage,
  IntelItem,
  type HeroPersona,
  Archetype,
  type MissionCompletionSummary
} from './types';

import {
  MOCK_REPORTS,
  INITIAL_HERO_PROFILE,
  RANKS,
  IAP_PACKS,
  STORE_ITEMS
} from './constants';

import {
  generateHeroPersonaImage,
  generateHeroPersonaDetails,
  generateMissionFromIntel,
  isAiEnabled
} from './services/geminiService';

import { apiService } from './services/apiService';

export type View =
  | 'mainMenu'
  | 'categorySelection'
  | 'hub'
  | 'heroHub'
  | 'reportSubmission'
  | 'reportComplete'
  | 'liveIntelligence'
  | 'generateMission'
  | 'missionDetail'
  | 'missionComplete'
  | 'incidentRoom'
  | 'trainingHolodeck'
  | 'reputationAndCurrency'
  | 'transparencyDatabase'
  | 'ecosystem'
  | 'aiSetup'
  | 'tutorial';

export type TextScale = 'standard' | 'large' | 'ultra' | 'magnified';

const getInitialHero = (): Hero => {
  try {
    const saved = localStorage.getItem('dpal-hero');
    return saved ? JSON.parse(saved) : INITIAL_HERO_PROFILE;
  } catch {
    return INITIAL_HERO_PROFILE;
  }
};

const App: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [hero, setHero] = useState<Hero>(getInitialHero);
  const [currentView, setCurrentView] = useState<View>('mainMenu');
  const [prevView, setPrevView] = useState<View>('mainMenu');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedIntel, setSelectedIntel] = useState<IntelItem | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [completedMission, setCompletedMission] = useState<MissionCompletionSummary | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'OFFLINE' | 'SYNCING' | 'LIVE' | 'MOCK'>('OFFLINE');
  const [heroHubTab, setHeroHubTab] = useState<'profile' | 'missions' | 'skills' | 'training' | 'collection'>('profile');

  useEffect(() => {
    localStorage.setItem('dpal-hero', JSON.stringify(hero));
  }, [hero]);

  const heroWithRank = useMemo((): Hero => {
    let rank: Rank = RANKS[0];
    for (const r of RANKS) {
      if (hero.xp >= r.xpNeeded) rank = r;
    }
    return { ...hero, rank: rank.level, title: hero.equippedTitle || rank.title };
  }, [hero]);

  const syncLedger = useCallback(async () => {
    setNetworkStatus('SYNCING');
    try {
      const live = await apiService.getReports();
      setReports(live.length ? live : MOCK_REPORTS);
      setNetworkStatus(apiService.isMock() ? 'MOCK' : 'LIVE');
    } catch {
      setNetworkStatus('OFFLINE');
    }
  }, []);

  useEffect(() => {
    syncLedger();
  }, [syncLedger]);

  /* -------------------- FIX 1: PERSONA DELETE -------------------- */
  const handleDeleteHeroPersona = useCallback((personaId: string) => {
    setHero(prev => {
      const remaining = prev.personas.filter(p => p.id !== personaId);
      return {
        ...prev,
        personas: remaining,
        equippedPersonaId:
          prev.equippedPersonaId === personaId
            ? remaining[0]?.id ?? null
            : prev.equippedPersonaId
      };
    });
  }, []);

  /* -------------------- FIX 2: PERSONA IMAGE GEN -------------------- */
  const handleAddHeroPersona = useCallback(
    async (description: string, archetype: Archetype) => {
      setNetworkStatus('SYNCING');

      let imageUrl = '/placeholders/persona.png';
      let details;

      try {
        if (isAiEnabled()) {
          details = await generateHeroPersonaDetails(description, archetype);
          imageUrl = await generateHeroPersonaImage(description, archetype);
        } else {
          details = {
            name: 'Field Operative',
            backstory: 'Generated offline.',
            combatStyle: 'Adaptive'
          };
        }
      } catch (err) {
        console.error('Persona generation failed', err);
        details = {
          name: 'Recovered Operative',
          backstory: 'Fallback persona created.',
          combatStyle: 'Survivor'
        };
      }

      const persona: HeroPersona = {
        id: `persona-${Date.now()}`,
        name: details.name,
        backstory: details.backstory,
        combatStyle: details.combatStyle,
        imageUrl,
        archetype,
        prompt: description
      };

      setHero(prev => ({
        ...prev,
        personas: [...prev.personas, persona],
        equippedPersonaId: prev.equippedPersonaId || persona.id
      }));

      setNetworkStatus(apiService.isMock() ? 'MOCK' : 'LIVE');
    },
    []
  );

  /* -------------------- ERASE PROFILE -------------------- */
  const handleEraseProfile = useCallback(() => {
    if (!confirm('Erase local profile and reset?')) return;
    localStorage.removeItem('dpal-hero');
    setHero(INITIAL_HERO_PROFILE);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header
        hero={heroWithRank}
        networkStatus={networkStatus}
        onNavigate={v => {
          setPrevView(currentView);
          setCurrentView(v);
        }}
      />

      {currentView === 'heroHub' && (
        <HeroHub
          hero={heroWithRank}
          setHero={setHero}
          missions={missions}
          reports={reports}
          iapPacks={IAP_PACKS}
          storeItems={STORE_ITEMS}
          activeTab={heroHubTab}
          setActiveTab={setHeroHubTab}
          onAddHeroPersona={handleAddHeroPersona}
          onDeleteHeroPersona={handleDeleteHeroPersona}
          onEquipHeroPersona={id =>
            setHero(h => ({ ...h, equippedPersonaId: id }))
          }
          onEraseProfile={handleEraseProfile}
          onNavigateToMissionDetail={m => {
            setSelectedMission(m);
            setCurrentView('missionDetail');
          }}
          onReturnToHub={() => setCurrentView('mainMenu')}
          onNavigate={setCurrentView}
        />
      )}
    </div>
  );
};

export default App;
