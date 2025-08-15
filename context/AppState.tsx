import React, { createContext, useContext, useMemo, useState } from 'react';
import { UserPrefs } from '../data/types';

interface AppState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  prefs: Partial<UserPrefs>;
  setPrefs: React.Dispatch<React.SetStateAction<Partial<UserPrefs>>>;
}

const Ctx = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboarded] = useState(false);
  const [prefs, setPrefs] = useState<Partial<UserPrefs>>({
    diets: [],
    allergies: [],
    goals: [],
    unitSystem: 'metric',
    householdSize: 2,
    weeklyBudgetKES: 3000,
  });
  const value = useMemo(() => ({ onboarded, setOnboarded, prefs, setPrefs }), [onboarded, prefs]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppState must be used within AppStateProvider');
  return v;
}

