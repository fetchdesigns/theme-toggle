import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("documentation", "routes/documentation.tsx"),
  route("theme", "routes/theme.tsx"),
] satisfies RouteConfig;

