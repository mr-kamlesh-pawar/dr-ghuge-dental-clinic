import ServiceList from "./ServiceList";
import { mockServices } from "@/lib/mockData";

export default function ServiceCard() {
  // In production/build, we use direct import for SSG/SSR to avoid localhost fetch failures
  return <ServiceList services={mockServices} />;
}
