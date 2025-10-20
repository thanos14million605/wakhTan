import React, { lazy, Suspense, useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "react-hot-toast";

import useAuthStore from "./store/useAuthStore";
import { ContactsProvider } from "./contexts/ContactContext";

// import useSocket from "./hooks/useSocket";

// Lazy loading to be implemented later here, tomorrow.
const Homepage = lazy(() => import("./pages/Homepage"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProtectRoute = lazy(() => import("./pages/ProtectRoute"));

import SpinnerFullPage from "./ui/SpinnerFullPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <SpinnerFullPage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Suspense fallback={<SpinnerFullPage />} />
      <ContactsProvider>
        <BrowserRouter>
          <Routes>
            <Route index path="/login" element={<Login />} />
            <Route
              path={`/chats/${authUser?.userName}`}
              element={
                <ProtectRoute>
                  <Homepage />
                </ProtectRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/profile/:userName/:userId"
              element={
                <ProtectRoute>
                  <ProfilePage />
                </ProtectRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
      </ContactsProvider>
    </QueryClientProvider>
  );
};

export default App;
