// components/ui/CodeEditor.tsx

import CodeEditor, {
  type TextareaCodeEditorProps,
} from "@uiw/react-textarea-code-editor";
import rehypePrism from "rehype-prism-plus";
import { INDENTATION_SIZE } from "../../constants/general";
import { useIsDarkTheme } from "../../hook/useIsDarkTheme";
import { toCapitalize } from "../../util/string";

interface CodeEditorProps extends TextareaCodeEditorProps {
  value: string;
  language: string;
  displayLanguage?: boolean;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CodeEditorCustom = ({
  value,
  language,
  placeholder,
  displayLanguage = false,
  onChange,
}: CodeEditorProps) => {
  const computedPlaceholder =
    placeholder || `Digite o código em ${toCapitalize(language)}`;

  const isDark = useIsDarkTheme();
  return (
    <div className="w-full flex flex-col  rounded-lg">
      {displayLanguage && (
        <span className=" text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-t-lg font-bold ">
          {language}
        </span>
      )}
      <CodeEditor
        value={value.trim()}
        language={language}
        placeholder={computedPlaceholder}
        onChange={onChange}
        padding={16}
        indentWidth={INDENTATION_SIZE}
        data-color-mode={isDark ? "dark" : "light"}
        rehypePlugins={[
          [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
        ]}
        style={{
          background: isDark ? "#022658" : "#fff",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
        className="w-full flex-1  rounded-b-lg leading-loose "
      />
    </div>
  );
};

CodeEditorCustom.displayName = "CodeEditorCustom";
