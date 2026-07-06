import {
  Shield,
  Landmark,
  Layers,
  HeartHandshake,
  TrendingUp,
  Stethoscope,
  BedDouble,
  Building2,
  Factory,
  Package,
  Zap,
  RadioTower,
  Wrench,
  Sparkles,
  Truck,
  Ship,
  Plane,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/** Maps the string icon keys used in /data to lucide components. */
const map: Record<string, LucideIcon> = {
  shield: Shield,
  landmark: Landmark,
  layers: Layers,
  "heart-handshake": HeartHandshake,
  "trending-up": TrendingUp,
  stethoscope: Stethoscope,
  "bed-double": BedDouble,
  "building-2": Building2,
  factory: Factory,
  package: Package,
  zap: Zap,
  "radio-tower": RadioTower,
  wrench: Wrench,
  sparkles: Sparkles,
  truck: Truck,
  ship: Ship,
  plane: Plane,
  wallet: Wallet,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.6,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = map[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
