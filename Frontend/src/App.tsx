import { Routes, Route, Navigate } from "react-router-dom";
import { createContext } from "react";

import Home from "./pages/home/home";
import Deck from "./pages/decks/deck";
import Create_Deck from "./pages/decks/deck-create";
import Not_found from "./pages/not-found/not-found";
import LoginForm from "./pages/auth/login";
import SignUpForm from "./pages/auth/signup";
import useToken from "./pages/auth/token";
import LoggedInHome from "./pages/home/home-authed";
import Game_Owner from "./pages/game/host/game-host";
import Game_Player from "./pages/game/player/game-player";
interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = true; // TODO Replace with actual authentication logic

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export const TokenContext = createContext<string | null>(null);
export const SetTokenContext = createContext<(userToken: string) => void>(
  () => {}
);

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <TokenContext.Provider value={token}>
      <SetTokenContext.Provider value={setToken}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/home"
            element={<LoggedInHome removeToken={removeToken} />}
          />
          <Route path="/deck" element={<Deck />} />
          <Route path="/deck/create" element={<Create_Deck />} />
          <Route path="/game/host" element={<Game_Owner />} />
          <Route path="/game/play" element={<Game_Player />} />
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
          <Route path="/signup" element={<SignUpForm setToken={setToken} />} />
          <Route
            path="/deck/create"
            element={<PrivateRoute element={<Create_Deck />} />}
          />
          <Route path="*" element={<Not_found />} />
        </Routes>
      </SetTokenContext.Provider>
    </TokenContext.Provider>
  );
}

export default App;
