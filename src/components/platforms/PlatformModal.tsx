
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName: string;
  platformIcon: React.ReactNode;
  inputLabel: string;
  inputPlaceholder: string;
  onSubmit: (value: string) => void;
  guideText: string;
}

const PlatformModal = ({
  isOpen,
  onClose,
  platformName,
  platformIcon,
  inputLabel,
  inputPlaceholder,
  onSubmit,
  guideText
}: PlatformModalProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
    setInputValue('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-primary border border-neon-purple/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {platformIcon}
            <span>Link {platformName} Account</span>
          </DialogTitle>
          <DialogDescription className="text-neutral-300">
            Enter your {platformName} information to link your account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform-input">{inputLabel}</Label>
            <Input
              id="platform-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputPlaceholder}
              className="bg-black/70 border-neutral-700 text-white"
            />
          </div>

          <div className="bg-black/30 p-3 rounded-md border border-neon-purple/10">
            <h4 className="text-sm font-medium mb-2 text-neon-blue">How to find your {platformName} information:</h4>
            <p className="text-xs text-neutral-300">{guideText}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-neutral-700 hover:bg-black/50 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-game"
              disabled={!inputValue.trim()}
            >
              Link Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlatformModal;
