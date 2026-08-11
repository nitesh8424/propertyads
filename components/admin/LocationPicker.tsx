"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="mapLoading">
      Loading map...
    </div>
  ),
});

type LocationData = {
  location: string;
  latitude: number | null;
  longitude: number | null;
};

type Props = {
  value: LocationData;
  onChange: (data: LocationData) => void;
};

type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function LocationPicker({
  value,
  onChange,
}: Props) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const searchLocation = async () => {
    const query = search.trim();

    if (!query) return;

    setSearching(true);
    setResults([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to search location");
      }

      const data: SearchResult[] = await response.json();

      setResults(data);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectLocation = (result: SearchResult) => {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);

    onChange({
      location: result.display_name,
      latitude,
      longitude,
    });

    setSearch(result.display_name);
    setResults([]);
  };

  const handleMapChange = (
    latitude: number,
    longitude: number
  ) => {
    onChange({
      ...value,
      latitude,
      longitude,
    });
  };

  return (
    <div className="locationPicker">
      <label className="formLabel">
        Location <span>*</span>
      </label>

      <div className="locationSearch">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              searchLocation();
            }
          }}
          placeholder="Search city, village, area or address"
          className="formInput"
        />

        <button
          type="button"
          onClick={searchLocation}
          disabled={searching}
          className="searchLocationBtn"
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="locationResults">
          {results.map((result, index) => (
            <button
              type="button"
              key={`${result.lat}-${result.lon}-${index}`}
              className="locationResult"
              onClick={() => selectLocation(result)}
            >
              <span className="locationPin">📍</span>

              <span>
                {result.display_name}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mapWrapper">
        <Map
          latitude={value.latitude}
          longitude={value.longitude}
          onLocationChange={handleMapChange}
        />
      </div>

      {value.latitude !== null &&
        value.longitude !== null && (
          <div className="selectedCoordinates">
            <span>
              Latitude: <strong>{value.latitude.toFixed(6)}</strong>
            </span>

            <span>
              Longitude:{" "}
              <strong>{value.longitude.toFixed(6)}</strong>
            </span>
          </div>
        )}

      <input
        type="hidden"
        name="location"
        value={value.location}
      />

      <input
        type="hidden"
        name="latitude"
        value={value.latitude ?? ""}
      />

      <input
        type="hidden"
        name="longitude"
        value={value.longitude ?? ""}
      />
    </div>
  );
}