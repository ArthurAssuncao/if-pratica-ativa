import { LayoutGrid } from "lucide-react";
import type { Discipline } from "types/study";
import { DisciplineCard } from "./ui/DisciplineCard";

interface DisciplineSelectorProps {
  disciplines: Discipline[];
  selectedDisciplineId: string | null;
  onSelect: (id: string) => void;
}

export function DisciplineSelector({
  disciplines,
  selectedDisciplineId,
  onSelect,
}: DisciplineSelectorProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <LayoutGrid size={20} className="text-blue-500" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Selecione a Disciplina
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {disciplines.map((discipline) => (
          <DisciplineCard
            key={discipline.id}
            discipline={discipline}
            isSelected={selectedDisciplineId === discipline.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
