"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAdminUsers, patchAdminUser } from "@/services/admin";
import type { AdminUser, Paginated } from "@/types/admin";
import type { Role } from "@/types/auth";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function roleBadgeVariant(role: Role): "default" | "secondary" | "outline" {
  if (role === "ADMIN") return "default";
  if (role === "TUTOR") return "secondary";
  return "outline";
}

export function AdminUsersPage() {
  const [data, setData] = useState<Paginated<AdminUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState("");
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState<Role>("STUDENT");
  const [editBanned, setEditBanned] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminUsers({
        page,
        limit: 15,
        role: roleFilter || undefined,
        q: q || undefined,
      });
      setData(res);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, q]);

  useEffect(() => {
    void load();
  }, [load]);

  const openEdit = (u: AdminUser) => {
    setEditUser(u);
    setEditRole(u.role);
    setEditBanned(!!u.banned);
    setBanReason(u.banReason ?? "");
    setEditActive(u.isActive);
  };

  const saveEdit = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const body: Parameters<typeof patchAdminUser>[1] = {};
      if (editRole !== editUser.role) body.role = editRole;
      if (editActive !== editUser.isActive) body.isActive = editActive;
      if (editBanned !== !!editUser.banned) {
        body.banned = editBanned;
        if (editBanned && banReason.trim()) body.banReason = banReason.trim();
      }
      if (Object.keys(body).length === 0) {
        setEditUser(null);
        return;
      }
      await patchAdminUser(editUser.id, body);
      toast.success("User updated");
      setEditUser(null);
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const quickBanToggle = async (u: AdminUser) => {
    try {
      if (u.banned) {
        await patchAdminUser(u.id, { banned: false });
        toast.success("User unbanned");
      } else {
        await patchAdminUser(u.id, { banned: true });
        toast.success("User banned");
      }
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground text-sm">
          Search, filter by role, ban or unban, and change roles.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-[200px] flex-1 space-y-2">
          <Label htmlFor="user-search">Search</Label>
          <div className="flex gap-2">
            <Input
              id="user-search"
              placeholder="Name or email"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  setQ(qInput.trim());
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPage(1);
                setQ(qInput.trim());
              }}
            >
              Search
            </Button>
          </div>
        </div>
        <div className="w-full space-y-2 sm:w-44">
          <Label>Role</Label>
          <Select
            value={roleFilter || "all"}
            onValueChange={(v) => {
              setPage(1);
              setRoleFilter(v === "all" ? "" : (v as Role));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="TUTOR">Tutor</SelectItem>
              <SelectItem value="STUDENT">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border/60">
        {loading && !data ? (
          <div className="p-6 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.items ?? []).map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleBadgeVariant(u.role)}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {!u.isActive ? (
                        <Badge variant="outline">Inactive</Badge>
                      ) : null}
                      {u.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge variant="secondary" className="font-normal">
                          Active
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void quickBanToggle(u)}
                      >
                        {u.banned ? "Unban" : "Ban"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-muted-foreground">
            Page {data.page} of {data.totalPages} · {data.total} users
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          {editUser ? (
            <div className="space-y-4 py-2">
              <p className="text-muted-foreground text-sm">
                {editUser.name} · {editUser.email}
              </p>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={editRole}
                  onValueChange={(v) => setEditRole(v as Role)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TUTOR">Tutor</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="active-switch">Account active</Label>
                <Button
                  id="active-switch"
                  type="button"
                  variant={editActive ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setEditActive((a) => !a)}
                >
                  {editActive ? "Active" : "Inactive"}
                </Button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="ban-switch">Banned</Label>
                <Button
                  id="ban-switch"
                  type="button"
                  variant={editBanned ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setEditBanned((b) => !b)}
                >
                  {editBanned ? "Yes" : "No"}
                </Button>
              </div>
              {editBanned ? (
                <div className="space-y-2">
                  <Label htmlFor="ban-reason">Ban reason (optional)</Label>
                  <Input
                    id="ban-reason"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Reason shown to admins"
                  />
                </div>
              ) : null}
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditUser(null)}
            >
              Cancel
            </Button>
            <Button type="button" disabled={saving} onClick={() => void saveEdit()}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
