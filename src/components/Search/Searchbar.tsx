import { useEffect, useRef, useState, type KeyboardEvent, type FocusEvent } from "react";

type SearchbarProps = {
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
    suggestions?: string[];
    onSelectSuggestion?: (suggestion: string) => void;
    className?: string;
    autoFocus?: boolean;
    onSubmit?: (value: string) => void;
};

export default function Searchbar({
    value,
    onChange,
    placeholder = "Search...",
    debounceMs = 300,
    suggestions = [],
    onSelectSuggestion,
    className,
    autoFocus = false,
    onSubmit,
}: SearchbarProps) {
    const [input, setInput] = useState<string>(value ?? "");
    const [open, setOpen] = useState<boolean>(false);
    const [highlight, setHighlight] = useState<number>(-1);
    const timerRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    // keep controlled value in sync if parent controls it
    useEffect(() => {
        if (typeof value === "string" && value !== input) {
            setInput(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // debounce onSearch while typing
    useEffect(() => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
        }
        if (debounceMs > 0 && onChange) {
            timerRef.current = window.setTimeout(() => {
                onChange(input);
                timerRef.current = null;
            }, debounceMs);
        }
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [input, debounceMs, onChange]);

    const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(input.trim().toLowerCase())
    );

    function change(v: string) {
        setInput(v);
        onChange?.(v);
        setOpen(v.length > 0 && filtered.length > 0);
        setHighlight(-1);
    }

    function submit(v = input) {
        // cancel debounce and call immediately
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        onChange?.(v);
        onSubmit?.(v);
        setOpen(false);
        inputRef.current?.blur();
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (!open || filtered.length === 0) {
            if (e.key === "Enter") {
                submit();
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => Math.min(filtered.length - 1, h + 1));
            setOpen(true);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(-1, h - 1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const sel = highlight >= 0 ? filtered[highlight] : input;
            choose(sel);
        } else if (e.key === "Escape") {
            setOpen(false);
            setHighlight(-1);
        }
    }

    function choose(sel: string) {
        setInput(sel);
        onChange?.(sel);
        onSelectSuggestion?.(sel);
        submit(sel);
        setOpen(false);
        setHighlight(-1);
    }

    useEffect(() => {
        const hasMatches =
            input.trim().length > 0 &&
            suggestions.some((s) =>
                s.toLowerCase().includes(input.trim().toLowerCase())
            );
        if (hasMatches) {
            setOpen(true);
        }
    }, [suggestions, input]);

    // Reset highlight when focus leaves input
    useEffect(() => {
        const handleBlur = (event: FocusEvent) => {
            if (inputRef.current && event.target === inputRef.current) {
                setHighlight(-1);
            }
        };
        const node = inputRef.current;
        if (node) {
            node.addEventListener("blur", handleBlur);
        }
        return () => {
            if (node) {
                node.removeEventListener("blur", handleBlur);
            }
        };
    }, []);

    return (
        <div
            className={`relative w-full max-w-[560px] ${className ?? ""}`}
        >
            {/* Visually hidden label (a11y) */}
            <label
                htmlFor="search-input"
                className="sr-only"
            >
                Search
            </label>

            <div className="relative flex bg-[#161b27] text-gray-300 items-center border-2 border-gray-300 rounded-3xl ml-3 px-2 py-1 z-20">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="mr-2 opacity-70"
                >
                    <path
                        d="M21 21l-4.35-4.35"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle
                        cx="11"
                        cy="11"
                        r="6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <input
                    id="search-input"
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => change(e.target.value)}
                    onFocus={() => {
                        setHighlight(-1);
                        setOpen(input.length > 0 && filtered.length > 0);
                    }}
                    onMouseDown={() => setHighlight(-1)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    autoFocus={autoFocus}
                    aria-autocomplete="list"
                    aria-controls="search-suggestions"
                    aria-expanded={open}
                    className="flex-1 bg-transparent border-0 outline-none text-sm focus:outline-none focus:ring-0"
                />

                {input.length > 0 ? (
                    <button
                        type="button"
                        onClick={() => {
                            setInput("");
                            onChange?.("");
                            setOpen(false);
                            inputRef.current?.focus();
                        }}
                        aria-label="Clear"
                        className="bg-transparent border-0 cursor-pointer p-1 ml-1"
                    >
                        ✕
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => submit()}
                        aria-label="Search"
                        className="bg-transparent border-0 cursor-pointer p-1 ml-1"
                    >
                        ↵
                    </button>
                )}
            </div>

            {open && filtered.length > 0 && (
                <ul
                    id="search-suggestions"
                    role="listbox"
                    ref={listRef}
                    className="absolute left-0 right-0 bg-[#161b27] shadow-lg rounded-b-2xl -mt-5 ml-3 pt-6 list-none p-0 max-h-56 overflow-auto z-10">
                    {filtered.map((s, i) => {
                        const isHighlighted = i === highlight;
                        return (
                            <li
                                key={s + i}
                                role="option"
                                aria-selected={isHighlighted}
                                onMouseDown={(ev) => {
                                    // prevent input blur before click
                                    ev.preventDefault();
                                }}
                                onClick={() => choose(s)}
                                className={`px-3 py-2 text-gray-300 cursor-pointer ${
                                    isHighlighted ? "bg-gray-800" : "bg-[#161b27] hover:bg-gray-800"
                                }`}
                            >
                                {s}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
