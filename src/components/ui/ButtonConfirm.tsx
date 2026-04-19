interface ButtonConfirmProps {
  onClick: () => void;
  label?: string; // Opcional: define o texto (padrão "Confirmar")
  disabled?: boolean; // Opcional: desativa o botão
  className?: string; // Opcional: permite adicionar classes extras
}

export const ButtonConfirm = ({
  onClick,
  label = "Confirmar resposta",
  disabled = false,
  className = "",
}: ButtonConfirmProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-green-600 hover:bg-green-500 hover:cursor-pointer
        disabled:bg-slate-400 disabled:cursor-not-allowed
        p-3 rounded-lg font-bold text-white 
        transition-colors shadow-sm active:scale-95
        min-w-full
        ${className}
      `}
    >
      {label}
    </button>
  );
};
