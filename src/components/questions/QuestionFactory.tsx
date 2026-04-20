import { BaseQuestionProps } from "types/question";
import { BaseQuestion } from "types/quiz";

export function createQuestion<
  TProps extends BaseQuestionProps,
  TData extends BaseQuestion,
>(config: {
  validarResposta: (input: { resposta: string; data: TData }) => boolean;
  Component: React.FC<
    TProps & {
      validarResposta: (input: { resposta: string; data: TData }) => boolean;
    }
  >;
}) {
  const WrappedComponent: React.FC<TProps> = (props) => {
    return (
      <config.Component {...props} validarResposta={config.validarResposta} />
    );
  };

  return WrappedComponent;
}
