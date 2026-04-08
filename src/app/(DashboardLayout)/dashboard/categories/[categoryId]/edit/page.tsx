import { ProtectedRoute } from "@/components/auth/protected-route";
import EditCategoryPage from "@/views/categories/EditCategoryPage";

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN", "TUTOR"]}>
      <EditCategoryPage />
    </ProtectedRoute>
  );
}

