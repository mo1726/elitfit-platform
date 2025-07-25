import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import api from "../../services/axiosConfig";
import { Player } from "@lottiefiles/react-lottie-player";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      const token = res.data.token;
      localStorage.setItem("token", token);
      toast.success("✅ Login successful!");

      const decoded = jwtDecode(token);
      const roles = decoded.roles || [];

      if (roles.includes("ROLE_ADMIN")) navigate("/admin-dashboard");
      else if (roles.includes("ROLE_TRAINER")) navigate("/trainer-dashboard");
      else if (roles.includes("ROLE_MEMBER")) {
        const member = (await api.get("/member/me")).data;
        const hasPlan = member.planId || member.membershipPlanName;

        if (hasPlan && member.active) navigate("/member-dashboard");
        else navigate("/member-not-purchased");
      } else navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("❌ Login failed. Please check credentials.");
    }
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const inputClass =
    "w-full px-4 py-3 bg-zinc-800 text-white rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400";

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Particles background */}
      <Particles
        className="absolute top-0 left-0 w-full h-full"
        init={particlesInit}
        options={{
          background: { color: { value: "#000000" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#00ff99" },
            links: {
              color: "#00ff99",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: { enable: true, speed: 1 },
            number: { value: 70 },
            opacity: { value: 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
      />

      {/* Form Card */}
      <div className="relative z-10 flex items-center justify-center h-full p-4">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-8 w-full max-w-md text-white animate-fade-in">
          <div className="flex justify-center mb-4">
            <Player
              autoplay
              loop
              background="transparent"
              src="https://lottie.host/5e44429f-c3a5-4d90-bc93-3978a22d67c1/gqe3uVxEmg.json"
              style={{ height: "140px", width: "140px" }}
            />
          </div>

          <h2 className="text-center text-3xl font-bold text-green-400 mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:scale-105"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-300">
            Don’t have an account?{" "}
            <a href="/register" className="text-green-400 hover:underline">
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
