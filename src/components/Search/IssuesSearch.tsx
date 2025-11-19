import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Searchbar from "./Searchbar";

export default function IssuesSearch() {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function handleSearch(query: string) {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const { data, error } = await supabase
      .from("issues")
      .select("title")
      .ilike("title", `%${query}%`);

    console.log("DB error:", error);
    console.log("DB data:", data);

    if (error || !data) {
      setSuggestions([]);
      return;
    }

    setSuggestions(data.map((row) => row.title));
    console.log("Suggestions:", data.map((row) => row.title));
  }

  function handleSelectSuggestion(title: string) {
    console.log("Picked suggestion:", title);
    // later: navigate to issue page, etc.
  }

  return (
    <Searchbar
      placeholder="Search issues..."
      onChange={handleSearch}
      suggestions={suggestions}
      onSelectSuggestion={handleSelectSuggestion}
      debounceMs={0}
    />
  );
}