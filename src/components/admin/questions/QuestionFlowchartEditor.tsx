import { useState } from "react";
import { LANGUAGES } from "../../../constants/code";
import { QUESTION_TITLE_EMPTY } from "../../../constants/questions";
import type {
  ConectionNode,
  FlowchartNode,
  FlowchartNodeType,
  Languages,
  QuestionFlowchartnNew,
} from "../../../types/study";
import { ButtonAdd } from "../../ui/ButtonAdd";
import { Checkbox } from "../../ui/Checkbox";
import { CodeEditorCustom } from "../../ui/CodeEditorCustom";
import { Hint } from "../../ui/Hint";
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { TextArea } from "../../ui/TextArea";
import { TrashButton } from "../../ui/TrashButton";

interface QuestionFlowchartEditorProps {
  questionFlowchart: QuestionFlowchartnNew;
  setQuestionFlowchart: React.Dispatch<
    React.SetStateAction<QuestionFlowchartnNew>
  >;
}

const NODE_TYPES = [
  { value: "inicio", label: "Início" },
  { value: "decisao", label: "Decisão (if/elif/else)" },
  { value: "processo", label: "Processo" },
  { value: "terminal", label: "Terminal" },
];

export const QuestionFlowchartEditor = ({
  questionFlowchart,
  setQuestionFlowchart,
}: QuestionFlowchartEditorProps) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Adicionar novo nó
  const addNode = () => {
    const newNodeId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newNode: FlowchartNode = {
      id: newNodeId,
      text: "",
      type: "processo",
    };

    setQuestionFlowchart({
      ...questionFlowchart,
      nodes: [...questionFlowchart.nodes, newNode],
    });

    setSelectedNodeId(newNodeId);
  };

  // Atualizar nó
  const updateNode = (nodeId: string, updates: Partial<FlowchartNode>) => {
    setQuestionFlowchart({
      ...questionFlowchart,
      nodes: questionFlowchart.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node,
      ),
    });
  };

  // Remover nó
  const removeNode = (nodeId: string) => {
    // Remove conexões relacionadas
    const remainingConnections = questionFlowchart.connections.filter(
      (conn) => conn.from !== nodeId && conn.to !== nodeId,
    );

    // Se o root for removido, limpa
    const newRoot =
      questionFlowchart.root === nodeId ? "" : questionFlowchart.root;

    setQuestionFlowchart({
      ...questionFlowchart,
      nodes: questionFlowchart.nodes.filter((node) => node.id !== nodeId),
      connections: remainingConnections,
      root: newRoot,
    });

    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  // Adicionar conexão
  const addConnection = () => {
    const newConnection: ConectionNode = {
      from: "",
      to: "",
      label: "",
    };

    setQuestionFlowchart({
      ...questionFlowchart,
      connections: [...questionFlowchart.connections, newConnection],
    });
  };

  // Atualizar conexão
  const updateConnection = (index: number, updates: Partial<ConectionNode>) => {
    const newConnections = [...questionFlowchart.connections];
    newConnections[index] = { ...newConnections[index], ...updates };

    setQuestionFlowchart({
      ...questionFlowchart,
      connections: newConnections,
    });
  };

  // Remover conexão
  const removeConnection = (index: number) => {
    setQuestionFlowchart({
      ...questionFlowchart,
      connections: questionFlowchart.connections.filter((_, i) => i !== index),
    });
  };

  // Definir root
  const setRoot = (nodeId: string) => {
    setQuestionFlowchart({
      ...questionFlowchart,
      root: nodeId,
    });
  };

  // Verificar se um nó pode ser root (apenas início ou decisão)
  const canBeRoot = (nodeType: string) => {
    return nodeType === "inicio" || nodeType === "decisao";
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
      {/* Linguagem */}
      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Linguagem
        </label>
        <Select
          value={questionFlowchart.language}
          options={LANGUAGES}
          defaultValue={questionFlowchart.language}
          onChange={(value) => {
            setQuestionFlowchart({
              ...questionFlowchart,
              language: value as Languages,
            });
          }}
        />
      </div>
      {/* Enunciado */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Enunciado / Pergunta
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 h-24 text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Descreva o que o aluno deve fazer..."
          value={
            questionFlowchart.questionText === QUESTION_TITLE_EMPTY
              ? ""
              : questionFlowchart.questionText
          }
          onChange={(e) =>
            setQuestionFlowchart({
              ...questionFlowchart,
              questionText: e.target.value,
            })
          }
        />
      </div>

      {/* Código base */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Código Base
        </label>
        <div className="flex flex-col gap-2  bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
          <CodeEditorCustom
            value={questionFlowchart.code}
            language={questionFlowchart.language}
            displayLanguage={true}
            onChange={(evn) => {
              setQuestionFlowchart({
                ...questionFlowchart,
                code: evn.target.value,
              });
            }}
          />
        </div>
      </div>

      {/* Nodes */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Nós do Fluxograma
          </label>
          <ButtonAdd onClick={addNode}>+ Adicionar Nó</ButtonAdd>
        </div>

        {/* Raiz/Início */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
          <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Nó Raiz (Início)
          </label>
          <Select
            value={questionFlowchart.root}
            options={questionFlowchart.nodes
              .filter((node) => canBeRoot(node?.type || ""))
              .map((node) => ({
                value: node.id,
                label: `${node.text || node.id} (${node.type})`,
              }))}
            placeholder="Selecione o nó inicial"
            onChange={(value) => setRoot(value)}
          />
          <Hint>Apenas nós do tipo "Início" ou "Decisão" podem ser raiz</Hint>
        </div>

        {/* Lista de nós */}
        <div className="space-y-2 ">
          {questionFlowchart.nodes.map((node) => (
            <div
              key={node.id}
              className={`p-3 pr-0 rounded-xl border flex w-full ${
                selectedNodeId === node.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
              }`}
              onClick={() => setSelectedNodeId(node.id)}
            >
              <div className="flex gap-2 items-center w-full">
                <div className="flex-1 space-y-2">
                  <Input
                    type="text"
                    placeholder="Texto do nó"
                    value={node.text}
                    onChange={(e) =>
                      updateNode(node.id, { text: e.target.value })
                    }
                    className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg text-sm"
                  />
                  <div className="flex gap-2">
                    <Select
                      value={node.type}
                      options={NODE_TYPES}
                      onChange={(value) =>
                        updateNode(node.id, {
                          type: value as FlowchartNodeType,
                        })
                      }
                      containerClassName="flex-1"
                    />
                    <div className="text-sm flex flex-col items-center justify-center gap-1">
                      <span>É correto?</span>
                      <Checkbox
                        checkboxSize="lg"
                        checked={
                          node.text ===
                          questionFlowchart.correctAnswer.option.toString()
                        }
                        onChange={() =>
                          setQuestionFlowchart({
                            ...questionFlowchart,
                            correctAnswer: {
                              option: node.text,
                              text: node.text,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="text-sm flex flex-col items-center justify-center gap-1">
                      <span>É nó raiz?</span>
                      <Checkbox
                        checkboxSize="lg"
                        disabled={node.type === "terminal"}
                        checked={node.id === questionFlowchart.root}
                        onChange={() =>
                          setQuestionFlowchart({
                            ...questionFlowchart,
                            root: node.id,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="h-full border-l border-dashed border-blue-300 flex items-center justify-center p-2">
                  <TrashButton onClick={() => removeNode(node.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connections */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Conexões
          </label>
          <ButtonAdd onClick={addConnection}>+ Adicionar Conexão</ButtonAdd>
        </div>

        <div className="space-y-2 ">
          {questionFlowchart.connections.map((conn, idx) => (
            <div
              key={idx}
              className="flex w-full h-full gap-2 items-center bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl"
            >
              <div className="flex gap-2 items-center justify-between w-full h-full">
                <div className="flex gap-2 items-center flex-2">
                  <Select
                    value={conn.from}
                    options={questionFlowchart.nodes.map((node) => ({
                      value: node.id,
                      label: node.text || node.id,
                    }))}
                    placeholder="De"
                    onChange={(value) => updateConnection(idx, { from: value })}
                    containerClassName=""
                  />
                  <span className="text-slate-400">→</span>
                </div>
                <Select
                  value={conn.to}
                  options={questionFlowchart.nodes.map((node) => ({
                    value: node.id,
                    label: node.text || node.id,
                  }))}
                  placeholder="Para"
                  onChange={(value) => updateConnection(idx, { to: value })}
                  containerClassName="flex-2"
                />
                <div className="flex h-full flex-1">
                  <Input
                    type="text"
                    placeholder="Rótulo (Sim/Não)"
                    value={conn.label}
                    onChange={(e) =>
                      updateConnection(idx, { label: e.target.value })
                    }
                    className="w-24 p-2 bg-white dark:bg-slate-900 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="h-full border-l border-dashed border-blue-300 flex items-center justify-center p-2">
                <TrashButton onClick={() => removeConnection(idx)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="space-y-1.5 pt-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Explicação (Feedback)
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none h-20 text-sm italic"
          placeholder="Explique o fluxo correto..."
          value={questionFlowchart.explanation}
          onChange={(e) =>
            setQuestionFlowchart({
              ...questionFlowchart,
              explanation: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};
