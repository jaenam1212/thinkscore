import ForumPostClient from "./ForumPostClient";

export async function generateStaticParams() {
  return [{ id: "0" }];
}

export default function ForumPostPage() {
  return <ForumPostClient />;
}
