"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (
    latitude: number,
    longitude: number,
    location?: string,
  ) => void;
};

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapCenter({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.flyTo([latitude, longitude], 15, {
        duration: 1,
      });
    }
  }, [latitude, longitude, map]);

  return null;
}

function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(event) {
      onLocationChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function DraggableMarker({
  latitude,
  longitude,
  onLocationChange,
}: {
  latitude: number;
  longitude: number;
  onLocationChange: (latitude: number, longitude: number) => void;
}) {
  return (
    <Marker
      position={[latitude, longitude]}
      icon={markerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (event) => {
          const marker = event.target;

          const position = marker.getLatLng();

          onLocationChange(position.lat, position.lng);
        },
      }}
    />
  );
}

export default function LocationMap({
  latitude,
  longitude,
  onLocationChange,
}: Props) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const [searching, setSearching] = useState(false);

  const searchLocation = async () => {
    const query = search.trim();

    if (!query) {
      return;
    }

    setSearching(true);
    setResults([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
          query,
        )}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Location search failed");
      }

      const data: SearchResult[] = await response.json();

      setResults(data);
    } catch (error) {
      console.error("Location search error:", error);

      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectLocation = (result: SearchResult) => {
    const newLatitude = Number(result.lat);

    const newLongitude = Number(result.lon);

    onLocationChange(newLatitude, newLongitude, result.display_name);

    setSearch(result.display_name);
    setResults([]);
  };

  const handleMapLocationChange = (
    newLatitude: number,
    newLongitude: number,
  ) => {
    onLocationChange(newLatitude, newLongitude);
  };

  return (
    <div className="locationMapContainer">
      {/* SEARCH */}

      <div
        className="locationSearch"
        style={{
          position: "relative",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
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
            style={{
              flex: 1,
              minWidth: 0,
            }}
          />

          <button type="button" onClick={searchLocation} disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* SEARCH RESULTS */}

        {results.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1000,
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginTop: "4px",
              overflow: "hidden",
              boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
            }}
          >
            {results.map((result) => (
              <button
                type="button"
                key={result.place_id}
                onClick={() => selectLocation(result)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderBottom: "1px solid #eee",
                  background: "#fff",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                📍 {result.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MAP */}

      <MapContainer
        center={[latitude ?? 20.5937, longitude ?? 78.9629]}
        zoom={latitude !== null && longitude !== null ? 15 : 5}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "360px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenter latitude={latitude} longitude={longitude} />

        <MapClickHandler onLocationChange={handleMapLocationChange} />

        {latitude !== null && longitude !== null && (
          <DraggableMarker
            latitude={latitude}
            longitude={longitude}
            onLocationChange={handleMapLocationChange}
          />
        )}
      </MapContainer>
    </div>
  );
}
