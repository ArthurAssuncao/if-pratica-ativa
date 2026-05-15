interface ButtonAddProps {
  onClick: () => void;
  children: string;
}

export const ButtonAdd = ({ onClick, children }: ButtonAddProps) => {
  return (
    <button
      onClick={onClick}
      className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-bold hover:cursor-pointer hover:text-blue-800"
    >
      {children}
    </button>
  );
};
