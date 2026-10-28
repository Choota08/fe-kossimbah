import { useEffect, useState } from "react";

/* ================= TYPES ================= */
export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

export interface Profile {
  name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

/* ================= HOOK ================= */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ================= INIT ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedProfile = localStorage.getItem("profile");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }

    setIsLoading(false);
  }, []);

  /* ================= AUTH ================= */
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // default profile
    if (!localStorage.getItem("profile")) {
      const defaultProfile: Profile = {
        name: null,
        phone: null,
        avatar_url: null,
      };
      setProfile(defaultProfile);
      localStorage.setItem("profile", JSON.stringify(defaultProfile));
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
  };

  /* ================= PROFILE ================= */
  const updateProfile = async (data: Partial<Profile>) => {
    const newProfile = { ...profile, ...data } as Profile;
    setProfile(newProfile);
    localStorage.setItem("profile", JSON.stringify(newProfile));

    return { error: null };
  };

  const uploadAvatar = async (file: File) => {
    // mock upload → convert ke base64
    const reader = new FileReader();

    return new Promise<{ error: null | string }>((resolve) => {
      reader.onload = () => {
        const newProfile = {
          ...profile,
          avatar_url: reader.result as string,
        } as Profile;

        setProfile(newProfile);
        localStorage.setItem("profile", JSON.stringify(newProfile));
        resolve({ error: null });
      };

      reader.readAsDataURL(file);
    });
  };

  return {
    user,
    profile,
    isLoading,
    login,
    logout,
    updateProfile,
    uploadAvatar,
  };
}
