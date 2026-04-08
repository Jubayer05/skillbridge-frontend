import { ProtectedRoute } from "@/components/auth/protected-route";
import CreateCategoryPage from "@/views/categories/CreateCategoryPage";

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN", "TUTOR"]}>
      <CreateCategoryPage />
    </ProtectedRoute>
  );
}

