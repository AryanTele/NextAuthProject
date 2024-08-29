import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { jwtVerify } from "jose";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin-specific content */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  const token = cookies.token;

  console.log("Token from cookies:", token);
  console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

  if (!token) {
    console.log("No token found, redirecting to login");
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET as string)
    );
    console.log("Decoded JWT:", payload);

    if (payload.role !== "admin") {
      console.log("User is not admin, redirecting to dashboard");
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  } catch (error: any) {
    console.error("JWT verification failed:", error.message);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
