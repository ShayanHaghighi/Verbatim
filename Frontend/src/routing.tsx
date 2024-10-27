import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import LoginForm from "./pages/auth/login";
import SignUpForm from "./pages/auth/signup";
import Deck from "./pages/decks/deck";
import Create_Deck from "./pages/decks/deck-create";
import Game_Owner from "./pages/game/host/game-host";
import Game_Player from "./pages/game/player/game-player";
import LoggedInHome from "./pages/home/home-authed";
import Not_found from "./pages/not-found/not-found";
import useToken from "./pages/auth/token";

import "./global.css";
import DeckView from "./pages/decks/deck-view";

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = true; // TODO Replace with actual authentication logic

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default function MyRoutes() {
  const { token, removeToken, setToken } = useToken();

  return (
    <div className="bg bg-bkg">
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
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm setToken={setToken} />} />
        <Route
          path="/deck/create"
          element={<PrivateRoute element={<Create_Deck />} />}
        />
        <Route path="deck/:id" element={<DeckView />} />
        <Route path="*" element={<Not_found />} />
      </Routes>
    </div>
  );
}
