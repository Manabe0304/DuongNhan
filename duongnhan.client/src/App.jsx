import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import { router } from "./router";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Toaster position="top-center" toastOptions={{ style: { fontFamily: "Inter, sans-serif", fontSize: "14px" } }} />
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </Provider>
  );
}
