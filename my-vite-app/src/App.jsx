import { UserLocationProvider } from "./context/UserLocationContext.jsx";
import {Outlet} from "react-router-dom";
import Wrapper from "./pages/Wrapper";

function App() {
  return (
      <Wrapper>
          <UserLocationProvider>
              <Outlet />
          </UserLocationProvider>
      </Wrapper>
  );
}

export default App;
