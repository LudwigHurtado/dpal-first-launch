import React, { useEffect, useState, useRef } from 'react';
import { TutorialOverlayStep } from '../types';
import { ChevronRight, X } from './icons';

interface TutorialOverlayProps {
    step: TutorialOverlayStep;
    onNext: () => void;
    onSkip: () => void;
    isLastStep: boolean;
    enabled?: boolean;
}

const STORAGE_KEY = 'tutorial_seen';

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
    step,
    onNext,
    onSkip,
    isLastStep,
    enabled = false
}) => {
    const [active, setActive] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    /* Decide whether tutorial should activate */
    useEffect(() => {
        if (!enabled) return;

        const seen = localStorage.getItem(STORAGE_KEY);
        if (!seen) {
            setActive(true);
        }
    }, [enabled]);

    /* Track target element */
    useEffect(() => {
        if (!active) return;

        const updateRect = () => {
            const el = document.querySelector(step.targetSelector);
            if (!el) {
                // Target missing. Kill tutorial permanently.
                localStorage.setItem(STORAGE_KEY, '1');
                setActive(false);
                return;
            }
            setTargetRect(el.getBoundingClientRect());
        };

        updateRect();
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect);

        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect);
        };
    }, [active, step.targetSelector]);

    const closeTutorial = () => {
        localStorage.setItem(STORAGE_KEY, '1');
        setActive(false);
        onSkip();
    };

    const handleNext = () => {
        if (isLastStep) {
            localStorage.setItem(STORAGE_KEY, '1');
            setActive(false);
        }
        onNext();
    };

    if (!active || !targetRect) return null;

    const margin = 16;
    const getCardStyle = () => {
        switch (step.placement) {
            case 'top':
                return {
                    top: targetRect.top - margin,
                    left: targetRect.left + targetRect.width / 2,
                    transform: 'translate(-50%, -100%)'
                };
            case 'bottom':
                return {
                    top: targetRect.bottom + margin,
                    left: targetRect.left + targetRect.width / 2,
                    transform: 'translate(-50%, 0)'
                };
            case 'left':
                return {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.left - margin,
                    transform: 'translate(-100%, -50%)'
                };
            case 'right':
                return {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.right + margin,
                    transform: 'translate(0, -50%)'
                };
            default:
                return {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                };
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] font-mono">
            {/* Dark overlay */}
            <div
                className="absolute inset-0 bg-black/70 pointer-events-auto"
                style={{
                    clipPath: `polygon(
                        0% 0%, 
                        0% 100%, 
                        ${targetRect.left}px 100%, 
                        ${targetRect.left}px ${targetRect.top}px, 
                        ${targetRect.right}px ${targetRect.top}px, 
                        ${targetRect.right}px ${targetRect.bottom}px, 
                        ${targetRect.left}px ${targetRect.bottom}px, 
                        ${targetRect.left}px 100%, 
                        100% 100%, 
                        100% 0%
                    )`
                }}
            />

            {/* Tooltip card */}
            <div
                ref={cardRef}
                style={getCardStyle()}
                className="absolute w-72 bg-zinc-900 border-2 border-cyan-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] pointer-events-auto"
            >
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <h4 className="text-sm font-black text-cyan-400 uppercase tracking-widest">
                            {step.title}
                        </h4>
                        <button onClick={closeTutorial} className="text-zinc-600 hover:text-rose-500">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-xs text-zinc-300 font-bold uppercase leading-relaxed">
                        {step.body}
                    </p>

                    <div className="flex justify-between items-center pt-2">
                        <button
                            onClick={closeTutorial}
                            className="text-[9px] font-black text-zinc-600 hover:text-zinc-400 uppercase tracking-widest"
                        >
                            Skip Mission
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest active:scale-95"
                        >
                            <span>{isLastStep ? 'FINALIZE' : 'NEXT'}</span>
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialOverlay;
