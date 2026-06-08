export const CATEGORIES = [
  "AI 기본 개념",
  "머신러닝/딥러닝",
  "지도학습/비지도학습/강화학습",
  "생성형 AI",
  "LLM",
  "프롬프트 작성법",
  "Zero-shot/Few-shot",
  "모델 설정값",
  "환각/RAG",
  "이미지 생성 AI",
  "GAN/Diffusion",
  "OCR/STT/TTS",
  "개인정보/저작권/윤리",
  "업무 활용",
  "심화 학습",
] as const;

export const DIFFICULTIES = ["쉬움", "보통", "어려움"] as const;
export const QUESTION_TYPES = ["multiple", "ox", "short", "essay", "blank", "prompt"] as const;
export const SOURCE_TYPES = ["빈출개념", "예상문제", "공개샘플변형", "실무형"] as const;
export const QUALITY_STATUSES = ["정상", "문장수정", "보기수정", "정답애매", "해설부족", "범위초과", "삭제권장"] as const;
export const EXAM_SUITABILITIES = ["실전적합", "학습적합", "심화학습", "수정필요", "삭제권장"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type QuestionType = (typeof QUESTION_TYPES)[number];
export type SourceType = (typeof SOURCE_TYPES)[number];
export type QualityStatus = (typeof QUALITY_STATUSES)[number];
export type ExamSuitability = (typeof EXAM_SUITABILITIES)[number];
export type GradeStatus = "correct" | "partial" | "wrong" | "unchecked";
export type AppPage = "home" | "study" | "exam" | "result" | "wrong" | "favorite" | "stats" | "bank" | "summary";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple: "객관식",
  ox: "OX",
  short: "단답형",
  essay: "서술형",
  blank: "빈칸",
  prompt: "프롬프트 작성",
};

export interface Question {
  id: string;
  type: QuestionType;
  category: Category;
  difficulty: Difficulty;
  question: string;
  choices: string[];
  answer: string;
  acceptedAnswers: string[];
  keywords: string[];
  explanation: string;
  wrongExplanations: string[];
  examPoint: string;
  memoryTip: string;
  relatedConcept: string;
  sourceType: SourceType;
  tags: string[];
  qualityStatus: QualityStatus;
  examSuitability: ExamSuitability;
  checklist?: string[];
  partialCriteria?: string[];
}

export interface GradeResult {
  status: GradeStatus;
  scoreRatio: number;
  matchedKeywords: string[];
  message: string;
}

export interface AttemptRecord {
  id: string;
  questionId: string;
  mode: "study" | "exam";
  answeredAt: string;
  userAnswer: string;
  result: GradeStatus;
  scoreRatio: number;
  category: Category;
  difficulty: Difficulty;
  type: QuestionType;
}

export interface WrongNoteEntry {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  wrongAt: string;
  category: Category;
  difficulty: Difficulty;
  retryCount: number;
  lastResult: GradeStatus;
  memoryTip: string;
}

export interface FavoriteEntry {
  questionId: string;
  addedAt: string;
}

export interface ExamCategoryBreakdown {
  total: number;
  earned: number;
}

export interface ExamResult {
  id: string;
  date: string;
  score: number;
  maxScore: number;
  passScore: number;
  passed: boolean;
  correctCount: number;
  partialCount: number;
  wrongCount: number;
  questionCount: number;
  durationSeconds: number;
  questionIds: string[];
  answers: Record<string, string>;
  grading: Record<string, GradeStatus>;
  categoryBreakdown: Record<string, ExamCategoryBreakdown>;
  wrongQuestionIds: string[];
}

export interface ExamSettings {
  questionCount: number;
  minutes: number;
  categories: Category[];
  difficulties: Difficulty[];
  includeEssay: boolean;
  includePrompt: boolean;
  wrongFirst: boolean;
  favoriteOnly: boolean;
}

export interface UserSettings {
  passScore: number;
  darkMode: boolean;
}
