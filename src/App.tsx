import { useRoute } from "./router";
import Home from "./pages/Home";
import { MosfetPage } from "./pages/Mosfet";
import { EraM5Page } from "./pages/EraM5";

export default function App() {
  const path = useRoute();
  if (path.startsWith("/mosfet")) return <MosfetPage />;
  if (path.startsWith("/robots/era-m5")) return <EraM5Page />;
  return <Home />;
}
