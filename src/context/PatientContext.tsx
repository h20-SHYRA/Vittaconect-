import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientProfile, UserMode } from '../types';
import { DEFAULT_WOMAN_PATIENT } from '../data/mockData';
import { useAuth } from './AuthContext';

interface PatientContextType {
  patient: PatientProfile | null;
  isLoggedIn: boolean;
  userMode: UserMode;
  registerOrUpdatePatient: (data: Partial<PatientProfile>) => void;
  switchMode: (mode: UserMode) => void;
  switchUserMode: (mode: UserMode) => void;
  logout: () => void;
  loadDemoPatient: () => void;
  loadDemoWoman: () => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const PATIENT_STORAGE_KEY = 'vittaconect_patient_profile_active_v1';

// Calculate estimated due date based on current weeks
export const calculateDueDateFromWeeks = (currentWeeks: number): string => {
  const weeksRemaining = Math.max(0, 40 - currentWeeks);
  const now = new Date();
  now.setDate(now.getDate() + weeksRemaining * 7);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
};

export const DEFAULT_PREGNANT_PATIENT: PatientProfile = {
  id: 'patient-mariana',
  userMode: 'gestante',
  name: 'Mariana Silva Santos',
  preferredName: 'Mariana',
  age: 29,
  phone: '(11) 98765-4321',
  babyNickname: 'Theo',
  babyGender: 'boy',
  currentWeek: 18,
  dueDate: calculateDueDateFromWeeks(18),
  bloodType: 'O+',
  isFirstPregnancy: true,
  emergencyContact: 'Lucas Santos (Esposo) - (11) 99123-4567',
  allergies: 'Dipirona (leve prurido cutâneo)',
  doctorName: 'Enf. Marcelo & Enfª. Letícia (Enfermagem Obstétrica)',
  doctorCrm: 'COREN-SP 000.002 (Fictício)',
  registeredAt: '2026-06-15T10:00:00.000Z',
  initialWeight: 62.0,
  currentWeight: 65.0,
  heightCm: 165,
};

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { patientProfile, logout: authLogout } = useAuth();

  const [patient, setPatient] = useState<PatientProfile | null>(() => {
    try {
      const saved = localStorage.getItem(PATIENT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao carregar perfil da usuária', e);
    }
    // Starts as null so the Welcome / Registration screen appears when opening the app!
    return null;
  });

  useEffect(() => {
    if (patientProfile) {
      setPatient(patientProfile);
    }
  }, [patientProfile]);

  useEffect(() => {
    try {
      if (patient) {
        localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(patient));
      } else {
        localStorage.removeItem(PATIENT_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Erro ao salvar perfil da usuária', e);
    }
  }, [patient]);

  const registerOrUpdatePatient = (data: Partial<PatientProfile>) => {
    setPatient((prev) => {
      const currentMode = data.userMode || prev?.userMode || 'gestante';
      
      const base: PatientProfile = prev || (currentMode === 'gestante' 
        ? {
            id: `patient-${Date.now()}`,
            userMode: 'gestante',
            name: data.name || '',
            preferredName: data.preferredName || data.name?.split(' ')[0] || '',
            age: data.age || 28,
            phone: data.phone || '',
            babyNickname: data.babyNickname || 'Bebê',
            babyGender: data.babyGender || 'surprise',
            currentWeek: data.currentWeek || 16,
            dueDate: data.dueDate || calculateDueDateFromWeeks(data.currentWeek || 16),
            bloodType: data.bloodType || 'A+',
            isFirstPregnancy: data.isFirstPregnancy ?? true,
            emergencyContact: data.emergencyContact || 'Familiar de Apoio',
            allergies: data.allergies || 'Nenhuma alergia conhecida',
            doctorName: data.doctorName || 'Enf. Marcelo & Enfª. Letícia (Enfermagem Obstétrica)',
            doctorCrm: data.doctorCrm || 'COREN-SP 000.002 (Fictício)',
            registeredAt: new Date().toISOString(),
          }
        : {
            id: `patient-woman-${Date.now()}`,
            userMode: 'saude_feminina',
            name: data.name || '',
            preferredName: data.preferredName || data.name?.split(' ')[0] || '',
            age: data.age || 30,
            phone: data.phone || '',
            lastPeriodDate: data.lastPeriodDate || new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
            cycleDurationDays: data.cycleDurationDays || 28,
            periodDurationDays: data.periodDurationDays || 5,
            contraceptiveMethod: data.contraceptiveMethod || 'Preservativo',
            pregnancyGoal: data.pregnancyGoal || 'awareness',
            lifeStage: data.lifeStage || 'reprodutiva',
            emergencyContact: data.emergencyContact || 'Contato de Confiança',
            allergies: data.allergies || 'Nenhuma alergia conhecida',
            doctorName: data.doctorName || 'Enfª. Bianca (Enfermagem em Saúde da Mulher)',
            doctorCrm: data.doctorCrm || 'COREN-SP 000.003 (Fictício)',
            registeredAt: new Date().toISOString(),
          }
      );

      const updated: PatientProfile = {
        ...base,
        ...data,
        userMode: data.userMode || base.userMode || 'gestante',
        preferredName: data.preferredName || (data.name ? data.name.split(' ')[0] : base.preferredName),
        dueDate: data.dueDate || (data.currentWeek ? calculateDueDateFromWeeks(data.currentWeek) : base.dueDate),
      };

      return updated;
    });
  };

  const switchMode = (mode: UserMode) => {
    if (mode === 'saude_feminina') {
      if (patient?.userMode === 'gestante') {
        registerOrUpdatePatient({
          userMode: 'saude_feminina',
          lastPeriodDate: patient.lastPeriodDate || '2026-09-18',
          cycleDurationDays: 28,
          periodDurationDays: 5,
          contraceptiveMethod: 'Preservativo / Autoconhecimento',
        });
      }
    } else {
      if (patient?.userMode === 'saude_feminina') {
        registerOrUpdatePatient({
          userMode: 'gestante',
          currentWeek: 16,
          babyNickname: 'Meu Bebê',
          dueDate: calculateDueDateFromWeeks(16),
          bloodType: 'O+',
        });
      }
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(PATIENT_STORAGE_KEY);
      sessionStorage.removeItem(PATIENT_STORAGE_KEY);
      localStorage.removeItem('vittaconect_patient_profile_v1');
      localStorage.removeItem('vittaconect_patient_profile_v2');
      localStorage.removeItem('vittaconect_patient_profile_active_v1');
    } catch (e) {
      console.warn('Erro ao limpar storage no logout', e);
    }
    setPatient(null);
    authLogout().catch((err) => console.warn('Auth logout error:', err));
  };

  const loadDemoPatient = () => {
    setPatient(DEFAULT_PREGNANT_PATIENT);
  };

  const loadDemoWoman = () => {
    setPatient(DEFAULT_WOMAN_PATIENT);
  };

  const activePatient: PatientProfile | null = patient || patientProfile;
  const currentMode: UserMode = activePatient?.userMode || 'gestante';

  return (
    <PatientContext.Provider
      value={{
        patient: activePatient,
        isLoggedIn: !!activePatient,
        userMode: currentMode,
        registerOrUpdatePatient,
        switchMode,
        switchUserMode: switchMode,
        logout,
        loadDemoPatient,
        loadDemoWoman,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient deve ser usado dentro de um PatientProvider');
  }
  return context;
};
