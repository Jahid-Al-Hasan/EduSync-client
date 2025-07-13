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
      return await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: photoURL,
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // signin with google
  const signInWithGoogle = async () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider).finally(() =>
      setLoading(false)
    );
  };

  // signin user
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).finally(() =>
      setLoading(false)
    );
  };

  // logout user
  const logOut = () => {
    setLoading(true);
    return signOut(auth).finally(() => setLoading(false));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();

          // ✅ Fetch user role from backend
          const res = await axiosInstance.get("/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser({
            ...currentUser,
            role: res.data.role || null,
          });
        } catch (err) {
          console.error("Failed to fetch user role:", err.message);
          setUser(null); // Clear role on error
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosInstance]);

  const userInfo = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    registerUser,
    profileUpdate,
    logOut,
  };
  return <AuthContext value={userInfo}>{children}</AuthContext>;
};

export default AuthProvider;
