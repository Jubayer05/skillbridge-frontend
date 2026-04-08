import { TutorPublicSlots } from "@/components/modules/tutor/TutorPublicSlots";

function paramId(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return "";
}

export default async function TutorSlotsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId: raw } = await params;
  const userId = paramId(raw);

  if (!userId) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">Invalid tutor.</p>
      </div>
    );
  }

  return <TutorPublicSlots tutorUserId={userId} />;
}
