import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/chat"
          element={
            <SocketProvider>
              <ChatPage />
            </SocketProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
