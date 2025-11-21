import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Searchbar from "./Searchbar";

type IssueSuggestion = {
  id: string;
  title: string;
};

export default function IssuesSearch() {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<IssueSuggestion[]>([]);

  async function handleSearch(query: string) {
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const { data, error } = await supabase
      .from("issues")
      .select("id, title")
      .ilike("title", `%${q}%`)
      .limit(8);

    if (error || !data) {
      setSuggestions([]);
      return;
    }

    const filtered = data.filter((row): row is IssueSuggestion => Boolean(row.id && row.title));
    const scored = filtered
      .map((row) => {
        const title = row.title.toLowerCase();
        const startsWith = title.startsWith(q.toLowerCase()) ? 3 : 0;
        const exact = title === q.toLowerCase() ? 5 : 0;
        const includes = title.includes(q.toLowerCase()) ? 1 : 0;
        const score = exact + startsWith + includes;
        return { ...row, _score: score };
      })
      .sort((a, b) => b._score - a._score);

    setSuggestions(scored.map(({ _score, ...rest }) => rest));
  }

  function handleSelectSuggestion(title: string) {
    const match = suggestions.find((s) => s.title === title);
    if (match) {
      navigate(`/issues/${match.id}`);
    }
  }

  function handleSubmit(value: string) {
    const q = value.trim();
    if (!q) return;
    navigate(`/search?query=${encodeURIComponent(q)}`);
  }

  const suggestionTitles = useMemo(
    () => suggestions.map((s) => s.title),
    [suggestions]
  );

  return (
    <Searchbar
      placeholder="Search issues..."
      onChange={handleSearch}
      suggestions={suggestionTitles}
      onSelectSuggestion={handleSelectSuggestion}
      debounceMs={0}
      onSubmit={handleSubmit}
    />
  );
}
