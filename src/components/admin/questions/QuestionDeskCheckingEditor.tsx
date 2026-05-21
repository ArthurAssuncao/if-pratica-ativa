import { useState } from "react";
import { LANGUAGES } from "../../../constants/code";
import { QUESTION_TITLE_EMPTY } from "../../../constants/questions";
import type {
  Checkpoint,
  Languages,
  QuestionDeskCheck,
  Slot,
} from "../../../types/study";
import { ButtonAdd } from "../../ui/ButtonAdd";
import { CodeEditorCustom } from "../../ui/CodeEditorCustom";
import { Hint } from "../../ui/Hint";
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { TextArea } from "../../ui/TextArea";
import { TrashButton } from "../../ui/TrashButton";

interface QuestionDeskCheckingEditorProps {
  questionDeskChecking: QuestionDeskCheck;
  setQuestionDeskChecking: React.Dispatch<
    React.SetStateAction<QuestionDeskCheck>
  >;
}

// Tipos de slot disponíveis
const SLOT_TYPES = [
  { value: "NUMBER", label: "Número" },
  { value: "STRING", label: "Texto/String" },
  { value: "BOOLEAN", label: "Booleano (true/false)" },
  { value: "OUTPUT", label: "Saída/Output" },
];

export const QuestionDeskCheckingEditor = ({
  questionDeskChecking,
  setQuestionDeskChecking,
}: QuestionDeskCheckingEditorProps) => {
  const [selectedCheckpointIndex, setSelectedCheckpointIndex] = useState<
    number | null
  >(null);
  const [selectedSlotPosition, setSelectedSlotPosition] = useState<{
    checkpointIndex: number;
    slotIndex: number;
  } | null>(null);

  // Adicionar novo checkpoint
  const addCheckpoint = () => {
    const newCheckpoint: Checkpoint = {
      step: questionDeskChecking.checkpoints.length + 1,
      description: "",
      lineReference: [],
      slots: [],
    };

    setQuestionDeskChecking({
      ...questionDeskChecking,
      checkpoints: [...questionDeskChecking.checkpoints, newCheckpoint],
    });

    setSelectedCheckpointIndex(questionDeskChecking.checkpoints.length);
  };

  // Atualizar checkpoint
  const updateCheckpoint = (index: number, updates: Partial<Checkpoint>) => {
    const newCheckpoints = [...questionDeskChecking.checkpoints];
    newCheckpoints[index] = { ...newCheckpoints[index], ...updates };

    setQuestionDeskChecking({
      ...questionDeskChecking,
      checkpoints: newCheckpoints,
    });
  };

  // Remover checkpoint
  const removeCheckpoint = (index: number) => {
    const newCheckpoints = questionDeskChecking.checkpoints.filter(
      (_, i) => i !== index,
    );

    // Reordenar steps
    const reorderedCheckpoints = newCheckpoints.map((checkpoint, idx) => ({
      ...checkpoint,
      step: idx + 1,
    }));

    setQuestionDeskChecking({
      ...questionDeskChecking,
      checkpoints: reorderedCheckpoints,
    });

    if (selectedCheckpointIndex === index) {
      setSelectedCheckpointIndex(null);
    } else if (
      selectedCheckpointIndex !== null &&
      selectedCheckpointIndex > index
    ) {
      setSelectedCheckpointIndex(selectedCheckpointIndex - 1);
    }
  };

  // Adicionar slot a um checkpoint
  const addSlot = (checkpointIndex: number) => {
    const newSlot: Slot = {
      id: `slot_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      label: "",
      type: "STRING",
      expected: "",
    };

    const checkpoint = questionDeskChecking.checkpoints[checkpointIndex];
    const updatedCheckpoints = [...questionDeskChecking.checkpoints];
    updatedCheckpoints[checkpointIndex] = {
      ...checkpoint,
      slots: [...checkpoint.slots, newSlot],
    };

    setQuestionDeskChecking({
      ...questionDeskChecking,
      checkpoints: updatedCheckpoints,
    });
  };

  // Atualizar slot
  const updateSlot = (
    checkpointIndex: number,
    slotIndex: number,
    updates: Partial<Slot>,
  ) => {
    const updatedCheckpoints = [...questionDeskChecking.checkpoints];
    const checkpoint = updatedCheckpoints[checkpointIndex];
    const updatedSlots = [...checkpoint.slots];
    updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], ...updates };
    updatedCheckpoints[checkpointIndex] = {
      ...checkpoint,
      slots: updatedSlots,
    };

    setQuestionDeskChecking({
      ...questionDeskChecking,
      checkpoints: updatedCheckpoints,
    });
  };

  // Remover slot
  const removeSlot = (checkpointIndex: number, slotIndex: number) => {
    const updatedCheckpoints = [...questionDeskChecking.checkpoints];
    const checkpoint = updatedCheckpoints[checkpointIndex];
    const updatedSlots = checkpoint.slots.filter((_, i) => i !== slotIndex);
    updatedCheckpoints[checkpointIndex] = {
      ...checkpoint,
      slots: updatedSlots,
    };

    setQuestionDeskChecking({
      ...questionDeskChecking,
      checkpoints: updatedCheckpoints,
    });

    if (
      selectedSlotPosition?.checkpointIndex === checkpointIndex &&
      selectedSlotPosition?.slotIndex === slotIndex
    ) {
      setSelectedSlotPosition(null);
    }
  };

  // Adicionar linha de referência
  const addLineReference = (checkpointIndex: number) => {
    const checkpoint = questionDeskChecking.checkpoints[checkpointIndex];
    updateCheckpoint(checkpointIndex, {
      lineReference: [...checkpoint.lineReference, 0],
    });
  };

  // Atualizar linha de referência
  const updateLineReference = (
    checkpointIndex: number,
    lineIndex: number,
    value: number,
  ) => {
    const checkpoint = questionDeskChecking.checkpoints[checkpointIndex];
    const newLineReferences = [...checkpoint.lineReference];
    newLineReferences[lineIndex] = value;
    updateCheckpoint(checkpointIndex, { lineReference: newLineReferences });
  };

  // Remover linha de referência
  const removeLineReference = (checkpointIndex: number, lineIndex: number) => {
    const checkpoint = questionDeskChecking.checkpoints[checkpointIndex];
    const newLineReferences = checkpoint.lineReference.filter(
      (_, i) => i !== lineIndex,
    );
    updateCheckpoint(checkpointIndex, { lineReference: newLineReferences });
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
      {/* Linguagem */}
      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Linguagem
        </label>
        <Select
          value={questionDeskChecking.language}
          options={LANGUAGES}
          defaultValue={questionDeskChecking.language}
          onChange={(value) => {
            setQuestionDeskChecking({
              ...questionDeskChecking,
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
            questionDeskChecking.questionText === QUESTION_TITLE_EMPTY
              ? ""
              : questionDeskChecking.questionText
          }
          onChange={(e) =>
            setQuestionDeskChecking({
              ...questionDeskChecking,
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
        <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
          <CodeEditorCustom
            value={questionDeskChecking.code}
            language={questionDeskChecking.language}
            displayLanguage={true}
            onChange={(evn) => {
              setQuestionDeskChecking({
                ...questionDeskChecking,
                code: evn.target.value,
              });
            }}
          />
        </div>
        <Hint>Os checkpoints farão referência às linhas deste código</Hint>
      </div>

      {/* Checkpoints */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Checkpoints
          </label>
          <ButtonAdd onClick={addCheckpoint}>+ Adicionar Checkpoint</ButtonAdd>
        </div>

        {/* Lista de checkpoints */}
        <div className="space-y-4">
          {questionDeskChecking.checkpoints.map(
            (checkpoint, checkpointIndex) => (
              <div
                key={checkpointIndex}
                className={`p-4 rounded-xl border ${
                  selectedCheckpointIndex === checkpointIndex
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
                }`}
                onClick={() => setSelectedCheckpointIndex(checkpointIndex)}
              >
                {/* Cabeçalho do checkpoint */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      Step {checkpoint.step}
                    </span>
                    <span className="text-xs text-slate-500">
                      {checkpoint.slots.length} slot(s)
                    </span>
                  </div>
                  <TrashButton
                    onClick={() => removeCheckpoint(checkpointIndex)}
                  />
                </div>

                {/* Descrição do checkpoint */}
                <div className="mb-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Descrição
                  </label>
                  <TextArea
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 text-sm mt-1"
                    placeholder="Descreva o que deve ser verificado neste checkpoint..."
                    value={checkpoint.description}
                    onChange={(e) =>
                      updateCheckpoint(checkpointIndex, {
                        description: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>

                {/* Linhas de referência */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Linhas de Código Referenciadas
                    </label>
                    <ButtonAdd
                      onClick={() => addLineReference(checkpointIndex)}
                    >
                      + Adicionar Linha
                    </ButtonAdd>
                  </div>
                  <div className="space-y-2">
                    {checkpoint.lineReference.map((line, lineIndex) => (
                      <div key={lineIndex} className="flex gap-2 items-center">
                        <Input
                          type="number"
                          placeholder="Número da linha"
                          value={line || ""}
                          onChange={(e) =>
                            updateLineReference(
                              checkpointIndex,
                              lineIndex,
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="flex-1 p-2 bg-white dark:bg-slate-900 rounded-lg text-sm"
                        />
                        <TrashButton
                          onClick={() =>
                            removeLineReference(checkpointIndex, lineIndex)
                          }
                        />
                      </div>
                    ))}
                    {checkpoint.lineReference.length === 0 && (
                      <div className="text-xs text-slate-400 italic">
                        Nenhuma linha referenciada. Adicione as linhas onde este
                        checkpoint se aplica.
                      </div>
                    )}
                  </div>
                </div>

                {/* Iteração (opcional) */}
                <div className="mb-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Iteração (opcional)
                  </label>
                  <Input
                    type="number"
                    placeholder="Número da iteração (para loops)"
                    value={checkpoint.iteration || ""}
                    onChange={(e) =>
                      updateCheckpoint(checkpointIndex, {
                        iteration: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg text-sm mt-1"
                  />
                  <Hint>
                    Use para especificar em qual iteração de um loop este
                    checkpoint é válido
                  </Hint>
                </div>

                {/* Slots */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Slots para Preenchimento
                    </label>
                    <ButtonAdd onClick={() => addSlot(checkpointIndex)}>
                      + Adicionar Slot
                    </ButtonAdd>
                  </div>
                  <div className="space-y-3">
                    {checkpoint.slots.map((slot, slotIndex) => (
                      <div
                        key={slot.id}
                        className={`p-3 rounded-lg border ${
                          selectedSlotPosition?.checkpointIndex ===
                            checkpointIndex &&
                          selectedSlotPosition?.slotIndex === slotIndex
                            ? "bg-green-50 dark:bg-green-900/20 border-green-300"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSlotPosition({
                            checkpointIndex,
                            slotIndex,
                          });
                        }}
                      >
                        <div className="flex gap-2 mb-2">
                          <div className="flex-1">
                            <label className="text-[9px] font-semibold text-slate-500">
                              Rótulo do Slot
                            </label>
                            <Input
                              type="text"
                              placeholder="Ex: valor, resultado, nome..."
                              value={slot.label}
                              onChange={(e) =>
                                updateSlot(checkpointIndex, slotIndex, {
                                  label: e.target.value,
                                })
                              }
                              className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm"
                            />
                          </div>
                          <div className="w-32">
                            <label className="text-[9px] font-semibold text-slate-500">
                              Tipo
                            </label>
                            <Select
                              value={slot.type}
                              options={SLOT_TYPES}
                              onChange={(value) =>
                                updateSlot(checkpointIndex, slotIndex, {
                                  type: value as Slot["type"],
                                })
                              }
                              containerClassName="w-full"
                            />
                          </div>
                          <div className="flex items-end">
                            <TrashButton
                              onClick={() =>
                                removeSlot(checkpointIndex, slotIndex)
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-slate-500">
                            Valor Esperado
                          </label>
                          {slot.type === "BOOLEAN" ? (
                            <Select
                              value={slot.expected}
                              options={[
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                              ]}
                              onChange={(value) =>
                                updateSlot(checkpointIndex, slotIndex, {
                                  expected: value,
                                })
                              }
                              containerClassName="w-full"
                            />
                          ) : slot.type === "NUMBER" ? (
                            <Input
                              type="number"
                              placeholder="Valor numérico esperado"
                              value={slot.expected}
                              onChange={(e) =>
                                updateSlot(checkpointIndex, slotIndex, {
                                  expected: e.target.value,
                                })
                              }
                              className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm"
                            />
                          ) : (
                            <Input
                              type="text"
                              placeholder="Valor esperado"
                              value={slot.expected}
                              onChange={(e) =>
                                updateSlot(checkpointIndex, slotIndex, {
                                  expected: e.target.value,
                                })
                              }
                              className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    {checkpoint.slots.length === 0 && (
                      <div className="text-center py-4 text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-lg border border-dashed">
                        Nenhum slot adicionado. Adicione slots para o aluno
                        preencher.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {questionDeskChecking.checkpoints.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            Nenhum checkpoint adicionado. Clique em "+ Adicionar Checkpoint"
            para começar.
          </div>
        )}
      </div>

      {/* Feedback */}
      <div className="space-y-1.5 pt-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Explicação (Feedback)
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none h-20 text-sm italic"
          placeholder="Explique o fluxo correto de execução e os valores esperados..."
          value={questionDeskChecking.explanation}
          onChange={(e) =>
            setQuestionDeskChecking({
              ...questionDeskChecking,
              explanation: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};
