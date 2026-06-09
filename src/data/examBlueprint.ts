import type { Category, Difficulty, QuestionType } from "../types";

export interface ExamBlueprint {
  examName: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  passScore: number;
  typeTargets: Partial<Record<QuestionType, number>>;
  categoryWeights: Partial<Record<Category, number>>;
  difficultyWeights: Partial<Record<Difficulty, number>>;
  includeSubjective: boolean;
  includeTableQuestions: boolean;
  includePromptPractice: boolean;
  includeEssay: boolean;
}

export const examBlueprint: ExamBlueprint = {
  examName: "AIPOT 2급 CBT 모의시험",
  totalQuestions: 45,
  timeLimitMinutes: 45,
  passScore: 70,
  typeTargets: {
    multiple: 30,
    tableChoice: 5,
    ox: 5,
    short: 5,
    blank: 0,
    essay: 0,
    prompt: 0,
  },
  categoryWeights: {
    "AI 기본 개념": 1,
    "머신러닝/딥러닝": 1,
    "지도학습/비지도학습/강화학습": 1,
    "생성형 AI": 1,
    LLM: 1,
    "프롬프트 작성법": 1.2,
    "Zero-shot/Few-shot": 1,
    "모델 설정값": 0.8,
    "환각/RAG": 1,
    "이미지 생성 AI": 1,
    "GAN/Diffusion": 0.8,
    "OCR/STT/TTS": 1,
    "개인정보/저작권/윤리": 1.2,
    "업무 활용": 0.8,
  },
  difficultyWeights: {
    쉬움: 0.35,
    보통: 0.5,
    어려움: 0.15,
  },
  includeSubjective: true,
  includeTableQuestions: true,
  includePromptPractice: false,
  includeEssay: false,
};

export const blueprintTypeSummary = (blueprint: ExamBlueprint = examBlueprint) =>
  Object.entries(blueprint.typeTargets)
    .filter(([, count]) => (count ?? 0) > 0)
    .map(([type, count]) => ({ type: type as QuestionType, count: count ?? 0 }));
