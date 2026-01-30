"use client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { LOGIN_USER } from "../graphql/mutation";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter()
  const [login,{error}] = useMutation(LOGIN_USER,{
    onCompleted:(data)=>{
      localStorage.setItem("token",data.login.token)
      localStorage.setItem("role",data.login.user.role)
      router.push("/dashboard")
    }
  })
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
     login({
      variables:{
        email:formData.email,
        password:formData.password
      }
     })
  };

  
  if(error) return <p>{error.message}</p>

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Login to TaskFlow
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, please enter your details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 transition"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <span className="text-sm text-blue-600 cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg
                       font-medium hover:bg-blue-700 transition
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:ring-offset-2"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span className="text-blue-600 font-medium cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
