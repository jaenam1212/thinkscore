import Script from "next/script";

interface QuizData {
  title?: string;
  description?: string;
}

interface ForumData {
  title?: string;
  content?: string;
  created_at?: string;
  author?: {
    username?: string;
  };
}

interface StructuredDataProps {
  type: "website" | "quiz" | "forum";
  data?: QuizData | ForumData;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type":
        type === "website"
          ? "WebSite"
          : type === "quiz"
            ? "Quiz"
            : "DiscussionForumPosting",
    };

    switch (type) {
      case "website":
        return {
          ...baseData,
          "@type": "WebSite",
          name: "ThinkScore",
          description: "AI로 평가하는 창의적 사고력 테스트",
          url: "https://thinkscore.kr",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://thinkscore.kr/forum?search={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
          publisher: {
            "@type": "Organization",
            name: "ThinkScore",
            url: "https://thinkscore.kr",
          },
        };

      case "quiz":
        const quizData = data as QuizData;
        return {
          ...baseData,
          "@type": "Quiz",
          name: quizData?.title || "ThinkScore 사고력 테스트",
          description: quizData?.description || "AI 기반 창의적 사고력 평가",
          educationalLevel: "모든 연령대",
          educationalUse: "평가",
          typicalAgeRange: "13-99",
          interactivityType: "active",
          learningResourceType: "assessment",
          publisher: {
            "@type": "Organization",
            name: "ThinkScore",
          },
        };

      case "forum":
        const forumData = data as ForumData;
        return {
          ...baseData,
          "@type": "DiscussionForumPosting",
          headline: forumData?.title,
          text: forumData?.content,
          datePublished: forumData?.created_at,
          author: {
            "@type": "Person",
            name: forumData?.author?.username || "익명",
          },
          publisher: {
            "@type": "Organization",
            name: "ThinkScore",
          },
        };

      default:
        return baseData;
    }
  };

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}
