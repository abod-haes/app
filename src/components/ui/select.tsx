"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "sm",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-xl border bg-slate-50/50 text-sm whitespace-nowrap text-slate-800 shadow-xs transition-all duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 md:text-sm dark:text-white *:data-[slot=select-value]:dark:text-white [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-[size=sm]:px-3 data-[size=sm]:py-2",
        "data-[size=default]:px-3 data-[size=default]:py-3",
        className
      )}
      dir={direction}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        dir={direction}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          "min-w-[var(--radix-select-trigger-width)]",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        sideOffset={6}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1 w-full">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);

  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      dir={direction}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        isRTL ? "pr-2 pl-8" : "pr-8 pl-2",
        className
      )}
      dir={direction}
      {...props}
    >
      <span
        className={cn(
          "absolute flex size-3.5 items-center justify-center",
          isRTL ? "left-2" : "right-2"
        )}
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectWithOptionsProps
  extends Omit<
    React.ComponentProps<typeof SelectPrimitive.Root>,
    "children" | "value" | "onValueChange"
  > {
  options: SelectOption[];
  placeholder?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string;
  defaultToAll?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  value?: string | null;
  onValueChange?: (value: string) => void;
}

function SelectWithOptions({
  options,
  placeholder = "اختر...",
  showAllOption = false,
  allOptionLabel = "الكل",
  allOptionValue = "all",
  defaultToAll = false,
  triggerClassName,
  contentClassName,
  value,
  onValueChange,
  ...props
}: SelectWithOptionsProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);

  const isControlled = value !== undefined;

  const controlledValue = React.useMemo(() => {
    if (value === null || value === undefined || value === "") return undefined;
    return String(value);
  }, [value]);

  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    () => (defaultToAll && showAllOption ? allOptionValue : undefined)
  );

  React.useEffect(() => {
    if (
      !isControlled &&
      internalValue === undefined &&
      defaultToAll &&
      showAllOption
    ) {
      setInternalValue(allOptionValue);
    }
  }, [
    isControlled,
    internalValue,
    defaultToAll,
    showAllOption,
    allOptionValue,
  ]);

  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  return (
    <SelectPrimitive.Root
      {...props}
      dir={direction}
      value={currentValue}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className={cn("w-full", triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className={contentClassName} position="popper">
        {showAllOption && (
          <SelectItem value={allOptionValue}>{allOptionLabel}</SelectItem>
        )}

        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={String(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive.Root>
  );
}

// Multiple select wrapper - dropdown that opens and closes
interface MultipleSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string[];
  onValueChange?: (values: string[]) => void;
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
}

const MultipleSelect = React.forwardRef<HTMLDivElement, MultipleSelectProps>(
  (
    {
      id,
      options,
      placeholder = "اختر...",
      value = [],
      onValueChange,
      className,
      disabled,
      triggerClassName,
      contentClassName,
      ...props
    },
    ref
  ) => {
    const lang = useCurrentLang();
    const direction = getDirection(lang);
    const isRTL = direction === "rtl";

    const selectedLabels = React.useMemo(() => {
      const map = new Map(options.map((o) => [o.value, o.label]));
      return value.map((v) => map.get(v)).filter(Boolean) as string[];
    }, [value, options]);

    const handleToggle = (optionValue: string) => {
      if (disabled) return;
      const exists = value.includes(optionValue);
      const next = exists
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onValueChange?.(next);
    };

    const clearAll = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      onValueChange?.([]);
    };

    return (
      <div
          ref={ref}
        dir={direction}
        data-slot="multiple-select"
        className={cn("relative w-full", className)}
          {...props}
        >
        <PopoverPrimitive.Root>
          <PopoverPrimitive.Trigger asChild>
            <button
              id={id}
              type="button"
              dir={direction}
              disabled={disabled}
              className={cn(
                "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-xl border bg-slate-50/50 px-3 py-2 text-sm text-slate-800 shadow-xs transition-all duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:text-white",
                "cursor-pointer",
                triggerClassName
              )}
            >
              <div className="min-w-0 flex-1">
                {selectedLabels.length === 0 ? (
                  <span className="text-muted-foreground">{placeholder}</span>
                ) : (
                  <div className="flex flex-wrap items-center gap-1">
                    {selectedLabels.map((label) => (
                      <span
                        key={label}
                        className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-md px-2 py-0.5 text-xs"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                {value.length > 0 && !disabled && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className={cn(
                      "rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800",
                      "text-muted-foreground"
                    )}
                    aria-label="Clear"
                  >
                    <XIcon className="size-4" />
                  </button>
                )}
                <ChevronDownIcon className="size-4 opacity-60" />
              </div>
            </button>
          </PopoverPrimitive.Trigger>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              dir={direction}
              sideOffset={6}
              align="start"
              className={cn(
                "z-50 rounded-md border bg-popover text-popover-foreground shadow-md",
                "w-[var(--radix-popover-trigger-width)]",
                "max-h-64 overflow-auto p-1",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                contentClassName
              )}
            >
              {options.map((opt) => {
                const selected = value.includes(opt.value);
                const isDisabled = disabled || opt.disabled;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && handleToggle(opt.value)}
                    className={cn(
                      "w-full rounded-sm px-2 py-2 text-sm",
                      "flex items-center gap-2",
                      "hover:bg-slate-100 dark:hover:bg-slate-800",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      isRTL ? "text-right" : "text-left"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border",
                        selected
                          ? "border-primary bg-primary"
                          : "border-slate-300 dark:border-slate-600"
                      )}
                    >
                      {selected && <CheckIcon className="size-3 text-white" />}
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </div>
    );
  }
);
MultipleSelect.displayName = "MultipleSelect";

// MultiSelectDropdown using Popover
interface MultiSelectDropdownProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  id?: string;
  options: SelectOption[];
  value?: string[];
  onValueChange?: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  maxDisplay?: number;
}

function MultiSelectDropdown({
  id,
  options,
  value = [],
  onValueChange,
  placeholder = "اختر...",
  disabled,
  className,
  triggerClassName,
  contentClassName,
  maxDisplay = 2,
  ...props
}: MultiSelectDropdownProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const selectedLabels = React.useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o.label]));
    return value.map((v) => map.get(v)).filter(Boolean) as string[];
  }, [value, options]);

  const toggle = (v: string) => {
    if (disabled) return;
    const exists = value.includes(v);
    const next = exists ? value.filter((x) => x !== v) : [...value, v];
    onValueChange?.(next);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    onValueChange?.([]);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          <button
            id={id}
            type="button"
            dir={direction}
            disabled={disabled}
            className={cn(
              "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-xl border bg-slate-50/50 px-3 py-2 text-sm text-slate-800 shadow-xs transition-all duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:text-white",
              "cursor-pointer",
              triggerClassName
            )}
          >
            <div className="min-w-0 flex-1">
              {selectedLabels.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <div className="flex flex-wrap items-center gap-1">
                  {selectedLabels.slice(0, maxDisplay).map((label) => (
                    <span
                      key={label}
                      className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-md px-2 py-0.5 text-xs"
                    >
                      {label}
                    </span>
                  ))}
                  {selectedLabels.length > maxDisplay && (
                    <span className="text-xs text-muted-foreground">
                      +{selectedLabels.length - maxDisplay}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {value.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={clearAll}
                  className={cn(
                    "rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800",
                    "text-muted-foreground"
                  )}
                  aria-label="Clear"
                >
                  <XIcon className="size-4" />
                </button>
              )}
              <ChevronDownIcon className="size-4 opacity-60" />
            </div>
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            dir={direction}
            sideOffset={6}
            align="start"
            className={cn(
              "z-50 rounded-md border bg-popover text-popover-foreground shadow-md",
              "w-[var(--radix-popover-trigger-width)]",
              "max-h-64 overflow-auto p-1",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              contentClassName
            )}
          >
            {options.map((opt) => {
              const selected = value.includes(opt.value);
              const isDisabled = disabled || opt.disabled;

              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && toggle(opt.value)}
                  className={cn(
                    "w-full rounded-sm px-2 py-2 text-sm",
                    "flex items-center gap-2",
                    "hover:bg-slate-100 dark:hover:bg-slate-800",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    isRTL ? "text-right" : "text-left"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border",
                      selected
                        ? "border-primary bg-primary"
                        : "border-slate-300 dark:border-slate-600"
                    )}
                  >
                    {selected && <CheckIcon className="size-3 text-white" />}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectWithOptions,
  MultipleSelect,
  MultiSelectDropdown,
};
