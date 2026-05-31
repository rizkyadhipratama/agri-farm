"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ open, onOpenChange, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onOpenChange(false);
        }
      }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'visible',  // ← KEY FIX
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header - fixed */}
        <div style={{ padding: '24px 24px 0 24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{title}</h2>
        </div>
        {/* Body - scrollable */}
        <div style={{ padding: '0 24px 24px 24px', flex: 1 }}>          {children}
        </div>
      </div>
    </div>
  );
}

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  children: React.ReactNode;
}

export function FormModal({ open, onOpenChange, title, onSubmit, submitLabel, children }: FormModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {children}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" style={{ backgroundColor: '#16a34a', color: 'white' }}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export { Modal };