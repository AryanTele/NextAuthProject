// app/dashboard/team/page.tsx
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { jwtVerify } from "jose";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

export default function TeamMemberDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Loading state to handle UI while fetching data
  const [error, setError] = useState<string | null>(null); // Error state to handle errors

  useEffect(() => {
    // Fetch the list of products from your API
    axios
      .get("/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false); // Set loading to false after fetching data
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setLoading(false); // Set loading to false even if there's an error
      });
  }, []);

  return (
    <div>
      <h1>Team Member Dashboard</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <Link href={`/dashboard/team/product/${product._id}`}>
                {/* Wrapping Link with an anchor tag */}
                <a>{product.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      )}
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

    if (payload.role !== "teamMember") {
      console.log("User is not a team member, redirecting to dashboard");
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
