import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
