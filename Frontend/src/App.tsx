import { createContext, useEffect } from "react";

import "./global.css";
import MyRoutes from "./routing";
import Navbar from "./components/navbar";
import { useNavigate } from "react-router-dom";
import { setNavigate } from "./utils/navigate";

export const TokenContext = createContext<{
  setToken: (userToken: string) => void;
  token: string | null;
  removeToken: () => void;
}>({
  setToken: () => console.log("setToken not set"),
  token: null,
  removeToken: () => console.log("removeToken not set"),
});

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  // const { token, removeToken, setToken } = useToken();

  return (
      <Navbar>
        <MyRoutes />
      </Navbar>
  );
}

export default App;
