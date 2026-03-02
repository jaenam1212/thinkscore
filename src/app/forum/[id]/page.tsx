import { Suspense } from "react";
import ForumPostClient from "./ForumPostClient";

export async function generateStaticParams() {
  return [];
}

export default function ForumPostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForumPostClient />
    </Suspense>
  );
}
