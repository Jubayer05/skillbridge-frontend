import { ProtectedRoute } from "@/components/auth/protected-route";
import EditSubjectPage from "@/views/subjects/EditSubjectPage";

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN", "TUTOR"]}>
      <EditSubjectPage />
    </ProtectedRoute>
  );
}

