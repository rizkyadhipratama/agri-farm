"use client";

import { useState, useRef, useEffect, createContext, useContext } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  children: React.ReactNode;
  defaultValue?: string;
}

export function Select({ value, onValueChange, placeholder, required, children, defaultValue }: SelectProps) {
  return (
    <div style={{ position: 'relative' }}>
      <SelectProvider value={value} onValueChange={onValueChange} placeholder={placeholder} required={required} defaultValue={defaultValue}>
        {children}
      </SelectProvider>
    </div>
  );
}

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType>({ open: false, setOpen: () => {} });

function SelectProvider({ value, onValueChange, placeholder, required, children, defaultValue }: SelectProps & { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value: value ?? defaultValue, onValueChange, placeholder, required, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className, style, ...props }: { children?: React.ReactNode; className?: string; style?: React.CSSProperties; [key: string]: any }) {
  const { setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      style={{
        display: 'flex',
        height: '40px',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        backgroundColor: '#fff',
        padding: '8px 12px',
        fontSize: '14px',
        cursor: 'pointer',
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
      <ChevronDown style={{ width: '16px', height: '16px', opacity: 0.5, flexShrink: 0 }} />
    </button>
  );
}

export function SelectValue({ placeholder, ...props }: { placeholder?: string; [key: string]: any }) {
  const { value, placeholder: ctxPlaceholder } = useContext(SelectContext);
  const displayPlaceholder = placeholder || ctxPlaceholder;
  return (
    <span style={{ color: value ? 'inherit' : '#9ca3af' }} {...props}>
      {value || displayPlaceholder || "Select..."}
    </span>
  );
}

export function SelectContent({ children, className, style, ...props }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; [key: string]: any }) {
  const { open, setOpen } = useContext(SelectContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    setTimeout(() => document.addEventListener("click", handleClick), 0);
    return () => document.removeEventListener("click", handleClick);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        zIndex: 200,
        maxHeight: '384px',
        minWidth: '8rem',
        overflow: 'hidden',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#fff',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        marginTop: '4px',
        width: '100%',
      }}
      className={className}
      {...props}
    >
      <div style={{ padding: '4px' }}>
        {children}
      </div>
    </div>
  );
}

export function SelectItem({ children, value, className, style, ...props }: { children: React.ReactNode; value: string; className?: string; style?: React.CSSProperties; [key: string]: any }) {
  const { value: selectedValue, onValueChange, setOpen } = useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        onValueChange?.(value);
        setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onValueChange?.(value);
          setOpen(false);
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 32px 6px 8px',
        fontSize: '14px',
        borderRadius: '4px',
        cursor: 'default',
        backgroundColor: isSelected ? '#f0fdf4' : 'transparent',
        color: isSelected ? '#16a34a' : 'inherit',
        outline: 'none',
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectGroup({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <div {...props}>{children}</div>;
}
