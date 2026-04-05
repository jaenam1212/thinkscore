import type { ForumPost } from "@/lib/forum-api";

/** 상단 칩에 표시할 주제 (구 카테고리 slug + score_share + 연결된 문제 제목) */
export function getForumTopicBadgeLabel(post: Pick<ForumPost, "category" | "question">): string {
  const q = post.question?.title?.trim();

  if (post.category === "score_share") {
    return q ? `점수 공유 · ${q}` : "답변·점수 공유";
  }
  if (post.category === "free") return "자유";
  if (post.category === "trolley") return "트롤리 딜레마";
  if (post.category === "brain_vat") return "통 속의 뇌";
  if (post.category === "prisoner") return "죄수의 딜레마";
  if (post.category === "theseus") return "테세우스의 배";

  return q || "토론";
}
