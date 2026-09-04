export type SupportedLang = 'en' | 'ko' | 'ja';

export interface UseCaseItem {
  title: string;
  desc: string;
}

export interface StepItem {
  step: number;
  title: string;
  desc: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedToolItem {
  id: string;
  name: string;
  desc: Record<SupportedLang, string>;
  icon: string;
}

export interface ToolContentData {
  id: string;
  meta: {
    title: Record<SupportedLang, string>;
    description: Record<SupportedLang, string>;
  };
  overview: Record<SupportedLang, string>;
  whenToUse: Record<SupportedLang, UseCaseItem[]>;
  howToUse: Record<SupportedLang, StepItem[]>;
  example: {
    inputTitle?: Record<SupportedLang, string>;
    input: string;
    outputTitle?: Record<SupportedLang, string>;
    output: string;
  };
  faq: Record<SupportedLang, FaqItem[]>;
  notes: Record<SupportedLang, string[]>;
  relatedTools: RelatedToolItem[];
}
