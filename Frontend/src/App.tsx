import { Routes, Route, Navigate } from "react-router-dom";
import { createContext } from "react";

import Home from "./pages/home/home";
import Deck from "./pages/decks/deck";
import Create_Deck from "./pages/decks/deck-create";
import Not_found from "./pages/not-found/not-found";
import LoginForm from "./pages/auth/login";
import SignUpForm from "./pages/auth/signup";
import useToken from "./pages/auth/token";

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = true; // TODO Replace with actual authentication logic

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export const TokenContext = createContext<string | null>(null);

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <TokenContext.Provider value={token}>
      <Routes>
        <Route path="/" element={<Home removeToken={removeToken} />} />
        <Route path="/deck" element={<Deck />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route path="/signup" element={<SignUpForm setToken={setToken} />} />
        <Route
          path="/deck/create"
          element={<PrivateRoute element={<Create_Deck />} />}
        />
        <Route path="*" element={<Not_found />} />
      </Routes>
    </TokenContext.Provider>
  );
}

export default App;
