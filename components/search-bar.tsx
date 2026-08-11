"use client";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export default function SearchBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [name, setName] = useState(sp.get("name") ?? "");
  const [location, setLocation] = useState(sp.get("location") ?? "");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (name) qs.set("name", name);
    if (location) qs.set("location", location);
    router.push((qs.toString() ? `/?${qs.toString()}` : "/") + "#properties");
  };
  return (
    <form className="search" onSubmit={submit}>
      <label>
        Search by name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter property name"
        />
      </label>
      <label>
        Search by location
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
      </label>
      <button>Search</button>
    </form>
  );
}
