import { UserLocationProvider } from "./context/UserLocationContext.jsx";
import {Outlet} from "react-router-dom";

function App() {
  return (
      <UserLocationProvider>
        <Outlet />
      </UserLocationProvider>
  );
}

export default App;
