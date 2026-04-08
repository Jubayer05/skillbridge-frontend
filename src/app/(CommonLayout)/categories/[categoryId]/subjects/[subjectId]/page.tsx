import { CategorySubjectSlots } from "@/components/category/CategorySubjectSlots";

function paramId(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return "";
}

export default async function CategorySubjectSlotsPage({
  params,
}: {
  params: Promise<{ categoryId: string; subjectId: string }>;
}) {
  const { categoryId: rawCategoryId, subjectId: rawSubjectId } = await params;
  const categoryId = paramId(rawCategoryId);
  const subjectId = paramId(rawSubjectId);

  if (!categoryId || !subjectId) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">Invalid subject.</p>
      </div>
    );
  }

  return <CategorySubjectSlots categoryId={categoryId} subjectId={subjectId} />;
}

