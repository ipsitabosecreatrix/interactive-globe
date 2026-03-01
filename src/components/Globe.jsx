import Globe from "react-globe.gl";
import { useRef, useEffect, useState } from "react";
import countriesGeo from "geojson-world-map";

const BU_IMAGES = {
  lifescience: "/images/lifescience.png",
  dairy: "/images/dairy.png",
  brewery: "/images/brewery.png",
  sugar: "/images/sugar.png",
  farming: "/images/farming.png"
};


const BU_COLORS = {
  lifescience: "#c3c3c3",
  dairy: "#2ab9ce",
  brewery: "#a349a4",
  sugar: "#3f48cc",
  farming: "#b97a57"
};

const dairy = [
  { name: "Qatar North", lat: 25.89, lng: 51.20, bu: "dairy", buName: "Dairy " },
  { name: "Siberia", lat: 65.15, lng: 71.73, bu: "dairy", buName: "Dairy " },
  { name: "Pittsburgh", lat: 40.23, lng: -79.71, bu: "dairy", buName: "Dairy " },
  { name: "Perth", lat: -32.31, lng: 116.06, bu: "dairy", buName: "Dairy " },
  { name: "North Algeria", lat: 35.62, lng: 4.56, bu: "dairy", buName: "Dairy " }
];

const sugar = [
  { name: "Aghajari", lat: 31.19, lng: 49.52, bu: "sugar", buName: "Sugar " },
  { name: "Greater Burgan", lat: 29.44, lng: 47.66, bu: "sugar", buName: "Sugar " },
  { name: "Bolivar Coastal", lat: 9.88, lng: -64.30, bu: "sugar", buName: "Sugar " },
  { name: "Daqing", lat: 46.43, lng: 125.04, bu: "sugar", buName: "Sugar " },
  { name: "Permian Basin", lat: 33.43, lng: -103.37, bu: "sugar", buName: "Sugar " },
  { name: "UK central", lat: 53.20, lng: -0.63, bu: "sugar", buName: "Sugar " }
];

const farming = [
  { name: "Qatar South", lat: 24.90, lng: 51.30, bu: "farming", buName: "Farming " },
  { name: "Barrow Island", lat: -20.80, lng: 115.40, bu: "farming", buName: "Farming " },
  { name: "Nigeria South", lat: 6.00, lng: 4.89, bu: "farming", buName: "Farming " },
  { name: "Sabine Pass", lat: 30.01, lng: -93.80, bu: "farming", buName: "Farming " },
  { name: "Siberia", lat: 65.94, lng: 71.21, bu: "farming", buName: "Farming " }
];

const brewery = [
  { name: "Qatar South", lat: 24.90, lng: 51.30, bu: "brewery", buName: "Brewery " },
  { name: "Barrow Island", lat: -20.80, lng: 115.40, bu: "brewery", buName: "Brewery " },
  { name: "Nigeria South", lat: 6.00, lng: 4.89, bu: "brewery", buName: "Brewery " },
  { name: "Sabine Pass", lat: 30.01, lng: -93.80, bu: "brewery", buName: "Brewery " },
  { name: "Siberia", lat: 65.94, lng: 71.21, bu: "brewery", buName: "Brewery " },
  { name: "Gujurat", lat: 22.41, lng: 70.05, bu: "brewery", buName: "Brewery " },
  { name: "Saudi Arabia East", lat: 27.62, lng: 48.61, bu: "brewery", buName: "Brewery " },
  { name: "Paraguana Peninsula", lat: 11.93, lng: -70.06, bu: "brewery", buName: "Brewery " }
];

const lifescience = [
  { name: "ZheJiang", lat: 28.22, lng: 120.35, bu: "lifescience", buName: "Life Science " },
  { name: "Abu Dhabi", lat: 24.36, lng: 54.50, bu: "lifescience", buName: "Life Science " },
  { name: "Baytown", lat: 29.73, lng: -94.98, bu: "lifescience", buName: "Life Science " },
  { name: "Ludwigshafen", lat: 49.48, lng: 8.49, bu: "lifescience", buName: "Life Science " }
];

export default function GlobeComponent({ onSiteSelect }) {

  const globeRef = useRef();
  const [activeSite, setActiveSite] = useState(null);

  const initialView = {
    lat: 20,
    lng: 0,
    altitude: 2
  };

  const sites = [
    ...dairy,
    ...sugar,
    ...farming,
    ...brewery,
    ...lifescience
  ];


  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.15;
      globeRef.current.pointOfView(initialView, 0);
    }
  }, []);

  const handlePointClick = (point) => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();

    // If clicking the same site again → zoom out
    if (activeSite && activeSite.name === point.name) {
      globeRef.current.pointOfView(initialView, 1000);
      controls.autoRotate = true;
      setActiveSite(null);
      if (onSiteSelect) onSiteSelect(null);
      return;
    }

    // Otherwise zoom in
    controls.autoRotate = false;

    globeRef.current.pointOfView(
      {
        lat: point.lat,
        lng: point.lng,
        altitude: 0.8
      },
      1000
    );

    setActiveSite(point);
    if (onSiteSelect) onSiteSelect(point);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>

      <Globe
        ref={globeRef}
        globeImageUrl="/images/earthblue.png"
        backgroundColor="#071623"

        polygonsData={countriesGeo.features}
        polygonCapColor={() => "rgba(0, 0, 0, 0)"}
        polygonSideColor={() => "transparent"}
        polygonStrokeColor={() => "#35baf6"}
        polygonAltitude={0}

        polygonLabel={({ properties }) => `
          <div style="color:white; font-size:14px;">
            ${properties.name}
          </div>
        `}

        pointsData={sites}
        pointLat="lat"
        pointLng="lng"
        pointColor={(point) => BU_COLORS[point.bu]}
        pointRadius={0.4}
        pointAltitude={0.005}

        ringsData={sites}
        ringLat="lat"
        ringLng="lng"
        ringColor={(point) => BU_COLORS[point.bu]}
        ringMaxRadius={2}
        ringPropagationSpeed={0.5}
        ringRepeatPeriod={1000}

        onPointClick={handlePointClick}
      />

      <button
        onClick={() => {
          if (!globeRef.current) return;

          const controls = globeRef.current.controls();

          globeRef.current.pointOfView(initialView, 1000);
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.15;
          setActiveSite(null);
          if (onSiteSelect) onSiteSelect(null);
        }}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 14px",
          background: "#35baf6",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          zIndex: 10
        }}
      >
        Reset View
      </button>

      {/* Dashboard */}
      <SiteDashboard
        site={activeSite}
        onClose={() => setActiveSite(null)}
      />
    </div>
  );

}

function SiteDashboard({ site, onClose }) {
  if (!site) return null;

  const buImage = BU_IMAGES[site.bu];
  const buColor = BU_COLORS[site.bu];

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        width: "320px",
        background: "#111",               // darker so the circle shows
        color: "#fff",
        padding: "16px",
        borderRadius: "8px",
        zIndex: 20,
        boxShadow: `0 0 20px ${buColor}`, // glow using BU color
        fontFamily: "sans-serif",
        border: `2px solid ${buColor}`,   // optional: outline highlight
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        ×
      </button>

      {/* BU Image */}
      {buImage && (
        <img
          src={buImage}
          alt={site.bu}
          style={{
            width: "100%",
            maxHeight: "180px",
            objectFit: "cover",
            borderRadius: "6px",
            marginBottom: "12px"
          }}
        />
      )}

      {/* Site Name with BU Color Circle */}
      <h3 style={{ display: "flex", alignItems: "center", margin: "0 0 8px 0" }}>
        <span
          style={{
            display: "inline-block",
            width: "18px",       // bigger circle
            height: "18px",
            borderRadius: "50%",
            background: buColor,
            marginRight: "10px",
            border: "2px solid #fff" // optional: white border so it stands out
          }}
        ></span>
        {site.name}
      </h3>

      {/* BU Name */}
      <p style={{ margin: "4px 0", fontWeight: "500" }}>
        <strong>Business Unit:</strong> {site.buName}
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: buColor,
            marginRight: "6px",
            verticalAlign: "middle"
          }}
        ></span>
      </p>

      {/* Latitude & Longitude with degree symbol */}
      <p style={{ margin: "2px 0" }}>
        <strong>Latitude:</strong> {site.lat.toFixed(2)}&deg;
      </p>
      <p style={{ margin: "2px 0" }}>
        <strong>Longitude:</strong> {site.lng.toFixed(2)}&deg;
      </p>
    </div>
  );
}


