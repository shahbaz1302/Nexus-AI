"use client";

import { useDialKit } from "dialkit";
import {
  FileText,
  ImagePlus,
  RotateCcw,
  X,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import React, {
  type ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const INPUT_TYPE_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "password", label: "Password" },
];

const inputWrapperClassName = cn(
  "relative w-full max-w-[420px] rounded-2xl border border-white/30 bg-white/20 p-4 text-foreground shadow-lg shadow-slate-900/10 backdrop-blur-xl",
  "has-[:focus-visible]:outline-muted3 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
);

const inputClassName =
  "w-full bg-transparent outline-none placeholder:text-foreground/40";

type SmoothInputType = "text" | "password";

type SmoothInputProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  caretClassName?: string;
  containerClassName?: string;
  wrapperClassName?: string;
  type?: SmoothInputType;
};

type SmoothTextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  caretClassName?: string;
  containerClassName?: string;
  wrapperClassName?: string;
};

type SmoothImageUploadProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "value" | "defaultValue"
> & {
  containerClassName?: string;
  imageClassName?: string;
  wrapperClassName?: string;
};

type SmoothFileUploadProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "value" | "defaultValue"
> & {
  containerClassName?: string;
  wrapperClassName?: string;
};

const PASSWORD_CHAR = navigator.userAgent.match(/firefox|fxios/i)
  ? "\u25CF"
  : "\u2022";

const SmoothInput = ({
  caretClassName,
  className,
  containerClassName,
  wrapperClassName,
  value,
  defaultValue,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  style,
  ...props
}: SmoothInputProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const caretX = useMotionValue(0);
  const caretOpacity = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const isControlled = value !== undefined;

  const params = useDialKit(
    "Smooth Input",
    {
      inputType: {
        type: "select",
        options: INPUT_TYPE_OPTIONS,
        default: type,
      },
      placeholder: {
        type: "text",
        default: placeholder ?? "smooth input",
        placeholder: "Empty state text…",
      },
      fontSize: [24, 12, 48, 2],
      spring: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      },
      clear: { type: "action", label: "Clear value" },
    },
    {
      onAction: (path) => {
        if (path !== "clear") return;

        if (!isControlled) {
          setInternalValue("");
        }

        onChange?.({
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
        caretOpacity.set(0);
      },
    },
  );

  const springCaretX = useSpring(
    caretX,
    prefersReducedMotion
      ? { stiffness: 10000, damping: 100, mass: 0.1 }
      : params.spring,
  );

  const inputValue = isControlled ? String(value) : internalValue;
  const activeType = params.inputType as SmoothInputType;
  const displayPlaceholder = placeholder ?? params.placeholder ?? "smooth input";

  const syncMeasureSpan = () => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return;

    const styles = window.getComputedStyle(input);
    const isPassword = input.type === "password";

    let fontSize = styles.fontSize;
    if (
      PASSWORD_CHAR === "\u2022" &&
      isPassword &&
      !navigator.userAgent.match(/chrome|chromium|crios/i)
    ) {
      fontSize = `${parseFloat(fontSize) + 6.25}px`;
    }

    measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${fontSize} ${styles.fontFamily}`;
    measureSpan.style.letterSpacing = styles.letterSpacing;
    measureSpan.style.fontFeatureSettings = styles.fontFeatureSettings;
    measureSpan.style.fontVariationSettings = styles.fontVariationSettings;
  };

  const measurePrefixWidth = (text: string) => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return null;

    syncMeasureSpan();
    measureSpan.textContent = text;

    const paddingLeft =
      parseFloat(window.getComputedStyle(input).paddingLeft) || 0;

    return text.length > 0
      ? measureSpan.offsetWidth + paddingLeft
      : paddingLeft - 1;
  };

  const scrollCaretIntoView = (
    target: HTMLInputElement,
    absoluteWidth: number,
  ) => {
    const styles = window.getComputedStyle(target);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth);
    const visibleRight = target.scrollLeft + target.clientWidth - paddingRight;
    const visibleLeft = target.scrollLeft + paddingLeft;

    if (absoluteWidth > visibleRight) {
      target.scrollLeft = Math.min(
        absoluteWidth - target.clientWidth + paddingRight,
        maxScroll,
      );
      return;
    }

    if (absoluteWidth < visibleLeft) {
      target.scrollLeft = Math.max(0, absoluteWidth - paddingLeft);
    }
  };

  const getCaretIndex = (target: HTMLInputElement) => {
    const selectionStart = target.selectionStart ?? 0;
    const selectionEnd = target.selectionEnd ?? 0;

    if (selectionStart === selectionEnd) {
      return selectionStart;
    }

    return target.selectionDirection === "backward"
      ? selectionStart
      : selectionEnd;
  };

  const updateCaretFromInput = (target: HTMLInputElement) => {
    const selectionStart = target.selectionStart ?? 0;
    const selectionEnd = target.selectionEnd ?? 0;
    const hasSelection = selectionStart !== selectionEnd;
    const caretIndex = getCaretIndex(target);
    const isPassword = target.type === "password";
    const textBeforeCaret = isPassword
      ? PASSWORD_CHAR.repeat(caretIndex)
      : target.value.slice(0, caretIndex);

    const absoluteWidth = measurePrefixWidth(textBeforeCaret);
    if (absoluteWidth === null) return;

    scrollCaretIntoView(target, absoluteWidth);

    const styles = window.getComputedStyle(target);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const caretPosition = absoluteWidth - target.scrollLeft;
    const minX = paddingLeft - 1;
    const maxX = target.clientWidth - paddingRight;
    const isCaretVisible =
      caretPosition >= minX && caretPosition <= maxX + 1;

    caretX.set(Math.min(caretPosition, maxX));

    if (!isCaretVisible || hasSelection) {
      caretOpacity.set(0);
      return;
    }

    caretOpacity.set(1);
  };

  const updateCaretRef = useRef(updateCaretFromInput);
  updateCaretRef.current = updateCaretFromInput;
  const caretOpacityRef = useRef(caretOpacity);
  caretOpacityRef.current = caretOpacity;

  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      updateCaretRef.current(input);
    }
  }, [inputValue]);

  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      updateCaretRef.current(input);
    }
  }, [activeType, params.fontSize]);

  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current;
    if (!input || !container) return;

    const updateCaretIfFocused = () => {
      if (document.activeElement === input) {
        updateCaretRef.current(input);
      }
    };

    const handleSelectionChange = () => {
      if (document.activeElement !== input) return;

      requestAnimationFrame(() => {
        if (document.activeElement === input) {
          updateCaretRef.current(input);
        }
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.fonts.addEventListener("loadingdone", updateCaretIfFocused);
    void document.fonts.ready.then(updateCaretIfFocused);
    input.addEventListener("scroll", updateCaretIfFocused);

    const resizeObserver = new ResizeObserver(updateCaretIfFocused);
    resizeObserver.observe(container);

    updateCaretIfFocused();

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.fonts.removeEventListener("loadingdone", updateCaretIfFocused);
      input.removeEventListener("scroll", updateCaretIfFocused);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={cn(inputWrapperClassName, wrapperClassName)}>
      <div
        ref={containerRef}
        className={cn("relative grid grid-cols-1 p-0", containerClassName)}
        style={{ caretColor: "transparent", fontSize: params.fontSize }}
      >
        <input
          {...props}
          ref={inputRef}
          type={activeType}
          placeholder={displayPlaceholder}
          className={cn(
            inputClassName,
            "col-start-1 col-end-2 row-start-1 row-end-2 text-inherit",
            className,
          )}
          style={style}
          value={inputValue}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
            requestAnimationFrame(() => {
              updateCaretRef.current(e.target);
            });
          }}
          onBlur={(e) => {
            caretOpacityRef.current.set(0);
            onBlur?.(e);
          }}
        />
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre"
        />
        <motion.div
          className={cn(
            "bg-primary pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 h-[0.9em] w-0.5 self-center",
            caretClassName,
          )}
          style={{ x: springCaretX, opacity: caretOpacity }}
        />
      </div>
    </div>
  );
};

const SmoothTextarea = ({
  caretClassName,
  className,
  containerClassName,
  wrapperClassName,
  value,
  defaultValue,
  onChange,
  onBlur,
  placeholder,
  style,
  ...props
}: SmoothTextareaProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const caretX = useMotionValue(0);
  const caretY = useMotionValue(0);
  const caretOpacity = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isControlled = value !== undefined;

  const params = useDialKit(
    "Smooth Textarea",
    {
      placeholder: {
        type: "text",
        default: placeholder ?? "smooth textarea",
        placeholder: "Empty state text…",
      },
      fontSize: [18, 12, 36, 2],
      spring: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      },
      clear: { type: "action", label: "Clear value" },
    },
    {
      onAction: (path) => {
        if (path !== "clear") return;

        if (!isControlled) setInternalValue("");
        onChange?.({
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
        caretOpacity.set(0);
      },
    },
  );

  const springCaretX = useSpring(
    caretX,
    prefersReducedMotion
      ? { stiffness: 10000, damping: 100, mass: 0.1 }
      : params.spring,
  );
  const springCaretY = useSpring(
    caretY,
    prefersReducedMotion
      ? { stiffness: 10000, damping: 100, mass: 0.1 }
      : params.spring,
  );

  const textareaValue = isControlled ? String(value) : internalValue;
  const displayPlaceholder = placeholder ?? params.placeholder ?? "smooth textarea";

  const updateCaret = () => {
    const textarea = textareaRef.current;
    const mirror = mirrorRef.current;
    if (!textarea || !mirror) return;

    const styles = window.getComputedStyle(textarea);
    const properties = [
      "fontFamily",
      "fontSize",
      "fontStyle",
      "fontWeight",
      "letterSpacing",
      "lineHeight",
      "padding",
      "textIndent",
      "textTransform",
      "wordSpacing",
      "whiteSpace",
      "wordWrap",
    ] as const;

    mirror.style.width = `${textarea.clientWidth}px`;
    mirror.style.fontSize = `${params.fontSize}px`;
    properties.forEach((property) => {
      mirror.style[property] = styles[property];
    });
    mirror.textContent = textarea.value.slice(0, textarea.selectionStart ?? 0);

    const marker = document.createElement("span");
    marker.textContent = "\u200b";
    mirror.appendChild(marker);

    caretX.set(marker.offsetLeft - textarea.scrollLeft);
    caretY.set(marker.offsetTop - textarea.scrollTop);
    caretOpacity.set(
      document.activeElement === textarea &&
        (textarea.selectionStart ?? 0) === (textarea.selectionEnd ?? 0)
        ? 1
        : 0,
    );
  };

  const updateCaretRef = useRef(updateCaret);
  updateCaretRef.current = updateCaret;

  useEffect(() => {
    if (document.activeElement === textareaRef.current) {
      updateCaretRef.current();
    }
  }, [textareaValue, params.fontSize]);

  useEffect(() => {
    const textarea = textareaRef.current;
    const container = containerRef.current;
    if (!textarea || !container) return;

    const updateCaretIfFocused = () => {
      if (document.activeElement === textarea) updateCaretRef.current();
    };
    const handleSelectionChange = () => {
      if (document.activeElement !== textarea) return;
      requestAnimationFrame(updateCaretIfFocused);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    textarea.addEventListener("scroll", updateCaretIfFocused);
    const resizeObserver = new ResizeObserver(updateCaretIfFocused);
    resizeObserver.observe(container);
    updateCaretIfFocused();

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      textarea.removeEventListener("scroll", updateCaretIfFocused);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={cn(inputWrapperClassName, wrapperClassName)}>
      <div
        ref={containerRef}
        className={cn("relative grid grid-cols-1 p-0", containerClassName)}
        style={{ fontSize: params.fontSize }}
      >
        <textarea
          {...props}
          ref={textareaRef}
          placeholder={displayPlaceholder}
          className={cn(
            inputClassName,
            "col-start-1 col-end-2 row-start-1 row-end-2 resize-none text-inherit",
            className,
          )}
          style={{ ...style, caretColor: "transparent" }}
          value={textareaValue}
          onChange={(event) => {
            if (!isControlled) setInternalValue(event.target.value);
            onChange?.(event);
            requestAnimationFrame(() => updateCaretRef.current());
          }}
          onBlur={(event) => {
            caretOpacity.set(0);
            onBlur?.(event);
          }}
        />
        <div
          ref={mirrorRef}
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre-wrap wrap-break-word"
        />
        <motion.div
          className={cn(
            "bg-primary pointer-events-none absolute top-0 left-0 h-[1.2em] w-0.5",
            caretClassName,
          )}
          style={{ x: springCaretX, y: springCaretY, opacity: caretOpacity }}
        />
      </div>
    </div>
  );
};

const SmoothImageUpload = ({
  className,
  containerClassName,
  imageClassName,
  onChange,
  wrapperClassName,
  ...props
}: SmoothImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null);
    onChange?.(event);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn(inputWrapperClassName, wrapperClassName)}>
      <input
        {...props}
        ref={inputRef}
        type="file"
        accept={props.accept ?? "image/*"}
        onChange={handleChange}
        className="sr-only"
      />
      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "flex min-h-36 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/50 bg-white/10 px-4 py-6 text-center text-slate-700 transition-colors hover:bg-white/25",
          containerClassName,
          className,
        )}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={selectedFile?.name ?? "Selected image"}
            className={cn("max-h-48 w-full rounded-lg object-contain", imageClassName)}
          />
        ) : (
          <>
            <ImagePlus className="h-8 w-8 text-slate-500" />
            <span className="text-sm font-medium">Choose an image</span>
            <span className="text-xs text-slate-500">
              Drop a visual here or browse your files
            </span>
          </>
        )}
      </motion.button>
      {selectedFile && (
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-600">
          <span className="min-w-0 truncate">{selectedFile.name}</span>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg p-2 transition-colors hover:bg-white/30"
              aria-label="Replace image"
              title="Replace image">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={clearFile}
              className="rounded-lg p-2 transition-colors hover:bg-white/30"
              aria-label="Remove image"
              title="Remove image">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SmoothFileUpload = ({
  className,
  containerClassName,
  onChange,
  wrapperClassName,
  ...props
}: SmoothFileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null);
    onChange?.(event);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn(inputWrapperClassName, wrapperClassName)}>
      <input
        {...props}
        ref={inputRef}
        type="file"
        accept={props.accept ?? ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
        onChange={handleChange}
        className="sr-only"
      />
      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "flex min-h-32 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/50 bg-white/10 px-4 py-6 text-center text-slate-700 transition-colors hover:bg-white/25",
          containerClassName,
          className,
        )}
      >
        <FileText className="h-8 w-8 text-slate-500" />
        <span className="max-w-full truncate text-sm font-medium">
          {selectedFile?.name ?? "Choose a document"}
        </span>
        <span className="text-xs text-slate-500">
          PDF files only
        </span>
      </motion.button>
      {selectedFile && (
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-600">
          <span className="min-w-0 truncate">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg p-2 transition-colors hover:bg-white/30"
              aria-label="Replace document"
              title="Replace document">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={clearFile}
              className="rounded-lg p-2 transition-colors hover:bg-white/30"
              aria-label="Remove document"
              title="Remove document">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { SmoothFileUpload, SmoothImageUpload, SmoothInput, SmoothTextarea };