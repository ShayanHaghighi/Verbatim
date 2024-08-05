import { createContext } from "react";

import useToken from "./pages/auth/token";
import "./global.css";
import MyRoutes from "./routing";
import Navbar from "./components/navbar";

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
  // const { token, removeToken, setToken } = useToken();

  return (
    <TokenContext.Provider value={useToken()}>
      {/* <SetTokenContext.Provider value={setToken}> */}
      <Navbar />
      <MyRoutes />
      {/* </SetTokenContext.Provider> */}
    </TokenContext.Provider>
  );
}

export default App;
