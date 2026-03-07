import Home from "./pages/Home";
import DynamicPage from "./pages/DynamicPage";

export default function Router() {
  const path = window.location.pathname;

  if (path.startsWith("/p/") || path.startsWith("/blog/") || path.startsWith("/project/")) {
    const slug = path.split("/")[2];
    return <DynamicPage slug={slug} />;
  }
  return <Home />;
}
