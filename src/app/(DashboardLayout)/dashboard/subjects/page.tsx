import SubjectsPage from "@/views/subjects/SubjectsPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const sp = await searchParams;
  return <SubjectsPage categoryId={sp.categoryId} />;
}

