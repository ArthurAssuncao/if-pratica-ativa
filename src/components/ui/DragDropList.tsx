import { GripVertical } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface DragDropListProps<T extends { id?: string | number }> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem?: (item: T, index: number) => React.ReactNode;
  getItemId?: (item: T, index: number) => string | number;
}

const DragDropList = <T extends { id?: string | number }>({
  items,
  onReorder,
  renderItem,
}: DragDropListProps<T>) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [listItems, setListItems] = useState<T[]>(items);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const dragItemRef = useRef<HTMLDivElement | null>(null);
  const touchMoveThreshold = 10; // Prevenir movimentos acidentais

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setListItems(items);
  }, [items]);

  // Eventos de mouse (Desktop)
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
    e.currentTarget.style.opacity = "0.5";

    // Suporte para Firefox
    if (dragItemRef.current) {
      e.dataTransfer.setDragImage(dragItemRef.current, 0, 0);
    }
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number,
  ) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newItems = [...listItems];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    setListItems(newItems);
    onReorder(newItems);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = "";
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Eventos de toque (Mobile)
  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    setTouchStart(index);
    setDraggedIndex(index);
    e.currentTarget.style.opacity = "0.7";

    // Armazena a posição inicial do toque
    const touch = e.touches[0];
    if (touch) {
      (e.currentTarget as HTMLDivElement).dataset.startY =
        touch.clientY.toString();
    }
  };

  const handleTouchMove = (
    e: React.TouchEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();

    if (touchStart === null || draggedIndex === null) return;

    // Verifica se moveu o suficiente para considerar reordenação
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLDivElement;
    const startY = parseFloat(element.dataset.startY || "0");
    const deltaY = Math.abs(touch.clientY - startY);

    if (deltaY > touchMoveThreshold && touchStart !== index) {
      setDragOverIndex(index);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (
      touchStart !== null &&
      dragOverIndex !== null &&
      touchStart !== dragOverIndex
    ) {
      const newItems = [...listItems];
      const [draggedItem] = newItems.splice(touchStart, 1);
      newItems.splice(dragOverIndex, 0, draggedItem);

      setListItems(newItems);
      onReorder(newItems);
    }

    e.currentTarget.style.opacity = "";
    setTouchStart(null);
    setDragOverIndex(null);
    setDraggedIndex(null);

    // Limpa dados armazenados
    delete (e.currentTarget as HTMLDivElement).dataset.startY;
  };

  // Previne comportamento padrão de touchmove no documento
  useEffect(() => {
    const preventTouchMove = (e: TouchEvent) => {
      if (touchStart !== null) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventTouchMove, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventTouchMove);
    };
  }, [touchStart]);

  return (
    <div className="w-full flex">
      <div className="w-full flex flex-col gap-2 md:gap-2.5">
        {listItems.map((item, index) => (
          <div
            key={item.id}
            ref={index === draggedIndex ? dragItemRef : null}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={(e) => handleTouchMove(e, index)}
            onTouchEnd={(e) => handleTouchEnd(e)}
            className={`
              flex items-center gap-2 rounded-lg cursor-move
              transition-all duration-200 select-none touch-manipulation
              bg-white border border-gray-200
              hover:bg-gray-50 hover:border-blue-300 hover:shadow-md
              ${
                dragOverIndex === index
                  ? "border-t-2 border-t-blue-500 bg-blue-50/50 translate-y-0.5"
                  : ""
              }
              ${draggedIndex === index ? "opacity-50" : ""}
            `}
          >
            <div className="text-gray-400 text-lg md:text-xl cursor-grab active:cursor-grabbing select-none touch-manipulation">
              <GripVertical size={16} />
            </div>
            <div className="flex-1  text-sm md:text-base text-gray-800">
              {renderItem ? renderItem(item, index) : "Nenhum item"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DragDropList;
