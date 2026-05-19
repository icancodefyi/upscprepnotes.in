"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  initialSearch: string;
}

export function SearchBar({ initialSearch }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialSearch);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) {
      params.set("search", value.trim());
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleClear() {
    setValue("");
    router.push(pathname);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        placeholder="Search by name, slug, optional..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-64"
      />
      <Button type="submit" variant="secondary" size="sm">
        Search
      </Button>
      {initialSearch && (
        <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      )}
    </form>
  );
}
