
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
}

export function ImagePopup({ isOpen, onClose, imageUrl, altText = "Image" }: ImagePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-md p-0 border-0 bg-transparent shadow-none overflow-hidden">
        <div className="relative max-h-[90vh] flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt={altText}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
          <DialogClose className="absolute top-2 right-2 bg-black/80 rounded-full p-1.5 hover:bg-black transition-colors">
            <X className="h-5 w-5 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
