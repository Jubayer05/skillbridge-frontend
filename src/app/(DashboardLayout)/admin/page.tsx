import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminHome } from "@/components/modules/admin/AdminHome";

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminHome />
    </ProtectedRoute>
  );
}
