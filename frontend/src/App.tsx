import { AppRoutes } from './routes/AppRoutes';
import { Layout } from './components/layout/Layout';

function App() {
  // Lógica futura:
  // Se não estiver logado, renderizar rotas de Auth
  // Se estiver logado, renderizar o Layout + AppRoutes
  
  // Por enquanto, vamos renderizar o layout principal
  
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
  
  // Exemplo de como seria com autenticação:
  // const { isAuthenticated } = useAuth();
  // if (!isAuthenticated) {
  //   return <AuthRoutes />;
  // }
  // return (
  //   <Layout>
  //     <AppRoutes />
  //   </Layout>
  // );
}

export default App;