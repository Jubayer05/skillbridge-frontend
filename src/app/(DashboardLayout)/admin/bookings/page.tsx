import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminBookingsPage } from "@/components/modules/admin/AdminBookingsPage";

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminBookingsPage />
    </ProtectedRoute>
  );
}
