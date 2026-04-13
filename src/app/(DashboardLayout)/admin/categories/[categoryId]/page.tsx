import { ProtectedRoute } from "@/components/auth/protected-route";
import CategoryDetailPage from "@/views/categories/CategoryDetailPage";

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <CategoryDetailPage />
    </ProtectedRoute>
  );
}
