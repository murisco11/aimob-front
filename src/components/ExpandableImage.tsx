import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ExpandableImageProps {
    src: string;
    alt?: string;
    className?: string;
}

export function ExpandableImage({ src, alt = "Imagem", className }: ExpandableImageProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <img
                    src={src}
                    alt={alt}
                    className={`cursor-pointer hover:opacity-90 transition-opacity ${className}`}
                />
            </DialogTrigger>

            <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none flex justify-center">
                <VisuallyHidden>
                    <DialogTitle>Visualização de Imagem</DialogTitle>
                </VisuallyHidden>

                <img
                    src={src}
                    alt={alt}
                    className="w-auto h-auto max-h-[85vh] rounded-md object-contain"
                />
            </DialogContent>
        </Dialog>
    );
}