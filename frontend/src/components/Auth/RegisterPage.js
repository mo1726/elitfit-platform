import React, { useState } from "react";
import { register } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Player } from "@lottiefiles/react-lottie-player";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success("✅ Account created! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error("❌ Registration failed. Try again.");
    }
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Particles Background */}
      <Particles
        className="absolute top-0 left-0 w-full h-full"
        init={particlesInit}
        options={{
          background: { color: { value: "#000000" } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } },
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
            number: { value: 60 },
            opacity: { value: 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
      />

      {/* Registration Form */}
      <div className="relative z-10 flex items-center justify-center h-full p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl text-white"
        >
          {/* Lottie Animation */}
          <div className="flex justify-center mb-4">
            <div className="rounded-full p-2">
              <Player
                autoplay
                loop
                background="transparent"
                src="https://lottie.host/5e44429f-c3a5-4d90-bc93-3978a22d67c1/gqe3uVxEmg.json"
                style={{ height: "140px", width: "140px" }}
              />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-green-400 text-center mb-6">
            Create Account
          </h2>

          {/* Inputs */}
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-zinc-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-zinc-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-3 rounded-xl bg-zinc-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-xl transition-all duration-300 shadow-lg"
          >
            Register
          </button>

          {/* Login Redirect */}
          <p className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
