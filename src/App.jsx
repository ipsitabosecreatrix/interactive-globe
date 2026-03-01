import { useState } from "react";
import GlobeComponent from "./components/Globe";

export default function App() {
  const [selectedSite, setSelectedSite] = useState(null);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <GlobeComponent onSiteSelect={setSelectedSite} />
    </div>
  );
}
