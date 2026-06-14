import { Plus, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { disciplineService } from "../../service/disciplineService";

import { contentService } from "../../service/contentService";
import type { Content, Discipline, Level } from "../../types/study";
import { generateIDSlugFromString } from "../../util/util";
import { Input } from "../ui/Input";
import { Select, type SelectOption } from "../ui/Select";

// Níveis disponíveis
const selectIconSize = 16;
const levelsOptions: SelectOption[] = [
  {
    value: "iniciante",
    label: "Iniciante",
    icon: <SignalLow size={selectIconSize} />,
  },
  {
    value: "intermediário",
    label: "Intermediário",
    icon: <SignalMedium size={selectIconSize} />,
  },
  {
    value: "avançado",
    label: "Avançado",
    icon: <SignalHigh size={selectIconSize} />,
  },
];

export const ContentEditor = () => {
  const [content, setContent] = useState<Content>({} as Content);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [isLoadingDisciplines, setIsLoadingDisciplines] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disciplineSelected, setDisciplineSelected] =
    useState<Discipline | null>(null);

  // Carregar disciplinas do banco
  useEffect(() => {
    const loadDisciplines = async () => {
      try {
        const disciplinesList = await disciplineService.getDisciplines();
        setDisciplines(disciplinesList);
      } catch (error) {
        console.error("Erro ao carregar disciplinas:", error);
        toast.error("Erro ao carregar lista de disciplinas");
      } finally {
        setIsLoadingDisciplines(false);
      }
    };

    loadDisciplines();
  }, []);

  // Gerar ID e slug a partir do nome
  const generateId = (name: string) => {
    return generateIDSlugFromString(name);
  };

  // Quando o nome muda, atualiza o ID e o slug
  const handleNameChange = (name: string) => {
    const newId = generateId(name);
    setContent({
      ...content,
      name,
      id: newId,
      slug: newId,
    });
  };

  // Quando a disciplina é selecionada
  const handleDisciplineChange = (disciplineName: string) => {
    const selectedDiscipline = disciplines.find(
      (d) => d.name === disciplineName,
    );

    if (selectedDiscipline) {
      setDisciplineSelected(selectedDiscipline);
      setContent({
        ...content,
        disciplineId: selectedDiscipline.id,
      });
    }
  };

  // Opções para o select de disciplinas
  const disciplineOptions = disciplines.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  const handleSubmit = async () => {
    if (!content.name) {
      toast.error("Por favor, insira o nome do conteúdo");
      return;
    }

    if (!content.disciplineId) {
      toast.error("Por favor, selecione uma disciplina");
      return;
    }

    if (!content.level) {
      toast.error("Por favor, selecione o nível");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await contentService.createContent(content);
      if (response.id) {
        toast.success(`Conteúdo "${content.name}" criado com sucesso!`);
        // Limpar formulário
        setContent({} as Content);
      }
    } catch (error) {
      console.error("Erro ao criar conteúdo:", error);
      toast.error("Erro ao criar conteúdo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black dark:text-white capitalize">
            Conteúdo
          </h1>
          <p className="text-slate-500 text-sm">
            Cadastre novos conteúdos para as disciplinas
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <Plus size={16} />
          {isSubmitting ? "Cadastrando..." : "Cadastrar Conteúdo"}
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coluna da esquerda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase mb-1">
                Nome do Conteúdo *
              </label>
              <Input
                type="text"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
                placeholder="Ex: Variáveis e Tipos"
                value={content.name || ""}
                onChange={(ev) => handleNameChange(ev.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase mb-1">
                ID / Slug
              </label>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-700 dark:text-slate-300 font-mono">
                {content.id || "Será gerado automaticamente a partir do nome"}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Usado como identificador único na URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase mb-1">
                Disciplina *
              </label>
              {isLoadingDisciplines ? (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-500">
                  Carregando disciplinas...
                </div>
              ) : (
                <Select
                  value={disciplineSelected?.name || ""}
                  options={disciplineOptions}
                  placeholder="Selecione uma disciplina"
                  onChange={handleDisciplineChange}
                />
              )}
            </div>
          </div>

          {/* Coluna da direita */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase mb-1">
                Nível *
              </label>
              <Select
                value={content.level || ""}
                options={levelsOptions}
                placeholder="Selecione o nível"
                onChange={(value) =>
                  setContent({ ...content, level: value as Level })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase mb-1">
                Ordem
              </label>
              <Input
                type="number"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
                placeholder="Ordem de exibição"
                value={content.order || ""}
                onChange={(ev) =>
                  setContent({
                    ...content,
                    order: parseInt(ev.target.value) || 0,
                  })
                }
              />
              <p className="text-xs text-slate-400 mt-1">
                Define a ordem de exibição dentro da disciplina (menor =
                primeiro)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
