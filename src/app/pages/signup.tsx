"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import illustration from "@/app/images/illustration.png";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSignUp = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/user/signup", user);
      console.log("Signup Success", response.data);
      router.push("/login");
    } catch (error: any) {
      console.log("Signup failed");
      toast.error(error.message);
    }
  };

  // enables signup button
  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="bg-green-100 flex items-center justify-center min-h-screen">
      <div className="m-3 md:flex-row overflow-hidden w-full max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden w-full max-w-4xl">
          <div className="hidden md:flex bg-[#f4fef0] w-full md:w-1/2 items-center justify-center p-8">
            {/* <<img
              src="/src/app/images/illustration.png"
              alt="Illustration"
              className="w-3/4"
            />> */}
            <Image
              src={illustration}
              width={320}
              height={320}
              alt={"ui image"}
            />
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col">
            <h2 className="text-green-700  text-3xl font-extrabold mb-4 text-center font-sans">
              Welcome
            </h2>
            <form className="flex flex-col space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="text-green-700 block text-base font-medium"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="email"
                  placeholder="Enter your username"
                  className="text-gray-800 w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-green-700 block text-base font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="text-gray-800 w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-green-700 block text-base font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="text-gray-800 w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded mt-4"
              >
                create account
              </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>or</p>
              <div className="flex justify-center space-x-4 mt-2">
                <a href="#" className="text-gray-500 hover:text-green-600">
                  <i className="fab fa-google"></i>
                </a>
                <a href="#" className="text-gray-500 hover:text-green-600">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-gray-500 hover:text-green-600">
                  <i className="fab fa-apple"></i>
                </a>
              </div>
              <p className="mt-4">
                Already have an account ?{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
