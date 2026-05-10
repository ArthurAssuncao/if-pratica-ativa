import { BrowserRouter, Route, Routes } from "react-router-dom";
// Importe seu componente do sistema atual (que agora chamaremos de AppSistema)
import AppSistema from "./AppSistema";
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

        {/* Rota 404 (Opcional): Caso o usuário digite algo errado */}
        <Route
          path="*"
          element={<div className="p-10">Página não encontrada.</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
