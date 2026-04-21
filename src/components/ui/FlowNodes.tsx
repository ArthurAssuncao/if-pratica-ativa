import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { memo } from "react";

// Tipagem para os dados customizados dos nossos nós
type DecisionNodeData = Node<{ label: string }, "decisao">;
type OptionNodeData = Node<{ label: string; onClick: () => void }, "opcao">;

// Nó de Decisão (Losango)
export const DecisionNode = memo(({ data }: NodeProps<DecisionNodeData>) => {
  return (
    <div className="relative flex items-center justify-center w-32 h-32 hover:cursor-grab">
      <div className="absolute inset-0 rotate-45 border-2 border-yellow-500 bg-yellow-50 dark:bg-slate-800 shadow-sm" />
      <div className="relative font-mono text-center p-3 leading-tight text-slate-700 dark:text-blue-300">
        {data.label}
      </div>

      {/* ADICIONE ESTA LINHA: Entrada (Topo) */}
      <Handle
        type="target"
        position={Position.Top}
        className="bg-yellow-500!"
      />

      {/* Saída Esquerda */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="bg-yellow-500!"
      />

      {/* Saída Direita */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="bg-yellow-500!"
      />

      {/* Saída Baixo */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="bg-yellow-500!"
      />
    </div>
  );
});

// Nó de Opção/Ramo (Clicável)
export const OptionNode = memo(({ data }: NodeProps<OptionNodeData>) => {
  return (
    <div
      onClick={data.onClick}
      onKeyDown={(e) => e.key === "Enter" && data.onClick()}
      role="button"
      tabIndex={0}
      className="min-w-20 max-w-34 px-4 py-2 shadow-lg rounded-lg border-2 border-olive-400 bg-yellow-50 dark:bg-blue-500/10 
                  hover:scale-105 transition-all cursor-pointer  text-center "
    >
      <Handle type="target" position={Position.Top} className="bg-olive-400!" />
      <div className="font-bold text-blue-500 dark:text-blue-400">
        {data.label}
      </div>
    </div>
  );
});

// Criamos o objeto de tipos aqui, mas exportaremos separadamente se necessário
// eslint-disable-next-line react-refresh/only-export-components
export const nodeTypes = {
  decisao: DecisionNode,
  opcao: OptionNode,
};
