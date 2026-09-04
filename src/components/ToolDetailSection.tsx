import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  HelpCircle,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ArrowRight,
  Code,
  Shield,
  Braces,
  FileJson,
  Binary,
  Link as LinkIcon,
  Fingerprint,
  KeyRound,
  FileText,
  Edit3,
  Palette,
  QrCode,
  Image,
  Cpu,
  Wand2,
  Scissors,
  Sliders,
  ShieldAlert,
  ListOrdered,
  Terminal,
  type LucideIcon
} from 'lucide-react';
import { getToolContent, SupportedLang } from '../data/toolsContent';

interface ToolDetailSectionProps {
  toolId: string;
}

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  HelpCircle,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Code,
  Shield,
  Braces,
  FileJson,
  Binary,
  Link: LinkIcon,
  Fingerprint,
  KeyRound,
  FileText,
  Edit3,
  Palette,
  QrCode,
  Image,
  Cpu,
  Wand2,
  Scissors,
  Sliders,
  ShieldAlert,
  ListOrdered,
  Terminal
};

export function ToolDetailSection({ toolId }: ToolDetailSectionProps) {
  const { i18n } = useTranslation();
  const lang = (['en', 'ko', 'ja'].includes(i18n.language) ? i18n.language : 'en') as SupportedLang;
  const tool = getToolContent(toolId);

  if (!tool) {
    return null;
  }

  const currentLang = i18n.language;
  const langPrefix = currentLang === 'en' ? '' : `/${currentLang}`;

  const labels = {
    en: {
      whenToUse: 'When to Use This Tool',
      howToUse: 'How to Use',
      example: 'Input & Output Example',
      faq: 'Frequently Asked Questions',
      notes: 'Engineering & Privacy Notes',
      related: 'Related Developer Tools',
      openTool: 'Open tool'
    },
    ko: {
      whenToUse: '이런 상황에서 사용하세요',
      howToUse: '사용 방법 및 실무 가이드',
      example: '입출력 실무 예시',
      faq: '자주 묻는 질문 (FAQ)',
      notes: '기술 및 보안 유의사항',
      related: '함께 사용하면 좋은 관련 도구',
      openTool: '도구 바로가기'
    },
    ja: {
      whenToUse: 'このような場面で活用できます',
      howToUse: '使い方と実務ガイド',
      example: '入出力の実務例',
      faq: 'よくある質問（FAQ）',
      notes: '技術・セキュリティ上の注意事項',
      related: 'あわせて使える関連ツール',
      openTool: 'ツールを開く'
    }
  }[lang];

  return (
    <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700 max-w-5xl mx-auto space-y-14 pb-16 px-4">
      {/* 1. 이런 상황에서 사용하세요 (When to Use) */}
      <section>
        <div className="flex items-center gap-2.5 mb-4 text-slate-900 dark:text-white">
          <Sparkles className="w-6 h-6 text-blue-500 shrink-0" />
          <h2 className="text-2xl font-bold">{labels.whenToUse}</h2>
        </div>

        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base mb-6">
          {tool.overview[lang]}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tool.whenToUse[lang].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500/50 transition-colors"
            >
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {item.title}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 사용 방법 (How to Use) */}
      <section className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2.5 mb-6 text-slate-900 dark:text-white">
          <HelpCircle className="w-6 h-6 text-emerald-500 shrink-0" />
          <h2 className="text-2xl font-bold">{labels.howToUse}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tool.howToUse[lang].map((item) => (
            <div
              key={item.step}
              className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden"
            >
              <div className="text-3xl font-black text-slate-100 dark:text-slate-700/60 absolute top-2 right-3 select-none">
                0{item.step}
              </div>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center mb-3">
                {item.step}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 입출력 예시 (Example) */}
      <section className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2.5 mb-6 text-slate-900 dark:text-white">
          <FileCode className="w-6 h-6 text-purple-500 shrink-0" />
          <h2 className="text-2xl font-bold">{labels.example}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 text-slate-200 rounded-xl p-5 font-mono text-xs overflow-x-auto shadow-sm border border-slate-800">
            <div className="text-slate-400 font-semibold mb-2 flex items-center justify-between">
              <span>INPUT</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">{tool.example.input}</pre>
          </div>

          <div className="bg-slate-900 text-slate-200 rounded-xl p-5 font-mono text-xs overflow-x-auto shadow-sm border border-slate-800">
            <div className="text-slate-400 font-semibold mb-2 flex items-center justify-between">
              <span>OUTPUT</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed text-emerald-400">{tool.example.output}</pre>
          </div>
        </div>
      </section>

      {/* 4. 자주 묻는 질문 (FAQ) */}
      <section className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2.5 mb-6 text-slate-900 dark:text-white">
          <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
          <h2 className="text-2xl font-bold">{labels.faq}</h2>
        </div>

        <div className="space-y-4">
          {tool.faq[lang].map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-start gap-2">
                <span className="text-blue-500 font-extrabold">Q.</span>
                <span>{item.q}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-5">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 기술 및 보안 유의사항 (Notes) */}
      <section className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-5">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm mb-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{labels.notes}</span>
          </div>
          <ul className="space-y-2 text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed list-disc list-inside">
            {tool.notes[lang].map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. 관련 도구 추천 (Related Developer Tools) */}
      <section className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
            <Layers className="w-6 h-6 text-blue-500 shrink-0" />
            <h2 className="text-2xl font-bold">{labels.related}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tool.relatedTools.map((rel) => {
            const IconComponent = iconMap[rel.icon] || Code;
            return (
              <Link
                key={rel.id}
                to={`${langPrefix}/${rel.id}`}
                className="group p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {rel.desc[lang]}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  <span>{labels.openTool}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
