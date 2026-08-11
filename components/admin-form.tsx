"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LocationMapClient from "./admin/LocationMapClient";
export default function AdminForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/properties", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Unable to save");
      router.push(`/properties/${d.id}`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };
  return (
    <form className="adminForm" onSubmit={submit}>
      <div className="formGrid">
        <label>
          Property Title *
          <input name="title" required placeholder="Enter property title" />
        </label>
        <label>
          Price *
          <input
            name="price"
            required
            type="number"
            min="0"
            step="1"
            placeholder="Enter price in INR"
          />
        </label>
        <label>
          Location *
          <input name="location" required placeholder="Enter location" />
        </label>
        <label>
          Property Type *
          <select name="propertyType" defaultValue="Agricultural Land">
            <option>Agricultural Land</option>
            <option>Farm Land</option>
            <option>Residential Plot</option>
            <option>Commercial Plot</option>
            <option>House</option>
          </select>
        </label>
        <label>
          Area
          <input name="area" placeholder="e.g. 1.5 Acre" />
        </label>
        <label>
          Road Width
          <input name="roadWidth" placeholder="e.g. 20 Feet" />
        </label>
        <label>
          Facing
          <input name="facing" placeholder="e.g. East" />
        </label>
        <label>
          Availability
          <select name="availability">
            <option>Available</option>
            <option>Sold</option>
            <option>Reserved</option>
          </select>
        </label>
      </div>
      <label>
        Description *
        <textarea
          name="description"
          required
          rows={5}
          placeholder="Enter property description"
        />
      </label>
      <div className="formGrid">
        <label>
          Email *
          <input name="email" type="email" required placeholder="Enter email" />
        </label>
        <label>
          Mobile Number *
          <input name="mobile" required placeholder="Enter mobile number" />
        </label>
        <div style={{ marginTop: "12px" }}>

          <div className="formGroup">
            <label>Location *</label>

            <div style={{ marginTop: "12px", width: "100%" }}>
              <LocationMapClient
  latitude={latitude}
  longitude={longitude}
  onLocationChange={(newLatitude, newLongitude) => {
    setLatitude(newLatitude);
    setLongitude(newLongitude);
  }}
/>
            </div>

            {latitude !== null && longitude !== null && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  marginTop: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "#f7f7f7",
                  fontSize: "13px",
                  color: "#555",
                }}
              >
                <span>
                  Latitude: <strong>{latitude.toFixed(6)}</strong>
                </span>

                <span>
                  Longitude: <strong>{longitude.toFixed(6)}</strong>
                </span>
              </div>
            )}

            <input type="hidden" name="location" value={location} />

            <input type="hidden" name="latitude" value={latitude ?? ""} />

            <input type="hidden" name="longitude" value={longitude ?? ""} />
          </div>
        </div>
      </div>
      <div className="uploadGrid">
        <label className="upload">
          Main Property Photo *
          <input name="mainPhoto" type="file" accept="image/*" required />
          <span>
            Click to upload main photo
            <br />
            <small>JPG, PNG up to 10MB</small>
          </span>
        </label>
        <label className="upload">
          Other Property Photos
          <input name="otherPhotos" type="file" accept="image/*" multiple />
          <span>
            Click to upload multiple photos
            <br />
            <small>You can select multiple images</small>
          </span>
        </label>
      </div>
      {msg && <p className="error">{msg}</p>}
      <div className="actions">
        <button
          type="button"
          onClick={() => router.back()}
          className="lightBtn"
        >
          Cancel
        </button>
        <button disabled={busy} className="greenBtn">
          {busy ? "Saving..." : "Save Property"}
        </button>
      </div>
    </form>
  );
}
