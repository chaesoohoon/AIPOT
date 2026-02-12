import { SlideContent, SlideType } from './types';
import { 
  Cpu, Users, BookOpen, Layers, Target, 
  MonitorPlay, Briefcase, Zap, Star, ShieldCheck, 
  TrendingUp, Award, Video, PenTool
} from 'lucide-react';

export const SLIDES: SlideContent[] = [
  // 1. Opening
  {
    id: 1,
    type: SlideType.COVER,
    title: "AI-POT 2급 취득 및\n영상콘텐츠 제작 과정",
    subtitle: "AI는 도구가 아니라 인프라가 되었습니다.",
    highlight: "기업은 AI를 '사용하는 사람'이 아니라\n'활용해 결과를 만드는 사람'을 원합니다."
  },
  // 2. Industry Changes
  {
    id: 2,
    type: SlideType.BULLET_LIST,
    title: "산업 환경 변화",
    subtitle: "현장에서는 AI를 실질적으로 다룰 수 있는 인력이 부족합니다.",
    body: [
      "생성형 AI의 실무 적용 가속화",
      "콘텐츠 산업의 자동화 확대",
      "디지털 마케팅 직무의 전면 재편"
    ]
  },
  // 3. Target Analysis (Modified for Discharged Soldiers)
  {
    id: 3,
    type: SlideType.GRID_CARDS,
    title: "타겟 분석 : 제대 군인",
    subtitle: "군 경험(Discipline) + AI 기술(Skill) = 성공적 사회 복귀",
    items: [
      { title: "신속한 사회 적응", desc: "급변하는 디지털 환경에 즉각 대응 가능한 실무 역량 탑재" },
      { title: "커리어 레벨업", desc: "단순 노무/사무직을 넘어 고부가가치 크리에이티브 전문가로 도약" },
      { title: "경험의 자산화", desc: "군 생활의 작전/기획 경험을 AI 프롬프트 엔지니어링 능력으로 전환" }
    ]
  },
  // 4. Program Proposal Title
  {
    id: 4,
    type: SlideType.SECTION_HEADER,
    title: "프로그램 제안",
    subtitle: "단순 교육이 아닌 직무 전환형 역량 설계",
    highlight: "AI-POT 2급 취득 및\n영상콘텐츠 제작 전문가 과정"
  },
  // 5. Instructor Profile (NEW)
  {
    id: 5,
    type: SlideType.PROFILE,
    title: "강 민 기",
    subtitle: "Lead Instructor",
    highlight: "창의적인 포트폴리오와 AI 실무의 기준",
    // Updated image URL from Github
    image: "https://github.com/chaesoohoon/short-38h/blob/main/kang.jpg?raw=true", 
    body: [
      "한남대학교 디자인과 학사 / 직업능력개발훈련교사 3급",
      "제 19회 I-TOP 경진대회 산업통상자원부 장관상",
      "제 48회 전국기능경기대회 그래픽디자인 동상",
      "現 The국제직업전문학교 디자인/영상 AI 전임",
      "前 (주)쓰임받는사람들 디자인 총괄 기획",
      "Adobe Certified & Generative AI Specialist"
    ]
  },
  // 6. Philosophy
  {
    id: 6,
    type: SlideType.PROCESS_FLOW,
    title: "프로그램 설계 철학",
    subtitle: "능력 축적형 계단식 구조",
    items: [
      { title: "Step 1. 이해", desc: "AI 구조 및 원리 파악" },
      { title: "Step 2. 설계", desc: "프롬프트 엔지니어링" },
      { title: "Step 3. 제작", desc: "디지털 콘텐츠 실무" },
      { title: "Step 4. 확장", desc: "AI 기반 자동화 응용" }
    ]
  },
  // 7. Curriculum (Timeline)
  {
    id: 7,
    type: SlideType.TIMELINE,
    title: "80시간 전략적 배치",
    subtitle: "이론부터 실무 융합까지",
    items: [
      { title: "Phase 1", desc: "AI Foundation (이론/시험구조)" },
      { title: "Phase 2", desc: "Prompt Engineering (설계 실습)" },
      { title: "Phase 3", desc: "Visual Production (디자인 실무)" },
      { title: "Phase 4", desc: "Motion & AI Integration (영상/융합)" }
    ]
  },
  // 8. Differentiation
  {
    id: 8,
    type: SlideType.GRID_CARDS,
    title: "AI-POT 대비 차별화 전략",
    subtitle: "자격 취득을 '결과'로 만드는 구조",
    items: [
      { title: "유형 분석", desc: "기출 및 시험 유형 완전 분석" },
      { title: "실습 강화", desc: "단순 암기가 아닌 문제풀이 기반 실습" },
      { title: "비교 학습", desc: "다양한 모델 간 비교를 통한 이해도 상승" },
      { title: "시뮬레이션", desc: "실전과 동일한 환경에서의 모의 훈련" }
    ]
  },
  // 9. Prompt Depth
  {
    id: 9,
    type: SlideType.BULLET_LIST,
    title: "프롬프트 교육의 깊이",
    subtitle: "단순 질문법이 아닌, AI를 통제하는 능력 확보",
    body: [
      "역할 기반 제어 전략 (Persona)",
      "조건 및 제약 사항 정교화 설계",
      "정보 추출 및 데이터 분류 설계",
      "Chain of Thought 단계적 명령 구조"
    ]
  },
  // 10. Content Output
  {
    id: 10,
    type: SlideType.PROCESS_FLOW,
    title: "콘텐츠 제작 역량 확장",
    subtitle: "수료 시 완벽한 포트폴리오 완성",
    items: [
      { title: "SNS", desc: "카드뉴스, 웹배너" },
      { title: "Commerce", desc: "상세페이지 기획" },
      { title: "Shorts", desc: "숏폼 영상 제작" },
      { title: "AI Media", desc: "생성형 비디오/이미지" }
    ]
  },
  // 11. Video Tools
  {
    id: 11,
    type: SlideType.GRID_CARDS,
    title: "실전 영상 파트 고도화",
    subtitle: "기초 → 실무 → 고급 확장 구조",
    items: [
      { title: "CapCut", desc: "빠른 제작 대응 및 템플릿 활용" },
      { title: "Premiere Pro", desc: "디테일한 컷 편집 및 실무 역량" },
      { title: "After Effects", desc: "시각적 완성도 및 모션 그래픽" },
      { title: "Gen AI Video", desc: "Sora, Runway 등을 활용한 소스 생성" }
    ]
  },
  // 12. Operational Strategy (Modified for Urgency)
  {
    id: 12,
    type: SlideType.BIG_NUMBER,
    title: "소수정예 선착순 모집",
    highlight: "오직 14명",
    subtitle: "망설이는 순간 마감됩니다. 압도적 성장을 위한 기회는 제한되어 있습니다.",
    body: [
      "1:1 밀착 포트폴리오 지도",
      "실시간 피드백 시스템",
      "조기 마감 주의"
    ]
  },
  // 13. Expected Outcomes
  {
    id: 13,
    type: SlideType.BULLET_LIST,
    title: "수료 시 기대 역량 (Outcomes)",
    subtitle: "자격과 실무를 동시에",
    body: [
      "✔ AI-POT 2급 자격 취득",
      "✔ AI 활용 비즈니스 문서 작성 능력",
      "✔ SNS 및 마케팅 콘텐츠 제작 능력",
      "✔ 영상 편집 및 AI 툴 활용 실무 역량",
      "✔ 나만의 포트폴리오 보유"
    ]
  },
  // 14. Institutional Benefits
  {
    id: 14,
    type: SlideType.GRID_CARDS,
    title: "기관 관점 기대 효과",
    subtitle: "지역 디지털 인재 양성의 요람",
    items: [
      { title: "취업률 제고", desc: "실질적 스킬셋 보유로 취업 경쟁력 확보" },
      { title: "Reference", desc: "AI 특화 과정 운영 성공 사례 확보" },
      { title: "인재 양성", desc: "지역 내 부족한 디지털 전문 인력 공급" },
      { title: "확장 기반", desc: "향후 심화 과정 개설을 위한 데이터 축적" }
    ]
  },
  // 15. Scalability
  {
    id: 15,
    type: SlideType.PROCESS_FLOW,
    title: "확장 가능성",
    subtitle: "단일 프로그램이 아닌 확장형 기반 모델",
    items: [
      { title: "Standard", desc: "본 과정 (기초+실무)" },
      { title: "Option A", desc: "AI 콘텐츠 전문가" },
      { title: "Option B", desc: "AI 마케팅 전문가" },
      { title: "Option C", desc: "AI 영상 고급 과정" }
    ]
  },
  // 16. Closing
  {
    id: 16,
    type: SlideType.CLOSING,
    title: "Closing",
    subtitle: "우리는 AI 기능 교육에 머물지 않습니다.\n시장이 지향하는 ‘압도적 결과’를 설계합니다.",
    highlight: "11주 후, 수강생은\n단순한 교육 수료자가 아닌\n대체 불가능한 실무자가 됩니다."
  }
];