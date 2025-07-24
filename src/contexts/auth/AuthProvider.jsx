import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import auth from "../../../firebase.config";
import useAxios from "../../hooks/useAxios";
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();

  //   register user
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).finally(() =>
      setLoading(false)
    );
  };

  //   profile update
  const profileUpdate = async (displayName, photoURL) => {
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });
      await refreshUser();
    } catch (error) {
      console.error("Profile update failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // signin with google
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    } finally {
      setLoading(false);
      refreshUser();
    }
  };

  // signin user
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).finally(() =>
      setLoading(false)
    );
  };

  // logout user
  const logOut = async () => {
    try {
      setLoading(true);
      return await signOut(auth);
    } finally {
      axiosInstance.get("/api/clear-cookie").catch((err) => console.log(err));
      setLoading(false);
    }
  };

  // refresh user
  const refreshUser = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const res = await axiosInstance.get("/api/user");
      setUser({
        ...currentUser,
        role: res.data.role || null,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // authorization token request
          if (currentUser?.email) {
            const jwt = await axiosInstance.post("/api/generate-jwt", {
              email: currentUser.email,
            });
            if (!jwt) {
              logOut();
              return;
            }
          }

          // Fetch user role from backend
          const { data } = await axiosInstance.get("/api/user");

          if (data.exists) {
            setUser({
              ...currentUser,
              role: data.role || null,
            });
          }
        } catch (err) {
          console.error("Failed to fetch user role:", err.message);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const userInfo = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    registerUser,
    profileUpdate,
    logOut,
    setUser,
    refreshUser,
  };
  return <AuthContext value={userInfo}>{children}</AuthContext>;
};

export default AuthProvider;
