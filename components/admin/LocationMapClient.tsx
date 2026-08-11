"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
});

export default function LocationMapClient(props: {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (latitude: number, longitude: number) => void;
}) {
  return (
    <LocationMap
      latitude={props.latitude}
      longitude={props.longitude}
      onLocationChange={props.onLocationChange}
    />
  );
}
