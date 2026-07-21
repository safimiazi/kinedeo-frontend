'use client';

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

interface BaseProps {
  /** Options to display in the dropdown */
  options: SelectOption[];
  /** Placeholder text when nothing is selected */
  placeholder?: string;
  /** Label above the select */
  label?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is loading (shows spinner) */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Custom class for the container */
  className?: string;
}

interface SingleSelectProps extends BaseProps {
  /** Single select mode */
  multiple?: false;
  /** Currently selected value */
  value: string | null;
  /** Callback when selection changes */
  onChange: (value: string | null) => void;
}

interface MultiSelectProps extends BaseProps {
  /** Multi select mode */
  multiple: true;
  /** Currently selected values */
  value: string[];
  /** Callback when selection changes */
  onChange: (value: string[]) => void;
}

type SearchableSelectProps = SingleSelectProps | MultiSelectProps;

// ─── Component ──────────────────────────────────────────────────────────────────

export function SearchableSelect(props: SearchableSelectProps) {
  const {
    options,
    placeholder = 'Select...',
    label,
    disabled = false,
    loading = false,
    error,
    className = '',
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const isMultiple = props.multiple === true;

  // Filter options based on search
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    opt.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  // Reset highlight when search changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHighlightedIndex(0);
  }, [search]);

  const handleSelect = useCallback((optionValue: string) => {
    if (isMultiple) {
      const currentValues = (props as MultiSelectProps).value;
      const onChange = (props as MultiSelectProps).onChange;
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter((v) => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    } else {
      (props as SingleSelectProps).onChange(optionValue);
      setIsOpen(false);
      setSearch('');
    }
  }, [props, isMultiple]);

  const handleRemove = useCallback((optionValue: string) => {
    if (isMultiple) {
      const currentValues = (props as MultiSelectProps).value;
      const onChange = (props as MultiSelectProps).onChange;
      onChange(currentValues.filter((v) => v !== optionValue));
    }
  }, [props, isMultiple]);

  const handleClear = useCallback(() => {
    if (isMultiple) {
      (props as MultiSelectProps).onChange([]);
    } else {
      (props as SingleSelectProps).onChange(null);
    }
    setSearch('');
  }, [props, isMultiple]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch('');
        break;
      case 'Backspace':
        if (!search && isMultiple) {
          const currentValues = (props as MultiSelectProps).value;
          if (currentValues.length > 0) {
            handleRemove(currentValues[currentValues.length - 1]);
          }
        }
        break;
    }
  };

  // Get display for selected values
  const getSelectedLabels = (): SelectOption[] => {
    if (isMultiple) {
      return (props as MultiSelectProps).value
        .map((v) => options.find((o) => o.value === v))
        .filter(Boolean) as SelectOption[];
    }
    return [];
  };

  const getSingleLabel = (): string => {
    if (!isMultiple) {
      const val = (props as SingleSelectProps).value;
      if (!val) return '';
      return options.find((o) => o.value === val)?.label || '';
    }
    return '';
  };

  const isSelected = (optionValue: string): boolean => {
    if (isMultiple) {
      return (props as MultiSelectProps).value.includes(optionValue);
    }
    return (props as SingleSelectProps).value === optionValue;
  };

  const hasValue = isMultiple
    ? (props as MultiSelectProps).value.length > 0
    : !!(props as SingleSelectProps).value;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">
          {label}
        </label>
      )}

      {/* Input area */}
      <div
        className={`
          flex items-center flex-wrap gap-1.5 min-h-[42px] px-3 py-2 rounded-xl border transition-all cursor-text
          ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white'}
          ${error ? 'border-red-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100' : 'border-pink-200 focus-within:border-[#e91e8c] focus-within:ring-2 focus-within:ring-[#e91e8c]/10'}
          ${isOpen ? (error ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e91e8c] ring-2 ring-[#e91e8c]/10') : ''}
        `}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        {/* Multi-select chips */}
        {isMultiple && getSelectedLabels().map((opt) => (
          <span
            key={opt.value}
            className="inline-flex items-center gap-1 bg-pink-50 text-[#ad1457] text-xs font-medium px-2 py-1 rounded-lg"
          >
            {opt.icon && <span className="text-xs">{opt.icon}</span>}
            {opt.label}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove(opt.value); }}
              className="text-[#ad1457]/60 hover:text-[#ad1457] ml-0.5"
              aria-label={`Remove ${opt.label}`}
            >
              ×
            </button>
          </span>
        ))}

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={hasValue && !isMultiple ? getSingleLabel() : placeholder}
          disabled={disabled}
          className={`
            flex-1 min-w-[80px] bg-transparent border-none outline-none text-sm
            ${hasValue && !isMultiple && !search ? 'text-[#2d1a24]' : 'text-[#2d1a24]'}
            placeholder:text-[#ad1457]/40 disabled:cursor-not-allowed
          `}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />

        {/* Right side icons */}
        <div className="flex items-center gap-1 ml-1">
          {loading && (
            <span className="animate-spin text-[#ad1457]/50 text-sm">⟳</span>
          )}
          {hasValue && !disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              className="text-[#ad1457]/40 hover:text-[#ad1457] text-sm p-0.5"
              aria-label="Clear selection"
            >
              ×
            </button>
          )}
          <span className={`text-[#ad1457]/40 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-pink-100 rounded-xl shadow-lg shadow-pink-100/30 max-h-60 overflow-auto py-1"
          role="listbox"
          aria-multiselectable={isMultiple}
        >
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[#6d1b3b]/50 text-center">
              {search ? 'No results found' : 'No options available'}
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors
                  ${highlightedIndex === index ? 'bg-pink-50' : ''}
                  ${isSelected(option.value) ? 'text-[#e91e8c] font-medium' : 'text-[#2d1a24]'}
                `}
                role="option"
                aria-selected={isSelected(option.value)}
              >
                {/* Checkbox for multi-select */}
                {isMultiple && (
                  <span className={`
                    w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0
                    ${isSelected(option.value) ? 'bg-[#e91e8c] border-[#e91e8c] text-white' : 'border-pink-200'}
                  `}>
                    {isSelected(option.value) && '✓'}
                  </span>
                )}

                {/* Icon */}
                {option.icon && <span className="text-base flex-shrink-0">{option.icon}</span>}

                {/* Label + description */}
                <div className="flex-1 min-w-0">
                  <div className="truncate">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-[#6d1b3b]/40 truncate">{option.description}</div>
                  )}
                </div>

                {/* Selected indicator for single select */}
                {!isMultiple && isSelected(option.value) && (
                  <span className="text-[#e91e8c] text-xs flex-shrink-0">✓</span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
