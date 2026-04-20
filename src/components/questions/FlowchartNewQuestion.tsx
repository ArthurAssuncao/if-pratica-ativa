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
import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import { BaseQuestionProps } from "types/question";
import { QuestionFlowchartnNew } from "types/quiz";
import { createQuestion } from "./QuestionFactory";
import { TimeToResponse } from "./util/TimeToResponse";

interface FlowchartNewQuestionProps extends BaseQuestionProps {
  data: QuestionFlowchartnNew;
}

export const FlowchartNewQuestion = createQuestion<
  FlowchartNewQuestionProps,
  QuestionFlowchartnNew
>({
  validarResposta: ({ resposta, data }) => {
    return resposta === data.respostaCorreta.toString();
  },

  Component: ({ data, aoResponder, validarResposta }) => {
    const [isAbleToRespond, setIsAbleToRespond] = useState(false);
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [nodeSelected, setNodeSelected] = useState<string>("");

    const handleClick = useCallback(
      (label: string) => {
        if (isAbleToRespond) {
          setNodeSelected(label);
          return;
        }
        toast.error("Aguarde o tempo de leitura!");
      },
      [isAbleToRespond],
    );

    const handleConfirmar = useCallback(() => {
      if (!isAbleToRespond) {
        toast.error("Você não pode responder ainda!");
        return;
      }

      const acertou = validarResposta({
        resposta: nodeSelected,
        data,
      });

      aoResponder(acertou);
    }, [aoResponder, data, isAbleToRespond, nodeSelected, validarResposta]);

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
            ? "ring-4 ring-green-500 rounded-xl transition-all"
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
    }, [isAbleToRespond, setNodes, handleClick]);

    return (
      <div className="flex flex-col gap-6 w-full items-center">
        <TimeToResponse onTimerEnd={() => setIsAbleToRespond(true)} />

        <div className="w-full text-center mb-2">
          <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
            {data.pergunta}
          </h2>
        </div>

        {data.codigo && (
          <div className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 text-slate-700 dark:text-blue-300 border p-4 rounded-lg w-full flex flex-col gap-1">
            <strong>Código base:</strong>
            <SyntaxHighlighterCustom>{data.codigo}</SyntaxHighlighterCustom>
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
            nodesDraggable={true}
          />
        </div>

        <ButtonConfirm
          onClick={handleConfirmar}
          disabled={!isAbleToRespond || nodeSelected === ""}
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
