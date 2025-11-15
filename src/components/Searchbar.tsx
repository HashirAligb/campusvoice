import { useEffect, useRef, useState, type KeyboardEvent } from "react";

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
};

export default function Searchbar({
    value,
    onChange,
    onSearch,
    placeholder = "Search...",
    debounceMs = 300,
    suggestions = [],
    onSelectSuggestion,
    className,
    autoFocus = false,
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
        if (debounceMs > 0 && onSearch) {
            timerRef.current = window.setTimeout(() => {
                onSearch(input);
                timerRef.current = null;
            }, debounceMs);
        }
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [input, debounceMs, onSearch]);

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
        onSearch?.(v);
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

            <div className="flex items-center rounded-3xl px-2 py-1.5 bg-gray-500">
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
                    onFocus={() => setOpen(input.length > 0 && filtered.length > 0)}
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
                    className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-100 shadow-lg rounded-lg list-none p-0 max-h-56 overflow-auto z-50"
                >
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
                                onMouseEnter={() => setHighlight(i)}
                                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                                    isHighlighted ? "bg-blue-50" : ""
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