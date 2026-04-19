import {
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { ButtonConfirm } from "components/ui/ButtonConfirm";
import { nodeTypes } from "components/ui/FlowNodes";
import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import { BaseQuestionProps } from "types/question";
import { TimeToResponse } from "./util/TimeToResponse";

export const FlowchartQuestionNew = ({
  data,
  aoResponder,
}: BaseQuestionProps) => {
  const [isAbleToRespond, setIsAbleToRespond] = React.useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [nodeSelected, setNodeSelected] = useState<string>("");

  const handleClick = useCallback(
    (ramoLabel: string) => {
      if (isAbleToRespond) {
        setNodeSelected(ramoLabel);
        return;
      }
      toast.error("Aguarde o tempo de leitura!");
    },
    [isAbleToRespond],
  );

  const handleConfirmar = useCallback(() => {
    if (isAbleToRespond) {
      aoResponder(nodeSelected);
      return;
    }
    toast.error("Aguarde o tempo de leitura!");
  }, [aoResponder, isAbleToRespond, nodeSelected]);

  // 3. Efeito para construir o esqueleto inicial do fluxo
  useEffect(() => {
    const totalRamos = data.ramos?.length || 0;
    // const larguraEspaco = 600;
    const larguraEspaco =
      typeof window !== "undefined" && window.innerWidth < 768 ? 350 : 600;

    const posXMeio = larguraEspaco / 2;

    const initialNodes: Node[] = [
      // {
      //   id: "codigo",
      //   type: "default",
      //   data: { label: data.codigo },
      //   position: { x: 250, y: 0 },
      //   className:
      //     "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 font-mono text-[10px] w-64",
      // },
      {
        id: "decisao",
        type: "decisao",
        data: { label: data.condicao },
        position: { x: larguraEspaco / 2 - 50, y: 0 },
      },
    ];

    const initialEdges: Edge[] = [
      { id: "e-cod-dec", source: "codigo", target: "decisao", animated: true },
    ];

    data.ramos?.forEach((ramo, index) => {
      let sourceHandle = "bottom"; // Padrão

      if (totalRamos % 2 === 0) {
        if (totalRamos > 1) {
          if (index === 0)
            sourceHandle = "left"; // Primeiro ramo sai pela esquerda
          else if (index === totalRamos - 1) {
            sourceHandle = "right"; // Último ramo sai pela direita
          }
        }
      } else {
        const ramoDoMeio = Math.floor(totalRamos / 2);
        if (totalRamos > 1) {
          if (index < ramoDoMeio) {
            sourceHandle = "left"; // Primeiro ramo sai pela esquerda
          } else if (index > ramoDoMeio) {
            sourceHandle = "right"; // Último ramo sai pela direita
          }
        }
      }

      const tamanhoRamoPx = 192;
      // Ajuste para a distância desejada
      let gap = -48;
      if (totalRamos > 2) {
        if (totalRamos % 2 === 1) {
          gap = -80;
        } else {
          gap = -48;
        }
      }
      // A lógica permanece a mesma, pois ela é matematicamente proporcional
      const larguraTotalOcupada =
        totalRamos * tamanhoRamoPx + (totalRamos - 1) * gap;
      const inicioX = posXMeio - larguraTotalOcupada / 2;

      const posX = inicioX + index * (tamanhoRamoPx + gap);

      let posY = 200;
      if (totalRamos > 2) {
        posY = 200 + ((index % 2) * tamanhoRamoPx) / 2;
      }

      initialNodes.push({
        id: ramo.id,
        type: "opcao",
        position: { x: posX + 50, y: posY },
        data: {
          label: ramo.label,
          // Note: passamos a função aqui, mas ela será atualizada pelo próximo useEffect
          onClick: () => handleClick(ramo.label),
        },
      });

      initialEdges.push({
        id: `e-dec-${ramo.id}`,
        source: "decisao",
        sourceHandle: sourceHandle,
        target: ramo.id,
        labelStyle: {
          fill: "#94a3b8",
          fontWeight: 700,
          fontSize: 14,
          transform: "translateY(15px)",
        },
        labelBgStyle: {
          transform: "translateY(15px)",
        },
        labelBgBorderRadius: 4,
        labelBgPadding: [4, 4],
        label:
          totalRamos === 2
            ? index === 0
              ? "Sim"
              : "Não"
            : `Condição ${index + 1}`,
      });
    });

    setNodes(initialNodes);
    setEdges(initialEdges);
    // Incluímos handleClick para satisfazer o ESLint, embora o próximo effect cuide da atualização
  }, [data, setNodes, setEdges, handleClick]);

  // 4. Efeito para "destravar" o clique nos nós quando o timer terminar
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === "opcao") {
          return {
            ...node,
            data: {
              ...node.data,
              onClick: () => handleClick(node.data.label as string),
            },
          };
        }
        return node;
      }),
    );
  }, [isAbleToRespond, setNodes, handleClick]);

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      <TimeToResponse onTimerEnd={() => setIsAbleToRespond(true)} />

      <div className="w-full text-center mb-2">
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
          {data.pergunta}
        </h2>
      </div>

      <div className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 text-slate-700 dark:text-blue-300 border p-4 rounded-lg  w-full flex flex-col gap-1">
        {data.codigo && (
          <>
            <strong>Código base:</strong>
            <SyntaxHighlighterCustom>{data.codigo}</SyntaxHighlighterCustom>
          </>
        )}
      </div>
      {!data.codigo && <span>Nenhum código foi fornecido.</span>}

      <div className="w-full h-112.5 bg-olive-50/50 dark:bg-slate-900/50 border-2 border-dashed border-olive-200 dark:border-slate-800 rounded-2xl overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView={true}
          // panOnDrag={false}
          zoomOnScroll={false}
          preventScrolling={true}
        >
          {/* <Background gap={20} color="#cbd5e1" /> */}
        </ReactFlow>

        {/* {!isAbleToRespond && (
          <div className="absolute inset-0 z-10 bg-white/20 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <span className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-lg text-xs font-bold animate-pulse">
              Analise o fluxo antes de responder...
            </span>
          </div>
        )} */}
      </div>
      <ButtonConfirm
        onClick={handleConfirmar}
        disabled={!isAbleToRespond || nodeSelected === ""}
      />
    </div>
  );
};
