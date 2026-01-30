"use client";
import { useState } from "react";
import { SIGN_UP_USER } from "../graphql/mutation";
import { useMutation } from "@apollo/client/react";

export default function Signup() {
  const [signup, { error }] = useMutation(SIGN_UP_USER, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.signup.token);
      localStorage.setItem("role",data.signup.user.role)
    },
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({
      variables: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
    });
  };

  if (error) return <p>{error.message}</p>;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-semibold text-gray-900">
              Create account
            </h1>
            <p className="text-sm text-gray-500">
              Start managing your projects with TaskFlow
            </p>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white
                       hover:bg-blue-700 transition focus:outline-none focus:ring-2
                       focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span className="cursor-pointer font-medium text-blue-600 hover:underline">
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
