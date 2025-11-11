import { AppRoutes } from "./routes/AppRoutes";
import { Layout } from "./components/layout/Layout";
import { useAuth } from "./hooks/useAuth";
import { Login } from "./pages/Auth/Login";
import { Loader } from "./components/common/Loader";

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Se estiver carregando (verificando token ou no login fake)
    return <Loader />;
  }

  if (!user) {
    // Se NÃO há usuário, mostre a tela de Login
    return <Login />;
  }

  // Se HÁ usuário, mostre o Layout principal com as rotas do app
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;
