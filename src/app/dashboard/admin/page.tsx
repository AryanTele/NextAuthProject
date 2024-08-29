"use server";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin-specific content */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = parseCookies(context);

  const token = cookies.token;

  // Debug: Log the token
  console.log("Token from cookies:", token);

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
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("Decoded JWT:", decoded);

    if (decoded.role !== "admin") {
      console.log("User is not admin, redirecting to dashboard");
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {}, // Pass any props required by the page
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
