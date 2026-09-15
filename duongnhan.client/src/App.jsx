import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import { router } from "./router";

const rawGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const isValidGoogleClientId =
  rawGoogleClientId &&
  typeof rawGoogleClientId === "string" &&
  !rawGoogleClientId.startsWith("000000000000") &&
  rawGoogleClientId.includes(".apps.googleusercontent.com");

export default function App() {
  const content = (
    <>
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: "Inter, sans-serif", fontSize: "14px" } }} />
      <RouterProvider router={router} />
    </>
  );

  return (
    <Provider store={store}>
      {isValidGoogleClientId ? (
        <GoogleOAuthProvider clientId={rawGoogleClientId}>
          {content}
        </GoogleOAuthProvider>
      ) : (
        content
      )}
    </Provider>
  );
}
