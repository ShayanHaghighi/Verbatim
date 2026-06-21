import {  Route, Routes, useNavigate } from "react-router-dom";
import Deck from "./pages/decks/deck";
import Game_Owner from "./pages/game/host/game-host";
import Game_Player from "./pages/game/player/game-player";
import LoggedInHome from "./pages/home/home-authed";
import Not_found from "./pages/not-found/not-found";

import "./global.css";




export default function MyRoutes() {

  return (
    <div className="bg bg-bkg">
      <Routes>
        <Route path="/" element={<LoggedInHome />} />
        <Route path="/deck" element={<Deck />} />
        <Route path="/game/host" element={<Game_Owner />} />
        <Route path="/game/play" element={<Game_Player />} />
        <Route path="*" element={<Not_found />} />
      </Routes>
    </div>
  );
}
