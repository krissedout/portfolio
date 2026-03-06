import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AveCallback from "./pages/AveCallback";
import DynamicPage from "./pages/DynamicPage";

export default function Router() {
  const path = window.location.pathname;

  if (path === "/ave/callback") {
    return <AveCallback />;
  }
  if (path === "/login") {
    return <Login />;
  }
  if (path === "/admin") {
    return <Admin />;
  }
  if (path.startsWith("/p/") || path.startsWith("/blog/") || path.startsWith("/project/")) {
    const slug = path.split("/")[2];
    return <DynamicPage slug={slug} />;
  }
  return <Home />;
}
