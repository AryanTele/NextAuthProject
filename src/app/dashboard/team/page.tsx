// Import required modules
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export default function TeamMemberDashboard() {
  return (
    <div>
      <h1>Team Member Dashboard</h1>
      {/* Team Member-specific content */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = parseCookies(context);

  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decoded.role !== "teamMember") {
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
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
