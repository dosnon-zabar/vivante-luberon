import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <AdminSidebar />
      <div className="flex-1 p-8 bg-ivoire">{children}</div>
    </div>
  );
}
