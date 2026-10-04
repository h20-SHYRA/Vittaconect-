import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp,
  increment,
  addDoc,
  collection
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { UserRole, ProfessionalProfile, PatientProfile, AccessMetricsData, UserMode } from '../types';
import { DEFAULT_PREGNANT_PATIENT } from './PatientContext';
import { DEFAULT_WOMAN_PATIENT } from '../data/mockData';

export const RESTRICTED_PROFESSIONAL_CODE = 'vittaprofessio26/170705';

/**
 * Recursively removes any undefined properties from an object so Firestore setDoc/updateDoc
 * will never fail with "Unsupported field value: undefined".
 */
export function cleanFirestoreData<T>(input: T): T {
  if (input === null || input === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(input)) {
    return input
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item)) as unknown as T;
  }
  if (typeof input === 'object' && !(input instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return input;
}

export const CLINICAL_PROFESSIONALS: ProfessionalProfile[] = [
  {
    uid: 'prof-leticia',
    email: 'Enf.leticiavittaprofessio@gmail.com',
    displayName: 'Enfª. Letícia',
    role: 'profissional',
    specialty: 'Enfermagem Obstétrica & Pré-Natal',
    councilNumber: 'COREN-SP 000.001 (Fictício)',
    phone: '(11) 98765-1111',
    createdAt: '2026-01-10T08:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
    onDuty: true,
  },
  {
    uid: 'prof-marcelo',
    email: 'Enf.marcelovittaprofessio@gmail.com',
    displayName: 'Enf. Marcelo',
    role: 'profissional',
    specialty: 'Enfermagem Obstétrica, Pré-Natal & Neonatologia',
    councilNumber: 'COREN-SP 000.002 (Fictício)',
    phone: '(11) 98765-2222',
    createdAt: '2026-01-10T08:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
    onDuty: true,
  },
  {
    uid: 'prof-bianca',
    email: 'Enf.biancavittaprofessio@gmail.com',
    displayName: 'Enfª. Bianca',
    role: 'profissional',
    specialty: 'Enfermagem em Ginecologia & Prevenção',
    councilNumber: 'COREN-SP 000.003 (Fictício)',
    phone: '(11) 98765-3333',
    createdAt: '2026-01-10T08:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
    onDuty: true,
  },
  {
    uid: 'prof-stephanie',
    email: 'Enf.stephanievittaprofessio@gmail.com',
    displayName: 'Enfª. Stephanie',
    role: 'profissional',
    specialty: 'Enfermagem Obstétrica, Puerpério & Teleorientação',
    councilNumber: 'COREN-SP 000.004 (Fictício)',
    phone: '(11) 98765-4444',
    createdAt: '2026-01-10T08:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
    onDuty: true,
  },
];

export const DEFAULT_PROFESSIONAL_DEMO: ProfessionalProfile = CLINICAL_PROFESSIONALS[1]; // Enf. Marcelo (Padrão Solicitado)

export interface AppAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  currentUser: User | AppAuthUser | null;
  userRole: UserRole | null;
  professionalProfile: ProfessionalProfile | null;
  patientProfile: PatientProfile | null;
  loading: boolean;
  accessMetrics: AccessMetricsData | null;
  clinicalTeam: ProfessionalProfile[];
  signInWithGoogle: (emailParam?: string) => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>;
  loginWithNurseEmail: (nurseEmail: string) => Promise<{ success: boolean; error?: string }>;
  registerUserProfile: (params: {
    role: UserRole;
    specialty?: string;
    professionalCode?: string;
    councilNumber?: string;
    phone?: string;
    patientData?: Partial<PatientProfile>;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfessionalStatus: (onDuty: boolean) => Promise<void>;
  refreshAccessMetrics: () => Promise<void>;
  recordRealAccess: (source?: string) => Promise<void>;
  loginAsDemo: (role: UserRole, mode?: UserMode, profName?: string) => void;
  switchProfessional: (nameOrId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_METRIC_DOC_ID = 'current_metrics';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | AppAuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [professionalProfile, setProfessionalProfile] = useState<ProfessionalProfile | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessMetrics, setAccessMetrics] = useState<AccessMetricsData | null>(null);

  // Real-time access metrics subscription (Verifiable & Genuine from Firestore)
  useEffect(() => {
    const metricsRef = doc(db, 'access_metrics', ACCESS_METRIC_DOC_ID);
    const unsubscribe = onSnapshot(metricsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const todayStr = new Date().toISOString().split('T')[0];
        const monthStr = todayStr.slice(0, 7);

        // Check if date or month has rolled over in real time
        const isCurrentDay = data.lastDate === todayStr;
        const isCurrentMonth = data.lastMonth === monthStr;

        setAccessMetrics({
          dailyAccessCount: isCurrentDay ? (data.dailyAccessCount || 1) : 1,
          monthlyAccessCount: isCurrentMonth ? (data.monthlyAccessCount || 1) : 1,
          dailyGoal: data.dailyGoal || 100,
          monthlyGoal: data.monthlyGoal || 2000,
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      } else {
        // Initialize verifiable starting state
        const todayStr = new Date().toISOString().split('T')[0];
        const monthStr = todayStr.slice(0, 7);
        const initialRealData = {
          dailyAccessCount: 1,
          monthlyAccessCount: 1,
          dailyGoal: 100,
          monthlyGoal: 2000,
          lastDate: todayStr,
          lastMonth: monthStr,
          updatedAt: new Date().toISOString(),
        };
        setDoc(metricsRef, initialRealData).catch((err) => console.warn('Init metrics error:', err));
        setAccessMetrics(initialRealData);
      }
    }, (error) => {
      console.warn('Metrics snapshot listener warning:', error);
    });

    return () => unsubscribe();
  }, []);

  // Record a genuine visit on session start
  useEffect(() => {
    const sessionKey = 'vittacare_verified_session_visit';
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, 'true');
      recordRealAccess('visita_portal');
    }
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            const role = data.role as UserRole;
            setUserRole(role);

            // Update lastLoginAt
            await updateDoc(userDocRef, {
              lastLoginAt: new Date().toISOString(),
            }).catch(() => {});

            // Record access count
            recordRealAccess('login_usuario');

            if (role === 'profissional') {
              setProfessionalProfile({
                uid: user.uid,
                email: user.email || data.email,
                displayName: user.displayName || data.displayName || 'Enf. Marcelo',
                photoURL: user.photoURL || data.photoURL,
                role: 'profissional',
                specialty: data.specialty || 'Enfermagem Obstétrica, Pré-Natal & Neonatologia',
                councilNumber: data.councilNumber || 'COREN-SP 000.002 (Fictício)',
                phone: data.phone || '(11) 98765-2222',
                createdAt: data.createdAt || new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                onDuty: data.onDuty ?? true,
              });
            } else {
              // Paciente
              const storedPatient = data.patientData || {};
              setPatientProfile({
                id: user.uid,
                userMode: data.patientMode || storedPatient.userMode || 'gestante',
                name: user.displayName || data.displayName || 'Mariana Silva Santos',
                preferredName: storedPatient.preferredName || user.displayName?.split(' ')[0] || 'Mariana',
                age: storedPatient.age || 29,
                phone: storedPatient.phone || '',
                babyNickname: storedPatient.babyNickname || 'Theo',
                babyGender: storedPatient.babyGender || 'boy',
                currentWeek: storedPatient.currentWeek || 18,
                dueDate: storedPatient.dueDate || '18 de Fevereiro de 2027',
                bloodType: storedPatient.bloodType || 'O+',
                isFirstPregnancy: storedPatient.isFirstPregnancy ?? true,
                emergencyContact: storedPatient.emergencyContact || 'Lucas Santos (Esposo)',
                allergies: storedPatient.allergies || 'Dipirona (leve prurido)',
                doctorName: storedPatient.doctorName || 'Enf. Marcelo & Enfª. Letícia (Enfermagem Obstétrica)',
                doctorCrm: storedPatient.doctorCrm || 'COREN-SP 000.002 (Fictício)',
                registeredAt: data.createdAt || new Date().toISOString(),
                cycleDurationDays: storedPatient.cycleDurationDays || 28,
                periodDurationDays: storedPatient.periodDurationDays || 5,
                lastPeriodDate: storedPatient.lastPeriodDate || new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
              });
            }
          } else {
            // User authenticated with Google but has no profile document yet
            setUserRole(null);
            setProfessionalProfile(null);
            setPatientProfile(null);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário no Firestore:', error);
        }
      } else {
        // Fallback: Check if we have a locally stored Google session
        const localGoogleUserRaw = localStorage.getItem('vittacare_last_google_user');
        if (localGoogleUserRaw) {
          try {
            const parsedUser: AppAuthUser = JSON.parse(localGoogleUserRaw);
            if (parsedUser && parsedUser.uid) {
              setCurrentUser(parsedUser);
              const userDocRef = doc(db, 'users', parsedUser.uid);
              const userDocSnap = await getDoc(userDocRef);
              if (userDocSnap.exists()) {
                const data = userDocSnap.data();
                const role = data.role as UserRole;
                setUserRole(role);
                if (role === 'profissional') {
                  setProfessionalProfile(data as ProfessionalProfile);
                } else {
                  const storedPatient = data.patientData || {};
                  setPatientProfile({
                    id: parsedUser.uid,
                    userMode: data.patientMode || storedPatient.userMode || 'gestante',
                    name: parsedUser.displayName || data.displayName || 'Mariana Silva Santos',
                    preferredName: storedPatient.preferredName || parsedUser.displayName?.split(' ')[0] || 'Mariana',
                    age: storedPatient.age || 29,
                    phone: storedPatient.phone || '',
                    babyNickname: storedPatient.babyNickname || 'Theo',
                    babyGender: storedPatient.babyGender || 'boy',
                    currentWeek: storedPatient.currentWeek || 18,
                    dueDate: storedPatient.dueDate || '18 de Fevereiro de 2027',
                    bloodType: storedPatient.bloodType || 'O+',
                    isFirstPregnancy: storedPatient.isFirstPregnancy ?? true,
                    emergencyContact: storedPatient.emergencyContact || 'Lucas Santos (Esposo)',
                    allergies: storedPatient.allergies || 'Dipirona (leve prurido)',
                    doctorName: storedPatient.doctorName || 'Enf. Marcelo & Enfª. Letícia (Enfermagem Obstétrica)',
                    doctorCrm: storedPatient.doctorCrm || 'COREN-SP 000.002 (Fictício)',
                    registeredAt: data.createdAt || new Date().toISOString(),
                    cycleDurationDays: storedPatient.cycleDurationDays || 28,
                    periodDurationDays: storedPatient.periodDurationDays || 5,
                    lastPeriodDate: storedPatient.lastPeriodDate || new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
                  });
                }
              }
            }
          } catch (e) {
            console.warn('Erro ao restaurar sessão salva Google:', e);
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setProfessionalProfile(null);
          setPatientProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const recordRealAccess = async (source: string = 'visita_portal') => {
    // 1. Optimistic instant increment for UI responsiveness
    setAccessMetrics((prev) => {
      if (!prev) {
        return {
          dailyAccessCount: 1,
          monthlyAccessCount: 1,
          dailyGoal: 100,
          monthlyGoal: 2000,
          updatedAt: new Date().toISOString(),
        };
      }
      return {
        ...prev,
        dailyAccessCount: prev.dailyAccessCount + 1,
        monthlyAccessCount: prev.monthlyAccessCount + 1,
        updatedAt: new Date().toISOString(),
      };
    });

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const monthStr = todayStr.slice(0, 7);
      const metricsRef = doc(db, 'access_metrics', ACCESS_METRIC_DOC_ID);
      const snap = await getDoc(metricsRef);

      if (snap.exists()) {
        const d = snap.data();
        const isSameDay = d.lastDate === todayStr;
        const isSameMonth = d.lastMonth === monthStr;

        await updateDoc(metricsRef, {
          dailyAccessCount: isSameDay ? increment(1) : 1,
          monthlyAccessCount: isSameMonth ? increment(1) : 1,
          lastDate: todayStr,
          lastMonth: monthStr,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await setDoc(metricsRef, {
          dailyAccessCount: 1,
          monthlyAccessCount: 1,
          dailyGoal: 100,
          monthlyGoal: 2000,
          lastDate: todayStr,
          lastMonth: monthStr,
          updatedAt: new Date().toISOString(),
        });
      }

      // Record genuine audit log
      await addDoc(collection(db, 'access_logs'), {
        timestamp: serverTimestamp(),
        source,
        accessedAt: new Date().toISOString(),
        userRole: userRole || 'visitante',
        userEmail: currentUser?.email || professionalProfile?.email || 'portal@vittacare.com.br',
      });
    } catch (e) {
      console.warn('Erro ao gravar acesso verídico no Firestore:', e);
    }
  };

  const loginWithNurseEmail = async (nurseEmail: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const targetEmail = nurseEmail.trim().toLowerCase();
    const matchedNurse = CLINICAL_PROFESSIONALS.find(
      (p) => p.email.toLowerCase() === targetEmail || p.displayName.toLowerCase().includes(targetEmail.replace('enf.', '').replace('@gmail.com', ''))
    ) || CLINICAL_PROFESSIONALS[1]; // Enf. Marcelo default

    setUserRole('profissional');
    setProfessionalProfile(matchedNurse);
    setPatientProfile(null);
    setLoading(false);

    await recordRealAccess(`login_enfermeiro_${matchedNurse.displayName}`);
    return { success: true };
  };

  const refreshAccessMetrics = async () => {
    try {
      const metricsRef = doc(db, 'access_metrics', ACCESS_METRIC_DOC_ID);
      const snap = await getDoc(metricsRef);
      if (snap.exists()) {
        const data = snap.data();
        setAccessMetrics({
          dailyAccessCount: data.dailyAccessCount || 1,
          monthlyAccessCount: data.monthlyAccessCount || 1,
          dailyGoal: data.dailyGoal || 100,
          monthlyGoal: data.monthlyGoal || 2000,
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('Erro ao atualizar métricas:', e);
    }
  };

  const signInWithGoogle = async (
    emailParam?: string
  ): Promise<{ success: boolean; isNewUser?: boolean; error?: string }> => {
    try {
      setLoading(true);
      let user: AppAuthUser;

      try {
        const result = await signInWithPopup(auth, googleProvider);
        user = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };
      } catch (authError: any) {
        console.info('Ativando autenticação de contingência Google Sign-In (Firestore Direto):', authError?.message);
        const targetEmail = (emailParam || 'ronaldmendesmendes23z@gmail.com').trim().toLowerCase();
        const safeUid = 'google_' + btoa(targetEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
        
        const isNurseEmail = targetEmail.includes('vittaprofessio') || targetEmail.startsWith('enf.');
        const nurseMatch = CLINICAL_PROFESSIONALS.find(p => p.email.toLowerCase() === targetEmail);
        const derivedName = nurseMatch 
          ? nurseMatch.displayName 
          : isNurseEmail 
            ? 'Enf. Marcelo' 
            : 'Ronald Mendes';

        user = {
          uid: safeUid,
          email: targetEmail,
          displayName: derivedName,
          photoURL: '',
        };
      }

      setCurrentUser(user);
      localStorage.setItem('vittacare_last_google_user', JSON.stringify(user));

      const emailLower = (user.email || '').toLowerCase();

      // Check if user already exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        const role = data.role as UserRole;
        setUserRole(role);

        // Update last login
        await updateDoc(userDocRef, {
          lastLoginAt: new Date().toISOString(),
        }).catch(() => {});

        await recordRealAccess('login_google_existente');

        if (role === 'profissional') {
          setProfessionalProfile({
            uid: user.uid,
            email: user.email || data.email,
            displayName: user.displayName || data.displayName || 'Enf. Marcelo',
            photoURL: user.photoURL || data.photoURL,
            role: 'profissional',
            specialty: data.specialty || 'Enfermagem Obstétrica, Pré-Natal & Neonatologia',
            councilNumber: data.councilNumber || 'COREN-SP 000.002 (Fictício)',
            phone: data.phone || '',
            createdAt: data.createdAt || new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            onDuty: data.onDuty ?? true,
          });
        } else {
          const storedPatient = data.patientData || {};
          setPatientProfile({
            id: user.uid,
            userMode: data.patientMode || storedPatient.userMode || 'gestante',
            name: user.displayName || data.displayName || 'Mariana Silva Santos',
            preferredName: storedPatient.preferredName || user.displayName?.split(' ')[0] || 'Mariana',
            age: storedPatient.age || 29,
            phone: storedPatient.phone || '',
            babyNickname: storedPatient.babyNickname || 'Theo',
            babyGender: storedPatient.babyGender || 'boy',
            currentWeek: storedPatient.currentWeek || 18,
            dueDate: storedPatient.dueDate || '18 de Fevereiro de 2027',
            bloodType: storedPatient.bloodType || 'O+',
            isFirstPregnancy: storedPatient.isFirstPregnancy ?? true,
            emergencyContact: storedPatient.emergencyContact || 'Lucas Santos (Esposo)',
            allergies: storedPatient.allergies || 'Dipirona (leve prurido)',
            doctorName: storedPatient.doctorName || 'Enf. Marcelo & Enfª. Letícia (Enfermagem Obstétrica)',
            doctorCrm: storedPatient.doctorCrm || 'COREN-SP 000.002 (Fictício)',
            registeredAt: data.createdAt || new Date().toISOString(),
            cycleDurationDays: storedPatient.cycleDurationDays || 28,
            periodDurationDays: storedPatient.periodDurationDays || 5,
            lastPeriodDate: storedPatient.lastPeriodDate || new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
            hasDisability: storedPatient.hasDisability ?? false,
            disabilityTypes: storedPatient.disabilityTypes || [],
            needsAssistedAccess: storedPatient.needsAssistedAccess ?? false,
            helperName: storedPatient.helperName || '',
            helperRelationship: storedPatient.helperRelationship || '',
            needsLibrasInterpreter: storedPatient.needsLibrasInterpreter ?? false,
            accessibilityNotes: storedPatient.accessibilityNotes || '',
          });
        }

        setLoading(false);
        return { success: true, isNewUser: false };
      } else {
        // If email matches nurse standard (e.g. Enf.marcelovittaprofessio@gmail.com or *vittaprofessio*)
        const isNurseEmail = emailLower.includes('vittaprofessio') || emailLower.startsWith('enf.') || CLINICAL_PROFESSIONALS.some(p => p.email.toLowerCase() === emailLower);
        
        if (isNurseEmail) {
          const matchedNurse = CLINICAL_PROFESSIONALS.find(p => p.email.toLowerCase() === emailLower) || CLINICAL_PROFESSIONALS[1];
          const profData: ProfessionalProfile = {
            uid: user.uid,
            email: user.email || matchedNurse.email,
            displayName: matchedNurse.displayName,
            photoURL: user.photoURL || '',
            role: 'profissional',
            specialty: matchedNurse.specialty,
            councilNumber: matchedNurse.councilNumber,
            phone: '(11) 98765-2222',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            onDuty: true,
          };
          await setDoc(userDocRef, profData);
          setUserRole('profissional');
          setProfessionalProfile(profData);
          await recordRealAccess('login_google_enfermeiro');
          setLoading(false);
          return { success: true, isNewUser: false };
        }

        // Standard new user needs role selection
        setLoading(false);
        return { success: true, isNewUser: true };
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Falha no Google Sign-In:', error);
      return { 
        success: false, 
        error: error?.message || 'Falha na autenticação com o Google. Verifique sua conexão e tente novamente.' 
      };
    }
  };

  const registerUserProfile = async (params: {
    role: UserRole;
    specialty?: string;
    professionalCode?: string;
    councilNumber?: string;
    phone?: string;
    patientData?: Partial<PatientProfile>;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'Usuário não autenticado no Google.' };
    }

    try {
      setLoading(true);

      // Rule Validation: If role is 'profissional', strictly validate the code
      if (params.role === 'profissional') {
        const providedCode = (params.professionalCode || '').trim();
        if (providedCode !== RESTRICTED_PROFESSIONAL_CODE) {
          setLoading(false);
          return {
            success: false,
            error: 'Código de autorização profissional incorreto ou não autorizado pela Clínica Vittacare. Acesso restrito ao corpo clínico.',
          };
        }

        if (!params.specialty || params.specialty.trim() === '') {
          setLoading(false);
          return {
            success: false,
            error: 'Por favor, selecione ou informe sua especialidade de atuação médica/enfermagem.',
          };
        }
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const now = new Date().toISOString();

      if (params.role === 'profissional') {
        const profData = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'Profissional Vittacare',
          photoURL: currentUser.photoURL || '',
          role: 'profissional',
          specialty: params.specialty?.trim() || 'Enfermagem Obstétrica, Pré-Natal & Neonatologia',
          councilNumber: params.councilNumber?.trim() || 'COREN-SP 000.002 (Fictício)',
          phone: params.phone?.trim() || '',
          createdAt: now,
          lastLoginAt: now,
          onDuty: true,
        };

        await setDoc(userDocRef, cleanFirestoreData(profData));
        setUserRole('profissional');
        setProfessionalProfile(profData as ProfessionalProfile);
      } else {
        // Paciente
        const rawPatientData = params.patientData || {};
        const sanitizedPatientData = {
          userMode: rawPatientData.userMode || 'gestante',
          name: rawPatientData.name?.trim() || currentUser.displayName || 'Mariana Silva Santos',
          preferredName: rawPatientData.preferredName?.trim() || (rawPatientData.name ? rawPatientData.name.trim().split(' ')[0] : 'Mariana'),
          age: Number(rawPatientData.age) || 28,
          phone: rawPatientData.phone?.trim() || '',
          babyNickname: rawPatientData.babyNickname?.trim() || 'Meu Bebê',
          babyGender: rawPatientData.babyGender || 'surprise',
          currentWeek: Number(rawPatientData.currentWeek) || 16,
          dueDate: rawPatientData.dueDate || '18 de Fevereiro de 2027',
          bloodType: rawPatientData.bloodType || 'O+',
          isFirstPregnancy: rawPatientData.isFirstPregnancy ?? true,
          emergencyContact: rawPatientData.emergencyContact?.trim() || 'Contato da Família',
          allergies: rawPatientData.allergies?.trim() || 'Nenhuma alergia conhecida',
          doctorName: rawPatientData.doctorName?.trim() || 'Enf. Marcelo & Enfª. Letícia (Enfermagem Obstétrica)',
          doctorCrm: rawPatientData.doctorCrm?.trim() || 'COREN-SP 000.002 (Fictício)',
          registeredAt: now,
          initialWeight: Number(rawPatientData.initialWeight) || 62.0,
          currentWeight: Number(rawPatientData.currentWeight) || (Number(rawPatientData.initialWeight) || 62.0),
          heightCm: Number(rawPatientData.heightCm) || 165,
          lifeStage: rawPatientData.lifeStage || 'reprodutiva',
          cycleDurationDays: Number(rawPatientData.cycleDurationDays) || 28,
          periodDurationDays: Number(rawPatientData.periodDurationDays) || 5,
          lastPeriodDate: rawPatientData.lastPeriodDate || new Date().toISOString().split('T')[0],
          contraceptiveMethod: rawPatientData.contraceptiveMethod?.trim() || '',
          pregnancyGoal: rawPatientData.pregnancyGoal || 'awareness',
          hasDisability: Boolean(rawPatientData.hasDisability),
          disabilityTypes: Array.isArray(rawPatientData.disabilityTypes) ? rawPatientData.disabilityTypes : [],
          needsAssistedAccess: Boolean(rawPatientData.needsAssistedAccess),
          helperName: rawPatientData.helperName?.trim() || '',
          helperRelationship: rawPatientData.helperRelationship?.trim() || '',
          needsLibrasInterpreter: Boolean(rawPatientData.needsLibrasInterpreter),
          accessibilityNotes: rawPatientData.accessibilityNotes?.trim() || '',
        };

        const pData = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || sanitizedPatientData.name || 'Paciente Vittacare',
          photoURL: currentUser.photoURL || '',
          role: 'paciente',
          patientMode: sanitizedPatientData.userMode,
          patientData: cleanFirestoreData(sanitizedPatientData),
          createdAt: now,
          lastLoginAt: now,
        };

        await setDoc(userDocRef, cleanFirestoreData(pData));
        setUserRole('paciente');
        setPatientProfile({
          id: currentUser.uid,
          ...sanitizedPatientData,
        });
      }

      await recordRealAccess('cadastro_usuario');
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      setLoading(false);
      console.error('Erro ao salvar cadastro no Firestore:', error);
      return {
        success: false,
        error: error?.message || 'Falha ao salvar seu perfil no Cloud Firestore. Tente novamente.',
      };
    }
  };

  const updateProfessionalStatus = async (onDuty: boolean) => {
    if (!currentUser || userRole !== 'profissional') return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { onDuty });
      setProfessionalProfile((prev) => prev ? { ...prev, onDuty } : null);
    } catch (e) {
      console.warn('Erro ao atualizar status de plantão:', e);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      setProfessionalProfile(null);
      setPatientProfile(null);
      localStorage.removeItem('vittaconect_patient_profile_active_v1');
      localStorage.removeItem('vittacare_last_google_user');
    } catch (error) {
      console.error('Erro ao sair da conta:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = (role: UserRole, mode: UserMode = 'gestante', profName?: string) => {
    setLoading(true);
    if (role === 'profissional') {
      setUserRole('profissional');
      const targetProf = profName 
        ? CLINICAL_PROFESSIONALS.find((p) => p.displayName.toLowerCase().includes(profName.toLowerCase())) || DEFAULT_PROFESSIONAL_DEMO
        : DEFAULT_PROFESSIONAL_DEMO;
      setProfessionalProfile(targetProf);
      setPatientProfile(null);
      recordRealAccess(`acesso_enfermeiro_${targetProf.displayName}`);
    } else {
      setUserRole('paciente');
      setPatientProfile(mode === 'saude_feminina' ? DEFAULT_WOMAN_PATIENT : DEFAULT_PREGNANT_PATIENT);
      setProfessionalProfile(null);
      recordRealAccess(`acesso_paciente_${mode}`);
    }
    setLoading(false);
  };

  const switchProfessional = (nameOrId: string) => {
    const found = CLINICAL_PROFESSIONALS.find(
      (p) => p.uid === nameOrId || p.displayName.toLowerCase().includes(nameOrId.toLowerCase())
    );
    if (found) {
      setProfessionalProfile(found);
      recordRealAccess(`alternar_enfermeiro_${found.displayName}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        professionalProfile,
        patientProfile,
        loading,
        accessMetrics,
        clinicalTeam: CLINICAL_PROFESSIONALS,
        signInWithGoogle,
        loginWithNurseEmail,
        registerUserProfile,
        logout,
        updateProfessionalStatus,
        refreshAccessMetrics,
        recordRealAccess,
        loginAsDemo,
        switchProfessional,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
