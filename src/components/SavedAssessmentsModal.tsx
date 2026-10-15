import React, { useState, useEffect } from 'react';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  saveAssessmentToFirestore, 
  getUserAssessments, 
  deleteUserAssessment, 
  SavedAssessmentRecord 
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { SolarAssessmentInput, AssessmentResult } from '../types/solar';
import { 
  Bookmark, 
  Trash2, 
  LogOut, 
  LogIn, 
  X, 
  Check, 
  Clock, 
  FolderOpen, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

interface SavedAssessmentsModalProps {
  currentInput: SolarAssessmentInput;
  currentResult: AssessmentResult;
  onLoadAssessment: (record: SavedAssessmentRecord) => void;
  onClose: () => void;
}

export const SavedAssessmentsModal: React.FC<SavedAssessmentsModalProps> = ({
  currentInput,
  currentResult,
  onLoadAssessment,
  onClose
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [assessments, setAssessments] = useState<SavedAssessmentRecord[]>([]);
  const [titleInput, setTitleInput] = useState<string>(
    `${currentResult.recommendedCapacityKw} kWp Rooftop Plan (${currentInput.stateId.toUpperCase()})`
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        loadList();
      } else {
        setAssessments([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadList = async () => {
    setIsLoadingList(true);
    setErrorMsg(null);
    try {
      const records = await getUserAssessments();
      setAssessments(records);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not fetch saved assessments. Please check network connection.');
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleSignIn = async () => {
    setErrorMsg(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-in was cancelled or encountered an error.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSaveCurrent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      handleSignIn();
      return;
    }
    if (!titleInput.trim()) return;

    setIsSaving(true);
    setErrorMsg(null);
    try {
      await saveAssessmentToFirestore(titleInput, currentInput, currentResult);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      loadList();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save to Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUserAssessment(id);
      setAssessments(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      setErrorMsg('Could not delete assessment from Firestore.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm tracking-tight">
              Cloud Solar Dossiers (Firebase Auth & Firestore)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* User Auth Status Banner */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-9 h-9 rounded-full border border-slate-300"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {user.displayName || 'Authenticated Citizen'}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {user.email} · Google Verified
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  Sign in with Google Account
                </div>
                <div className="text-[11px] text-slate-500">
                  Save multiple property plans and sync your PM Surya Ghar eligibility across devices.
                </div>
              </div>
            )}

            <div>
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Save Current Assessment Section */}
          {user && (
            <form onSubmit={handleSaveCurrent} className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 text-xs uppercase tracking-wide">
                  Save Active Simulation to Cloud
                </span>
                <span className="text-[11px] text-amber-800 font-mono">
                  {currentResult.recommendedCapacityKw} kWp · {currentResult.outcomeLabel}
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={120}
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. My Delhi Terrace Solar Plan"
                  className="flex-1 p-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors shrink-0 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Plan'}
                </button>
              </div>

              {saveSuccess && (
                <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Successfully saved to your Cloud Firestore profile!</span>
                </div>
              )}
            </form>
          )}

          {/* Saved Assessments History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Your Saved Assessments ({assessments.length})
              </span>
              {user && (
                <button
                  onClick={loadList}
                  className="text-[11px] text-amber-700 hover:underline font-mono"
                >
                  Refresh
                </button>
              )}
            </div>

            {!user ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                Please sign in with Google to view and manage your saved solar assessments.
              </div>
            ) : isLoadingList ? (
              <div className="p-8 text-center text-slate-400 border border-slate-200 rounded-xl">
                Loading saved dossiers from Firestore...
              </div>
            ) : assessments.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl">
                No saved assessments found. Save your current simulation above!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {assessments.map(record => (
                  <div
                    key={record.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        {record.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                        <span>{record.result.recommendedCapacityKw} kWp</span>
                        <span aria-hidden="true">·</span>
                        <span>{record.result.outcomeLabel.split('(')[0]}</span>
                        <span aria-hidden="true">·</span>
                        <span>Score: {record.result.suitabilityScore}/100</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onLoadAssessment(record);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded-lg text-xs transition-colors"
                        title="Load into Simulator"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Load</span>
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
