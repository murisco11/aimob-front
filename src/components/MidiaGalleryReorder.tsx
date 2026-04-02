import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, GripVertical, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Midia {
    id: number;
    url: string;
    ordem?: number;
}

interface MidiaGalleryReorderProps {
    midias: Midia[];
    onReorder: (orderedMidias: Array<{ id: number; ordem: number }>) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    isLoading?: boolean;
}

export function MidiaGalleryReorder({
    midias,
    onReorder,
    onDelete,
    isLoading = false
}: MidiaGalleryReorderProps) {
    const { toast } = useToast();
    const [items, setItems] = useState<Midia[]>(midias);
    const [isReordering, setIsReordering] = useState(false);
    const [draggedId, setDraggedId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, midiaId: number) => {
        e.dataTransfer.setData("text/plain", String(midiaId));
        e.dataTransfer.effectAllowed = "move";
        setDraggedId(midiaId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragLeave = () => {
        setDraggedId(null);
    };

    const handleDrop = async (e: React.DragEvent, targetMidiaId: number) => {
        e.preventDefault();
        setDraggedId(null);

        const draggedMidiaId = Number(e.dataTransfer.getData("text/plain"));

        if (draggedMidiaId === targetMidiaId) return;

        const draggedIndex = items.findIndex(m => m.id === draggedMidiaId);
        const targetIndex = items.findIndex(m => m.id === targetMidiaId);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            const newOrder = [...items];
            [newOrder[draggedIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[draggedIndex]];
            setItems(newOrder);

            try {
                setIsReordering(true);
                const orderedMidias = newOrder.map((midia, index) => ({
                    id: midia.id,
                    ordem: index + 1
                }));

                await onReorder(orderedMidias);

                toast({
                    title: "Sucesso",
                    description: "Ordem das mídias atualizada",
                    variant: "success"
                });
            } catch (error) {
                // Revert on error
                setItems(midias);
                toast({
                    title: "Erro",
                    description: "Erro ao salvar a nova ordem",
                    variant: "destructive"
                });
            } finally {
                setIsReordering(false);
            }
        }
    };

    const handleDelete = async (midiaId: number) => {
        try {
            setIsDeleting(midiaId);
            await onDelete(midiaId);
            setItems(items.filter(m => m.id !== midiaId));
            toast({
                title: "Sucesso",
                description: "Mídia removida com sucesso",
                variant: "success"
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao remover mídia",
                variant: "destructive"
            });
        } finally {
            setIsDeleting(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma mídia para reordenar
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {items.map((midia) => (
                <div
                    key={midia.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, midia.id)}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, midia.id)}
                    className={`group flex items-center gap-3 p-3 rounded-lg border transition-all cursor-move ${
                        draggedId === midia.id
                            ? "border-primary bg-primary/5 opacity-60"
                            : "border-border bg-card hover:border-primary/30"
                    }`}
                >
                    <GripVertical className="w-5 h-5 text-muted-foreground group-hover:text-foreground flex-shrink-0" />

                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                            src={midia.url}
                            alt="Mídia"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">
                            Ordem: {midia.ordem || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            ID: {midia.id}
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 flex-shrink-0"
                        onClick={() => handleDelete(midia.id)}
                        disabled={isDeleting === midia.id}
                    >
                        {isDeleting === midia.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            ))}
        </div>
    );
}
