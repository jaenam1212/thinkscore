"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { login, register } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError("");
      await login(email, password);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      setIsLoading(true);
      setError("");
      await register(email, password, displayName);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 z-10"
          disabled={isLoading}
        >
          ✕
        </button>

        {mode === "login" ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => {
              setMode("register");
              setError("");
            }}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => {
              setMode("login");
              setError("");
            }}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
