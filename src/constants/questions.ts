export interface PhilosophyQuestion {
  id: string;
  title: string;
  content: string;
  category: string;
  evaluationCriteria: string[];
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

export const PHILOSOPHY_QUESTIONS: Record<string, PhilosophyQuestion> = {
  trolley: {
    id: "trolley",
    title: "트롤리 딜레마",
    content: `당신은 철도 분기점 근처에 서 있습니다. 폭주하는 트롤리가 직진하면 선로에 묶여 있는 5명의 사람을 치어 죽일 것입니다.

당신 앞에는 레버가 있어서, 이를 당기면 트롤리를 옆 선로로 돌릴 수 있습니다. 하지만 옆 선로에는 1명이 묶여 있어 그 사람이 죽게 됩니다.

당신은 레버를 당겨 5명을 구하고 1명을 희생시키겠습니까, 아니면 아무것도 하지 않겠습니까?`,
    category: "도덕철학",
    evaluationCriteria: [
      "utilitarian_thinking",
      "deontological_ethics",
      "moral_reasoning",
    ],
    difficulty: "medium",
    tags: ["윤리학", "공리주의", "의무론적윤리"],
  },

  prisoner: {
    id: "prisoner",
    title: "죄수의 딜레마",
    content: `당신과 동료가 함께 범죄를 저질렀다는 혐의로 체포되어 각각 다른 방에서 심문을 받고 있습니다. 검사는 다음과 같은 제안을 합니다:

• 둘 다 침묵하면: 각각 1년 징역
• 한 명만 배신하면: 배신자는 석방, 침묵한 자는 10년 징역  
• 둘 다 배신하면: 각각 5년 징역

동료가 무엇을 선택할지 알 수 없는 상황에서, 당신은 어떤 선택을 하시겠습니까? 그 이유는 무엇입니까?`,
    category: "게임이론",
    evaluationCriteria: [
      "strategic_thinking",
      "cooperation_vs_defection",
      "rational_choice",
    ],
    difficulty: "medium",
    tags: ["게임이론", "협력", "신뢰", "합리적선택"],
  },

  brain_in_vat: {
    id: "brain_in_vat",
    title: "통 속의 뇌",
    content: `당신이 실제로는 통 속에 있는 뇌이고, 컴퓨터가 전기 신호를 보내서 현재 경험하고 있는 모든 것이 가상현실일 가능성이 있다고 가정해봅시다.

이런 상황에서 당신은 "나는 통 속의 뇌가 아니다"라고 확신할 수 있습니까? 현실과 가상현실을 구별할 수 있는 방법이 있다고 생각하십니까?

지식과 현실에 대한 당신의 견해를 설명해주세요.`,
    category: "인식론",
    evaluationCriteria: [
      "skeptical_reasoning",
      "reality_vs_illusion",
      "knowledge_theory",
    ],
    difficulty: "hard",
    tags: ["인식론", "회의주의", "현실", "지식"],
  },

  ship_of_theseus: {
    id: "ship_of_theseus",
    title: "테세우스의 배",
    content: `테세우스의 배가 오랜 항해를 하면서 부품이 하나씩 낡아갑니다. 선원들은 낡은 부품을 새 부품으로 하나씩 교체합니다.

마침내 원래 배의 모든 부품이 교체되었습니다. 이 배는 여전히 '테세우스의 배'라고 할 수 있을까요?

만약 교체된 낡은 부품들로 똑같은 배를 다시 조립한다면, 어느 것이 진짜 '테세우스의 배'일까요?

정체성과 연속성에 대한 당신의 생각을 설명해주세요.`,
    category: "형이상학",
    evaluationCriteria: [
      "identity_theory",
      "continuity_vs_change",
      "metaphysical_reasoning",
    ],
    difficulty: "hard",
    tags: ["정체성", "형이상학", "연속성", "변화"],
  },

  cave_allegory: {
    id: "cave_allegory",
    title: "동굴의 비유",
    content: `플라톤의 동굴 비유에서, 사람들이 동굴 안에서 벽에 비치는 그림자만 보며 그것이 현실이라고 믿고 살아갑니다. 한 사람이 동굴을 나와 진짜 세상을 보고 돌아와서 다른 사람들에게 진실을 말하지만, 그들은 믿지 않습니다.

현대 사회에서 우리도 어떤 '그림자'만 보고 있을 가능성이 있을까요? 진정한 지식과 깨달음에 도달하려면 무엇이 필요하다고 생각하십니까?

교육과 진리 탐구에 대한 당신의 견해를 설명해주세요.`,
    category: "인식론",
    evaluationCriteria: [
      "truth_vs_illusion",
      "education_philosophy",
      "enlightenment_theory",
    ],
    difficulty: "medium",
    tags: ["플라톤", "진리", "교육", "깨달음", "현실"],
  },

  free_will: {
    id: "free_will",
    title: "자유의지 vs 결정론",
    content: `모든 사건이 이전 사건들에 의해 결정된다면(결정론), 우리의 선택과 행동도 이미 결정되어 있는 것일까요?

만약 우리의 모든 행동이 뇌의 물리적 과정의 결과라면, 진정한 '자유의지'라는 것이 존재할 수 있을까요?

자유의지가 없다면 도덕적 책임도 없다고 봐야 할까요?

자유의지와 도덕적 책임에 대한 당신의 견해를 설명해주세요.`,
    category: "형이상학",
    evaluationCriteria: [
      "free_will_vs_determinism",
      "moral_responsibility",
      "causation_theory",
    ],
    difficulty: "hard",
    tags: ["자유의지", "결정론", "도덕", "책임", "인과관계"],
  },
};

// 오늘의 문제를 가져오는 함수 (날짜 기반)
export function getTodaysQuestion(): PhilosophyQuestion {
  const questions = Object.values(PHILOSOPHY_QUESTIONS);
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const questionIndex = dayOfYear % questions.length;
  return questions[questionIndex];
}

// 특정 문제를 ID로 가져오는 함수
export function getQuestionById(id: string): PhilosophyQuestion | null {
  return PHILOSOPHY_QUESTIONS[id] || null;
}

// 카테고리별 문제 가져오기
export function getQuestionsByCategory(category: string): PhilosophyQuestion[] {
  return Object.values(PHILOSOPHY_QUESTIONS).filter(
    (q) => q.category === category
  );
}

// 랜덤 문제 가져오기
export function getRandomQuestion(): PhilosophyQuestion {
  const questions = Object.values(PHILOSOPHY_QUESTIONS);
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}
