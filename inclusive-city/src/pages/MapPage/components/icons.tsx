import AccessibleIcon from "@mui/icons-material/Accessible";
import WcIcon from "@mui/icons-material/Wc";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import TextureIcon from "@mui/icons-material/Texture";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import { renderToString } from "react-dom/server";
import L from "leaflet";

// Add this function to create Material UI icons as Leaflet divIcons
const createMaterialIcon = (Icon, color = "#1976d2", bgColor = "white") => {
  // Render the Material UI icon to an HTML string
  const iconHtml = renderToString(<Icon style={{ color, fontSize: "24px" }} />);

  // Create a div that wraps the icon with styling
  const html = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      background-color: ${bgColor};
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    ">
      ${iconHtml}
    </div>
  `;

  // Return a Leaflet divIcon with the styled Material UI icon
  return L.divIcon({
    html,
    className: "material-icon-marker", // This removes the default leaflet icon styling
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// Create your icon instances with different colors for each feature type
export const wheelchairIcon = createMaterialIcon(AccessibleIcon, "#0288d1");
export const toiletIcon = createMaterialIcon(WcIcon, "#f57c00");
export const busStopIcon = createMaterialIcon(DirectionsBusIcon, "#388e3c");
export const kerbIcon = createMaterialIcon(LinearScaleIcon, "#7b1fa2");
export const tactilePavingIcon = createMaterialIcon(TextureIcon, "#ff9800");
export const rampIcon = createMaterialIcon(AccessibleForwardIcon, "#d32f2f");
