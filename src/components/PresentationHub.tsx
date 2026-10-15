import React, { useState, useEffect } from 'react';
import { TWO_MINUTE_PITCH, PRESENTATION_QUESTIONS, PitchSlide } from '../data/presentationContent';
import { Play, Pause, RotateCcw, Copy, Check, ChevronRight, Award, ExternalLink, BookOpen, Clock } from 'lucide-react';

export const PresentationHub: React.FC = () => {
  const [activePitchIndex, setActivePitchIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [copiedSpeech, setCopiedSpeech] = useState<boolean>(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string>('q1-indian-context');

  const currentSlide: PitchSlide = TWO_MINUTE_PITCH[activePitchIndex];

  // Timer logic for 2-minute pitch practice
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev >= 120) {
            setIsPlaying(false);
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleResetTimer = () => {
    setIsPlaying(false);
    setTimerSeconds(0);
  };

  const handleCopyPitch = () => {
    const fullText = TWO_MINUTE_PITCH.map(
      s => `--- ${s.step.toUpperCase()} (${s.timeSeconds}s) ---\n${s.speechScript}\n`
    ).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedSpeech(true);
    setTimeout(() => setCopiedSpeech(false), 2000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-10">
      {/* 2-Minute Pitch Practice Deck Section */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Challenge Card 26 Pitch Requirement</span>
              <span aria-hidden="true">·</span>
              <span>SDG 7 Presentation</span>
              <span aria-hidden="true">·</span>
              <span>2-Minute Cap</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              2-Minute Pitch Deck & Speech Simulator
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Strict 5-part structure: Problem (30s) → Solution (30s) → Impact (30s) → Tech Used (15s) → Limitation (15s).
            </p>
          </div>

          {/* Interactive Timer & Controls */}
          <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2.5 rounded-xl shrink-0 font-mono">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-base font-bold text-amber-300 tabular-nums">
              {formatTime(timerSeconds)}
            </span>
            <span className="text-xs text-slate-400">/ 2:00</span>
            
            <div className="flex items-center gap-1.5 ml-2 border-l border-slate-700 pl-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 hover:text-amber-400 transition-colors"
                title={isPlaying ? 'Pause' : 'Start Timer'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={handleResetTimer}
                className="p-1 hover:text-amber-400 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-slate-100">
          {TWO_MINUTE_PITCH.map((slide, idx) => {
            const isActive = idx === activePitchIndex;
            return (
              <button
                key={slide.step}
                onClick={() => setActivePitchIndex(idx)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{slide.step}</span>
                <span className="text-[11px] opacity-75 font-mono">({slide.timeSeconds}s)</span>
              </button>
            );
          })}
        </div>

        {/* Active Slide Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Key Slide Bullets for Judges */}
          <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-amber-700 uppercase">
                Slide Summary · Visual Keypoints
              </span>
              <span className="text-xs font-medium text-slate-600">
                Target: {currentSlide.timeSeconds} seconds
              </span>
            </div>

            <h4 className="text-lg font-bold text-slate-900">
              {currentSlide.step}
            </h4>

            <ul className="space-y-2.5 text-sm text-slate-700">
              {currentSlide.keyBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold shrink-0">·</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Goal: {currentSlide.sdgGoal}</span>
              <span className="font-mono">Part {activePitchIndex + 1} of 5</span>
            </div>
          </div>

          {/* Natural Speech Delivery Script */}
          <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                  Spoken Delivery Script (Read Aloud)
                </span>
                <button
                  onClick={handleCopyPitch}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {copiedSpeech ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSpeech ? 'Copied Full Script!' : 'Copy Full 2-Min Script'}</span>
                </button>
              </div>

              <blockquote className="text-base text-slate-800 leading-relaxed font-normal bg-amber-50/40 p-4 rounded-xl border border-amber-200/50">
                "{currentSlide.speechScript}"
              </blockquote>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <button
                disabled={activePitchIndex === 0}
                onClick={() => setActivePitchIndex(prev => Math.max(0, prev - 1))}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
              >
                Previous Step
              </button>

              <button
                disabled={activePitchIndex === TWO_MINUTE_PITCH.length - 1}
                onClick={() => setActivePitchIndex(prev => Math.min(TWO_MINUTE_PITCH.length - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors disabled:opacity-40 shadow-xs"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive 6-Question Research Dossier */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Challenge Card 26 Deep-Dive</span>
              <span aria-hidden="true">·</span>
              <span>Project Documentation & Answers</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Detailed Answers to the 6 Challenge Questions
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Thorough, technically verified explanations for academic presentations and judge questions.
            </p>
          </div>
        </div>

        {/* Navigation for Questions 1 through 6 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 py-4 border-b border-slate-100">
          {PRESENTATION_QUESTIONS.map(q => {
            const isSelected = q.id === activeQuestionId;
            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestionId(q.id)}
                className={`p-3 text-left rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] font-mono uppercase opacity-75">
                  Question 0{q.questionNumber}
                </div>
                <div className="text-xs font-bold truncate mt-0.5">
                  {q.title.split(' ')[0]} {q.title.split(' ')[1]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Question Detail Card */}
        {(() => {
          const q = PRESENTATION_QUESTIONS.find(item => item.id === activeQuestionId) || PRESENTATION_QUESTIONS[0];
          return (
            <div className="pt-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wide">
                    Question {q.questionNumber} of 6 · {q.badge}
                  </span>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    {q.title}
                  </h4>
                </div>
                <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-md">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>MNRE & CEA Grounded</span>
                </div>
              </div>

              {/* Summary Lead */}
              <p className="text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {q.summary}
              </p>

              {/* Point-by-point breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.points.map((pt, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                    <h5 className="text-sm font-bold text-slate-900">
                      {pt.heading}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pt.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Optional Table */}
              {q.tableData && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 mt-4">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        {q.tableData.headers.map((h, i) => (
                          <th key={i} className="p-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {q.tableData.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-slate-800">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Highlight Callout */}
              {q.callout && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{q.callout}</span>
                </div>
              )}
            </div>
          );
        })()}
      </section>
    </div>
  );
};
