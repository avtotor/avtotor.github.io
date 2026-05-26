import { useRoute } from "./router";
import Home from "./pages/Home";
import { MosfetPage } from "./pages/Mosfet";

export default function App() {
  const path = useRoute();
  if (path.startsWith("/mosfet")) return <MosfetPage />;
  return <Home />;
}
