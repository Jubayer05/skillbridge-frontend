import { ProtectedRoute } from "@/components/auth/protected-route";
import CategoryList from "@/components/category/CategoryList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
            <p className="text-muted-foreground text-sm">
              Manage catalog categories (admin only for delete).
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/categories/new">New category</Link>
          </Button>
        </div>
        <CategoryList />
      </div>
    </ProtectedRoute>
  );
}
