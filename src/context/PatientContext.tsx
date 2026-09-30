import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientProfile } from '../types';

interface PatientContextType {
  patient: PatientProfile | null;
  isLoggedIn: boolean;
  registerOrUpdatePatient: (data: Partial<PatientProfile>) => void;
  logout: () => void;
  loadDemoPatient: () => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const PATIENT_STORAGE_KEY = 'vittaconect_patient_profile_v1';

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

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patient, setPatient] = useState<PatientProfile | null>(() => {
    try {
      const saved = localStorage.getItem(PATIENT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao carregar perfil da gestante', e);
    }
    // No hardcoded pre-defined patient! Starts as null so the mother registers herself
    return null;
  });

  useEffect(() => {
    try {
      if (patient) {
        localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(patient));
      } else {
        localStorage.removeItem(PATIENT_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Erro ao salvar perfil da gestante', e);
    }
  }, [patient]);

  const registerOrUpdatePatient = (data: Partial<PatientProfile>) => {
    setPatient((prev) => {
      const base: PatientProfile = prev || {
        id: `patient-${Date.now()}`,
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
        doctorName: data.doctorName || 'Dr. Roberto Silva (Obstetra)',
        doctorCrm: data.doctorCrm || 'CRM-SP 142.890',
        registeredAt: new Date().toISOString(),
      };

      const updated: PatientProfile = {
        ...base,
        ...data,
        preferredName: data.preferredName || (data.name ? data.name.split(' ')[0] : base.preferredName),
        dueDate: data.dueDate || (data.currentWeek ? calculateDueDateFromWeeks(data.currentWeek) : base.dueDate),
      };

      return updated;
    });
  };

  const logout = () => {
    setPatient(null);
  };

  const loadDemoPatient = () => {
    const demo: PatientProfile = {
      id: 'demo-patient',
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
      doctorName: 'Dr. Roberto Silva (Obstetra)',
      doctorCrm: 'CRM-SP 142.890',
      registeredAt: new Date().toISOString(),
    };
    setPatient(demo);
  };

  return (
    <PatientContext.Provider
      value={{
        patient,
        isLoggedIn: !!patient,
        registerOrUpdatePatient,
        logout,
        loadDemoPatient,
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
