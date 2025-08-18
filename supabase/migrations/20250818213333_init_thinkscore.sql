-- === tables ===
create table if not exists public.profiles (
  id uuid primary key default auth.uid(),
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id bigserial primary key,
  prompt text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.answers (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id bigint not null references public.questions(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.scores (
  id bigserial primary key,
  answer_id bigint not null references public.answers(id) on delete cascade,
  score int not null check (score between 0 and 100),
  reason text,
  created_at timestamptz not null default now()
);

-- === RLS ===
alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.scores enable row level security;

-- profiles: 본인만 조회/수정, 본인 행만 생성
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);
create policy "profiles_insert_self" on public.profiles
for insert with check (auth.uid() = id);
create policy "profiles_update_self" on public.profiles
for update using (auth.uid() = id);

-- questions: 모두 조회 가능(읽기 전용)
create policy "questions_read_all" on public.questions
for select using (true);

-- answers: 본인 것만 조회, 본인 uid로만 작성
create policy "answers_select_own" on public.answers
for select using (auth.uid() = user_id);
create policy "answers_insert_self" on public.answers
for insert with check (auth.uid() = user_id);

-- scores: 본인 답변의 점수만 조회
create policy "scores_select_own" on public.scores
for select using (
  exists (
    select 1 from public.answers a
    where a.id = scores.answer_id and a.user_id = auth.uid()
  )
);

-- 인덱스
create index if not exists idx_answers_user on public.answers(user_id);
create index if not exists idx_answers_question on public.answers(question_id);
create index if not exists idx_scores_answer on public.scores(answer_id);