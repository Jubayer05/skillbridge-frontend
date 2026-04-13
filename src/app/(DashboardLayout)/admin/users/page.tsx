import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminUsersPage } from "@/components/modules/admin/AdminUsersPage";

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminUsersPage />
    </ProtectedRoute>
  );
}
