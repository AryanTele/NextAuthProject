// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    // Verify JWT using `jose`
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET as string)
    );

    const role = payload.role as string;

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
    console.error("JWT verification failed:", error);
    redirect("/login");
  }
}
