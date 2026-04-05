"use client";

import { Fragment, useMemo } from "react";

/** `**제목:**` 본문, `•` 목록, 줄바꿈, 인라인 `**강조**` 정도만 처리 (의존성 없음) */
function renderInlineBold(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={`${keyPrefix}-${i}`}
          className="font-semibold text-slate-900"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

function parseContent(content: string): React.ReactNode[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    const sectionSameLine = line.match(/^(\*\*.+?:\*\*)\s*(.*)$/);
    if (sectionSameLine) {
      const rawTitle = sectionSameLine[1];
      const title =
        rawTitle.startsWith("**") && rawTitle.endsWith("**")
          ? rawTitle.slice(2, -2)
          : rawTitle;
      const rest = sectionSameLine[2]?.trim() ?? "";

      out.push(
        <h3
          key={`h-${k++}`}
          className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 mt-5 first:mt-0"
        >
          {title}
        </h3>
      );

      if (rest) {
        out.push(
          <p key={`p-${k++}`} className="text-slate-700 leading-relaxed mt-2">
            {renderInlineBold(rest, `r-${k}`)}
          </p>
        );
      } else {
        i += 1;
        const body: string[] = [];
        while (
          i < lines.length &&
          lines[i].trim() &&
          !/^\*\*.+?:\*\*/.test(lines[i]) &&
          !lines[i].trimStart().startsWith("•")
        ) {
          body.push(lines[i]);
          i += 1;
        }
        if (body.length > 0) {
          out.push(
            <p
              key={`p-${k++}`}
              className="text-slate-700 leading-relaxed mt-2 whitespace-pre-wrap"
            >
              {body.map((bl, bi) => (
                <Fragment key={bi}>
                  {bi > 0 ? <br /> : null}
                  {renderInlineBold(bl, `b-${k}-${bi}`)}
                </Fragment>
              ))}
            </p>
          );
        }
        continue;
      }
      i += 1;
      continue;
    }

    if (line.trimStart().startsWith("• ")) {
      const items: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        lines[i].trimStart().startsWith("• ")
      ) {
        items.push(lines[i].trimStart().slice(2).trim());
        i += 1;
      }
      out.push(
        <ul
          key={`ul-${k++}`}
          className="list-disc pl-5 space-y-1.5 text-slate-700 my-2"
        >
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineBold(item, `li-${k}-${idx}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    const para: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\*\*.+?:\*\*/.test(lines[i]) &&
      !lines[i].trimStart().startsWith("•")
    ) {
      para.push(lines[i]);
      i += 1;
    }
    out.push(
      <p
        key={`p-${k++}`}
        className="text-slate-700 leading-relaxed my-2 whitespace-pre-wrap"
      >
        {para.map((pl, pi) => (
          <Fragment key={pi}>
            {pi > 0 ? <br /> : null}
            {renderInlineBold(pl, `pb-${k}-${pi}`)}
          </Fragment>
        ))}
      </p>
    );
  }

  return out;
}

type ForumPostBodyProps = {
  content: string;
  /** 마크다운 패턴이 거의 없으면 단순 pre-wrap */
  preferPlain?: boolean;
};

export default function ForumPostBody({
  content,
  preferPlain = false,
}: ForumPostBodyProps) {
  const looksLikeScoreTemplate =
    content.includes("**") && content.includes(":**");

  const nodes = useMemo(() => {
    if (preferPlain || !looksLikeScoreTemplate) {
      return null;
    }
    return parseContent(content);
  }, [content, preferPlain, looksLikeScoreTemplate]);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    );
  }

  return <div className="forum-post-body text-[15px]">{nodes}</div>;
}
