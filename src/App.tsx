import { BrowserRouter, Route, Routes } from "react-router-dom";
// Importe seu componente do sistema atual (que agora chamaremos de AppSistema)
import AppSistema from "./AppSistema";
import { AdminPage } from "./components/admin/AdminPage";
import NotFound from "./components/NotFound";
import { Home } from "./Home";

// 2. Configuração Principal
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Raiz: Home Simples */}
        <Route path="/" element={<Home />} />

        {/* Rota /app: Onde ficará seu sistema atual */}
        <Route path="/app" element={<AppSistema />} />

        {/* Rota Administrativa */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Rota 404 (Opcional): Caso o usuário digite algo errado */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
