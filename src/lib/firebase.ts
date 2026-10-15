import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { SolarAssessmentInput, AssessmentResult } from '../types/solar';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or database uninitialized:', error.message);
      return false;
    }
    // Non-fatal if test doc doesn't exist or permissions deny reading 'test'
    return true;
  }
}

// Sign-in with Google popup
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Sync user doc
    if (result.user) {
      const userRef = doc(db, 'users', result.user.uid);
      const userPayload = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || 'Anonymous User',
        photoURL: result.user.photoURL || '',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, userPayload, { merge: true }).catch(() => {
        // user profile sync is non-blocking
      });
    }
    return result.user;
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  }
}

export async function signOutUser() {
  await fbSignOut(auth);
}

export interface SavedAssessmentRecord {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  input: SolarAssessmentInput;
  result: AssessmentResult;
}

// Save Assessment to Firestore
export async function saveAssessmentToFirestore(
  title: string,
  input: SolarAssessmentInput,
  result: AssessmentResult
): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('User must be logged in to save an assessment.');
  }

  const assessmentId = `assess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `assessments/${assessmentId}`;

  const payload = {
    userId: auth.currentUser.uid,
    title: title.slice(0, 120),
    stateId: input.stateId,
    buildingType: input.buildingType,
    roofType: input.roofType,
    roofCondition: input.roofCondition,
    totalRoofAreaSqFt: Number(input.totalRoofAreaSqFt),
    usableAreaPercent: Number(input.usableAreaPercent),
    effectiveUsableAreaSqFt: Number(result.effectiveUsableAreaSqFt),
    shadingLevel: input.shadingLevel,
    roofOrientation: input.roofOrientation,
    monthlyUnitsKwh: Number(input.monthlyUnitsKwh),
    monthlyBillInr: Number(input.monthlyBillInr),
    sanctionedLoadKw: Number(input.sanctionedLoadKw),
    recommendedCapacityKw: Number(result.recommendedCapacityKw),
    annualGenerationKwh: Number(result.annualGenerationKwh),
    pmSuryaGharSubsidyInr: Number(result.pmSuryaGharSubsidyInr),
    netInvestmentInr: Number(result.netInvestmentInr),
    paybackPeriodYears: Number(result.paybackPeriodYears),
    co2OffsetTonnesAnnual: Number(result.co2OffsetTonnesAnnual),
    outcome: result.outcome,
    outcomeLabel: result.outcomeLabel,
    suitabilityScore: Number(result.suitabilityScore),
    notes: `Calculated under PM Surya Ghar Yojana. Location: ${input.stateId}`,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'assessments', assessmentId), payload);
    return assessmentId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// List user assessments
export async function getUserAssessments(): Promise<SavedAssessmentRecord[]> {
  if (!auth.currentUser) return [];

  const path = 'assessments';
  try {
    const q = query(collection(db, path), where('userId', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(docSnap => {
      const d = docSnap.data();
      return {
        id: docSnap.id,
        userId: d.userId,
        title: d.title || 'Untitled Assessment',
        createdAt: d.createdAt,
        input: {
          buildingType: d.buildingType,
          roofOwnership: 'sole_owner',
          roofType: d.roofType,
          roofCondition: d.roofCondition,
          totalRoofAreaSqFt: d.totalRoofAreaSqFt,
          usableAreaPercent: d.usableAreaPercent,
          shadingLevel: d.shadingLevel,
          roofOrientation: d.roofOrientation,
          stateId: d.stateId,
          monthlyUnitsKwh: d.monthlyUnitsKwh,
          monthlyBillInr: d.monthlyBillInr,
          sanctionedLoadKw: d.sanctionedLoadKw
        },
        result: {
          outcome: d.outcome,
          outcomeLabel: d.outcomeLabel,
          headlineSummary: '',
          suitabilityScore: d.suitabilityScore,
          effectiveUsableAreaSqFt: d.effectiveUsableAreaSqFt,
          maxFeasibleCapacityKw: Math.floor(d.effectiveUsableAreaSqFt / 100),
          recommendedCapacityKw: d.recommendedCapacityKw,
          monthlyEstimatedGenerationKwh: Math.round(d.annualGenerationKwh / 12),
          annualGenerationKwh: d.annualGenerationKwh,
          annualSavingsInr: Math.round(d.annualGenerationKwh * 7),
          pmSuryaGharSubsidyInr: d.pmSuryaGharSubsidyInr,
          estimatedGrossCostInr: d.recommendedCapacityKw * 65000,
          netInvestmentInr: d.netInvestmentInr,
          paybackPeriodYears: d.paybackPeriodYears,
          co2OffsetTonnesAnnual: d.co2OffsetTonnesAnnual,
          decisionTreePath: [],
          criticalFlags: [],
          recommendations: [],
          nextSteps: []
        }
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Delete user assessment
export async function deleteUserAssessment(assessmentId: string) {
  if (!auth.currentUser) return;
  const path = `assessments/${assessmentId}`;
  try {
    await deleteDoc(doc(db, 'assessments', assessmentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
