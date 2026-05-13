import { BookOpen, HelpCircle, Layout, Plus } from "lucide-react";
import { useState } from "react";
import { DisciplineEditor } from "./DisciplineEditor";
import { QuestionEditor } from "./QuestionEditor";

// Tipagem simplificada para o estado do componente
type AdminTab = "disciplinas" | "conteudos" | "questoes";

interface NavBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("questoes");
  // const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar de Navegação */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-black mb-8 text-blue-600">Painel Admin</h2>
        <nav className="space-y-2">
          <NavBtn
            active={activeTab === "disciplinas"}
            onClick={() => setActiveTab("disciplinas")}
            icon={<Layout size={20} />}
            label="Disciplinas"
          />
          <NavBtn
            active={activeTab === "conteudos"}
            onClick={() => setActiveTab("conteudos")}
            icon={<BookOpen size={20} />}
            label="Conteúdos"
          />
          <NavBtn
            active={activeTab === "questoes"}
            onClick={() => setActiveTab("questoes")}
            icon={<HelpCircle size={20} />}
            label="Questões"
          />
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black dark:text-white capitalize">
              {activeTab}
            </h1>
            <p className="text-slate-500 text-sm">
              Gerencie os parâmetros do sistema IF Aprenda.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
            <Plus size={18} /> Novo Registro
          </button>
        </header>

        {activeTab === "questoes" && <QuestionEditor />}
        {activeTab === "disciplinas" && <DisciplineEditor />}
      </main>
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: NavBtnProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    {icon} {label}
  </button>
);
