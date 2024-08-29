// app/dashboard/page.tsx
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const role = decoded.role;

    if (role === "admin") {
      return (
        <div>
          <h1>Admin Dashboard</h1>
          {/* Admin-specific content */}
        </div>
      );
    } else if (role === "teamMember") {
      return (
        <div>
          <h1>Team Member Dashboard</h1>
          {/* Team Member-specific content */}
        </div>
      );
    } else {
      redirect("/login");
    }
  } catch (error) {
    redirect("/login");
  }
}
