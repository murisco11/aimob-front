import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConfirmStore } from "@/stores/confirmStore";

export function GlobalConfirmDialog() {
  const { 
    isOpen, 
    title, 
    description, 
    confirmText, 
    cancelText, 
    onConfirm, 
    closeConfirm 
  } = useConfirmStore();

  const handleConfirm = async () => {
    await onConfirm(); 
    closeConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={closeConfirm}>
      <AlertDialogContent className="dark bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-secondary text-foreground hover:bg-secondary/80 border-border">
            {cancelText || "Cancelar"}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmText || "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}