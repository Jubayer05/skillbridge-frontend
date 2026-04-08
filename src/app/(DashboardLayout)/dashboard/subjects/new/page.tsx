import { ProtectedRoute } from "@/components/auth/protected-route";
import CreateSubjectPage from "@/views/subjects/CreateSubjectPage";

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN", "TUTOR"]}>
      <CreateSubjectPage />
    </ProtectedRoute>
  );
}

