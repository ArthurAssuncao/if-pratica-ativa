import {
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { ButtonConfirm } from "components/ui/ButtonConfirm";
import { nodeTypes } from "components/ui/FlowNodes";
import { QuestionHint } from "components/ui/QuestionHint";
import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import { BaseQuestionProps } from "types/question";
import { QuestionFlowchartnNew } from "types/quiz";
import { createQuestion } from "./QuestionFactory";

interface FlowchartNewQuestionProps extends BaseQuestionProps {
  data: QuestionFlowchartnNew;
}

export const FlowchartNewQuestion = createQuestion<
  FlowchartNewQuestionProps,
  QuestionFlowchartnNew
>({
  validateAnswer: ({ resposta, data }) => {
    return resposta === data.respostaCorreta.toString();
  },

  Component: ({ data, onAnswer, isAbleToAnswer, validateAnswer }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [nodeSelected, setNodeSelected] = useState<string>("");

    const handleClick = useCallback(
      (label: string) => {
        if (isAbleToAnswer) {
          setNodeSelected(label);
          return;
        }
        toast.error("Aguarde o tempo de leitura!");
      },
      [isAbleToAnswer],
    );

    const handleConfirmar = useCallback(() => {
      if (!isAbleToAnswer) {
        toast.error("Você não pode responder ainda!");
        return;
      }

      const acertou = validateAnswer({
        resposta: nodeSelected,
        data,
      });

      onAnswer(acertou, data.id);
    }, [onAnswer, data, isAbleToAnswer, nodeSelected, validateAnswer]);

    // Construção do fluxo com auto-layout
    useEffect(() => {
      const initialNodes: Node[] = [];
      const initialEdges: Edge[] = [];

      const espacamentoY = 150;
      const espacamentoX = 150;
      const centroX = 300;

      const processados = new Set<string>();

      const posicionarNo = (noId: string, x: number = 0, y: number = 0) => {
        if (processados.has(noId)) return;
        processados.add(noId);

        const noInfo = data.nos?.find((n) => n.id === noId);
        if (!noInfo) return;

        const isSelected = nodeSelected === noInfo.texto;

        initialNodes.push({
          id: noId,
          type: noInfo.tipo === "decisao" ? "decisao" : "opcao",
          position: { x, y },
          data: {
            label: noInfo.texto,
            onClick:
              noInfo.tipo === "terminal"
                ? () => handleClick(noInfo.texto || "")
                : undefined,
          },
          className: isSelected
            ? "ring-4 ring-green-500 rounded-lg transition-all"
            : "transition-all",
        });

        const conexoesSaindo =
          data.conexoes?.filter((c) => c.de === noId) || [];

        conexoesSaindo.forEach((conexao) => {
          let multiplicadorX = 0;
          if (conexoesSaindo.length > 1) {
            multiplicadorX = conexao.label === "Sim" ? 1 : -1;
          }

          const novoX = x + multiplicadorX * espacamentoX;
          const novoY = y + espacamentoY;

          const lineEdgeId = `e-${noId}-${conexao.para}`;

          initialEdges.push({
            id: lineEdgeId,
            source: noId,
            target: conexao.para,
            label: conexao.label,
            type: "smoothstep",
            // O targetHandle por padrão é o topo se você não definir IDs nos targets
            sourceHandle:
              conexao.label === "Sim"
                ? "right"
                : conexao.label === "Não"
                  ? "left"
                  : "top",
            labelStyle: {
              fill: "#94a3b8",
              fontWeight: 700,
              fontSize: 14,
            },

            labelBgBorderRadius: 8,
            labelBgPadding: [8, 4],
            // Força a conexão a entrar sempre pelo topo do próximo nó
            style: { stroke: "#94a3b8", strokeWidth: 2 },
          });

          posicionarNo(conexao.para, novoX, novoY);
        });
      };

      if (data.raiz) {
        posicionarNo(data.raiz, centroX, 50);
      }

      setNodes(initialNodes);
      setEdges(initialEdges);
    }, [data, handleClick, nodeSelected, setEdges, setNodes]);

    // Atualiza as funções de clique quando o timer libera
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
    }, [isAbleToAnswer, setNodes, handleClick]);

    return (
      <div className="flex flex-col gap-4 w-full items-center">
        {data.codigo && (
          <div className="flex flex-col gap-2 w-full">
            <strong className="text-sm">Código base:</strong>
            <div className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 text-slate-700 dark:text-blue-300 border p-2 md:p-4 rounded-lg w-full flex flex-col gap-1">
              <SyntaxHighlighterCustom>{data.codigo}</SyntaxHighlighterCustom>
            </div>
          </div>
        )}

        <div className="w-full h-112.5 bg-olive-50/50 dark:bg-slate-900/50 border-2 border-dashed border-olive-200 dark:border-slate-800 rounded-2xl overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            zoomOnScroll={false}
            preventScrolling={true}
            nodesConnectable={false}
            nodesDraggable={false}
          />
        </div>
        <QuestionHint>
          Para visualizar melhor, dê zoom no fluxo. Clique no retângulo que
          representa a resposta correta.
        </QuestionHint>

        <ButtonConfirm
          onClick={handleConfirmar}
          disabled={!isAbleToAnswer || nodeSelected === ""}
          label={
            nodeSelected
              ? `Confirmar: ${nodeSelected}`
              : "Selecione a resposta no fluxo"
          }
        />
      </div>
    );
  },
});
