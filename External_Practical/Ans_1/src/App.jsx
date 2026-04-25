import { UserProvider } from "./UserContext";
import Home from "./Home";

function App() {
  return (
    <UserProvider>
      <Home />
    </UserProvider>
  );
}

export default App;