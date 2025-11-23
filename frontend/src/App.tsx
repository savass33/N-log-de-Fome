import { AppRoutes } from "./routes/AppRoutes";
import { useAuth } from "./hooks/useAuth";
import { Loader } from "./components/common/Loader";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }
  return <AppRoutes />;
}

export default App;
