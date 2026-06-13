import { DEVICON } from "./devicon";
import { DEVICON_PLAIN } from "./devicon-plain";
import { FA } from "./fa";
import { FA_BRANDS } from "./fa-brands";
import { FE } from "./fe";
import { ION } from "./ion";
import { LOGOS } from "./logos";
import { LUCIDE } from "./lucide";
import { LUCIDE_LAB } from "./lucide-lab";
import { MDI } from "./mdi";
import { MDI_LIGHT } from "./mdi-light";
import { SIMPLE_ICONS } from "./simple-icons";
import { VSCODE_ICONS } from "./vscode-icons";

export interface IconifyCategories {
  Accessibility?: string[];
  "Account / User"?: string[];
  Agriculture?: string[];
  "Alert / Error"?: string[];
  "Alpha / Numeric"?: string[];
  Animal?: string[];
  Arrange?: string[];
  Arrow?: string[];
  Audio?: string[];
  "Audio & Video"?: string[];
  Automotive?: string[];
  Banking?: string[];
  Battery?: string[];
  "Brand / Logo"?: string[];
  "Cellphone / Phone"?: string[];
  Clothing?: string[];
  Cloud?: string[];
  Color?: string[];
  Communication?: string[];
  Currency?: string[];
  Database?: string[];
  "Date / Time"?: string[];
  "Developer / Languages"?: string[];
  "Device / Tech"?: string[];
  "Drawing / Art"?: string[];
  "Edit / Modify"?: string[];
  Emoji?: string[];
  "Files / Folders"?: string[];
  "Food / Drink"?: string[];
  Form?: string[];
  Games?: string[];
  "Gaming / RPG"?: string[];
  "Geographic Information System"?: string[];
  "Hardware / Tools"?: string[];
  Health?: string[];
  "Health / Beauty"?: string[];
  Holiday?: string[];
  "Home Automation"?: string[];
  Images?: string[];
  Lock?: string[];
  Math?: string[];
  "Medical / Hospital"?: string[];
  Music?: string[];
  Nature?: string[];
  Navigation?: string[];
  Notification?: string[];
  "Payments & Shopping"?: string[];
  "People / Family"?: string[];
  Photography?: string[];
  Places?: string[];
  Printer?: string[];
  Religion?: string[];
  Science?: string[];
  "Science Fiction"?: string[];
  Settings?: string[];
  Shape?: string[];
  Shopping?: string[];
  "Social Media"?: string[];
  Sport?: string[];
  "Tabletop Gaming"?: string[];
  "Text / Content / Format"?: string[];
  Tooltip?: string[];
  "Transportation + Flying"?: string[];
  "Transportation + Other"?: string[];
  "Transportation + Road"?: string[];
  "Transportation + Water"?: string[];
  "Users & People"?: string[];
  Vehicles?: string[];
  Vector?: string[];
  "Video / Movie"?: string[];
  View?: string[];
  Weather?: string[];
}

export interface IconifyIconSet {
  prefix: string;
  total: number;
  title: string;
  uncategorized: string[];
  hidden?: string[];
  aliases?: Record<string, string>;
  categories?: IconifyCategories;
  suffixes?: Record<string, string>;
}

interface IconifyIconsSet {
  [key: string]: IconifyIconSet;
}

export const ICONIFY_ICONS_SET: IconifyIconsSet = {
  devicon: DEVICON,
  "devicon-plain": DEVICON_PLAIN,
  fa: FA,
  "fa-brands": FA_BRANDS,
  fe: FE,
  ion: ION,
  logos: LOGOS,
  lucide: LUCIDE,
  "lucide-lab": LUCIDE_LAB,
  mdi: MDI,
  "mdi-light": MDI_LIGHT,
  "simple-icons": SIMPLE_ICONS,
  "vscode-icons": VSCODE_ICONS,
};
