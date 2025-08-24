interface ForumActionButtonsProps {
  selectedBoard: number | null;
  onStartNewDiscussion: () => void;
  onShareScore: () => void;
}

export default function ForumActionButtons({
  selectedBoard,
  onStartNewDiscussion,
  onShareScore,
}: ForumActionButtonsProps) {
  return (
    <div className="p-4">
      {selectedBoard === null ? (
        <button
          onClick={onStartNewDiscussion}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-medium text-sm transition-colors"
        >
          새 토론 시작하기
        </button>
      ) : (
        <button
          onClick={onShareScore}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-medium text-sm transition-colors"
        >
          내 점수 공유하기
        </button>
      )}
    </div>
  );
}
