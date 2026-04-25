import type { BaseQuestionProps } from "types/question";
import type { BaseQuestion } from "types/study";

export function createQuestion<
  TProps extends BaseQuestionProps,
  TData extends BaseQuestion,
>(config: {
  validateAnswer: (input: { resposta: string; data: TData }) => boolean;
  Component: React.FC<
    TProps & {
      validateAnswer: (input: { resposta: string; data: TData }) => boolean;
    }
  >;
}) {
  const WrappedComponent: React.FC<TProps> = (props) => {
    return (
      <config.Component {...props} validateAnswer={config.validateAnswer} />
    );
  };

  return WrappedComponent;
}
