/**
 * @estatify/ui/icons — the single icon entry point for the platform.
 *
 * Apps import icons ONLY from here, never from a third-party library directly.
 * Internally this re-exports the icons we use from lucide-react under Estatify
 * names; the underlying library can be swapped without touching app code.
 *
 *   import { ListingsIcon } from "@estatify/ui/icons";
 *
 * Add a new icon by re-exporting it below (curated, tree-shakeable).
 */
export {
  Home as HomeIcon,
  Building2 as BuildingIcon,
  Globe as GlobeIcon,
  LayoutGrid as ListingsIcon,
  Target as LeadsIcon,
  Users as AgentsIcon,
  BarChart3 as AnalyticsIcon,
  Wallet as BillingIcon,
  Check as CheckIcon,
  ArrowRight as ArrowRightIcon,
  Menu as MenuIcon,
  X as CloseIcon,
  MapPin as LocationIcon,
  Search as SearchIcon,
  Sparkles as SparkleIcon,
} from "lucide-react";

export type { LucideIcon as IconComponent } from "lucide-react";
