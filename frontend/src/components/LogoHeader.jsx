import LogoJankovic from "../assets/LogoJankovic.png";
import { useTheme } from "../context/ThemeContext";

export default function LogoHeader() {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center mb-8">
      <img
        src={LogoJankovic}
        alt="Fast Food Janković"
        className="h-44 transition-filter duration-500"
        style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
      />
    </div>
  );
}
