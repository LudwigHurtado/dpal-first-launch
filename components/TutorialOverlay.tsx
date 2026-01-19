import React from 'react';
import { TutorialOverlayStep } from '../types';

interface TutorialOverlayProps {
  step: TutorialOverlayStep;
  onNext: () => void;
  onSkip: () => void;
  isLastStep: boolean;
  enabled?: boolean;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = () => {
  return null;
};

export default TutorialOverlay;
