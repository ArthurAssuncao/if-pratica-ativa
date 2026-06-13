interface IconifyDataFiltered {
  [key: string]: {
    name: string;
    total: number;
    version?: string;
    author: {
      name: string;
      url: string;
    };
    license: {
      title: string;
      spdx: string;
      url: string;
    };
    samples: string[];
    height?: number;
    category: string;
    tags?: string[];
    palette: boolean;
    displayHeight?: number;
  };
}

export const ICONIFY_DATA_FILTERED: IconifyDataFiltered = {
  mdi: {
    name: "Material Design Icons",
    total: 7447,
    author: {
      name: "Pictogrammers",
      url: "https://github.com/Templarian/MaterialDesign",
    },
    license: {
      title: "Apache 2.0",
      spdx: "Apache-2.0",
      url: "https://github.com/Templarian/MaterialDesign/blob/master/LICENSE",
    },
    samples: [
      "account-check",
      "bell-alert-outline",
      "calendar-edit",
      "skip-previous",
      "home-variant",
      "lock-open-outline",
    ],
    height: 24,
    category: "Material",
    tags: ["Precise Shapes", "Has Padding"],
    palette: false,
  },
  "mdi-light": {
    name: "Material Design Light",
    total: 284,
    author: {
      name: "Pictogrammers",
      url: "https://github.com/Templarian/MaterialDesignLight",
    },
    license: {
      title: "Open Font License",
      spdx: "OFL-1.1",
      url: "https://github.com/Templarian/MaterialDesignLight/blob/master/LICENSE.md",
    },
    samples: ["cart", "bell", "login", "skip-previous", "home", "lock-open"],
    height: 24,
    category: "Material",
    tags: ["Precise Shapes", "Has Padding"],
    palette: false,
  },
  fa: {
    name: "Font Awesome 4",
    total: 678,
    version: "4.7.0",
    author: {
      name: "Dave Gandy",
      url: "https://github.com/FortAwesome/Font-Awesome/tree/fa-4",
    },
    license: {
      title: "Open Font License",
      spdx: "OFL-1.1",
      url: "https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL",
    },
    samples: ["wrench", "bell-o", "user-o", "area-chart", "play", "css3"],
    category: "Archive / Unmaintained",
    palette: false,
  },
  ion: {
    name: "IonIcons",
    total: 1357,
    version: "8.0.13",
    author: {
      name: "Ben Sperry",
      url: "https://github.com/ionic-team/ionicons",
    },
    license: {
      title: "MIT",
      spdx: "MIT",
      url: "https://github.com/ionic-team/ionicons/blob/main/LICENSE",
    },
    samples: [
      "code-download-sharp",
      "contrast-outline",
      "checkmark-done",
      "navigate-sharp",
      "arrow-redo-outline",
      "bookmark-sharp",
    ],
    height: 32,
    displayHeight: 16,
    category: "UI 16px / 32px",
    tags: ["Precise Shapes", "Has Padding"],
    palette: false,
  },
  fe: {
    name: "Feather Icon",
    total: 255,
    version: "1.0.2",
    author: {
      name: "Megumi Hano",
      url: "https://github.com/feathericon/feathericon",
    },
    license: {
      title: "MIT",
      spdx: "MIT",
      url: "https://github.com/feathericon/feathericon/blob/master/LICENSE",
    },
    samples: ["add-cart", "comments", "link-external", "check", "bolt", "map"],
    height: 24,
    category: "UI 24px",
    tags: ["Precise Shapes", "Has Padding"],
    palette: false,
  },
  lucide: {
    name: "Lucide",
    total: 1714,
    author: {
      name: "Lucide Contributors",
      url: "https://github.com/lucide-icons/lucide",
    },
    license: {
      title: "ISC",
      spdx: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
    samples: [
      "circle-check",
      "award",
      "house",
      "check",
      "mountain",
      "chevron-up",
    ],
    height: 24,
    category: "UI 24px",
    tags: ["Precise Shapes", "Has Padding", "Uses Stroke"],
    palette: false,
  },
  "lucide-lab": {
    name: "Lucide Lab",
    total: 373,
    author: {
      name: "Lucide Contributors",
      url: "https://github.com/lucide-icons/lucide-lab",
    },
    license: {
      title: "ISC",
      spdx: "ISC",
      url: "https://github.com/lucide-icons/lucide-lab/blob/main/LICENSE",
    },
    samples: [
      "venn",
      "card-credit",
      "pac-man",
      "cent",
      "candlestick-big-lit",
      "gearbox",
    ],
    height: 24,
    category: "UI 24px",
    tags: ["Precise Shapes", "Has Padding", "Uses Stroke"],
    palette: false,
  },
  "simple-icons": {
    name: "Simple Icons",
    total: 3442,
    version: "16.23.0",
    author: {
      name: "Simple Icons Collaborators",
      url: "https://github.com/simple-icons/simple-icons",
    },
    license: {
      title: "CC0 1.0",
      spdx: "CC0-1.0",
      url: "https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md",
    },
    samples: [
      "wise",
      "framer",
      "vuetify",
      "unsplash",
      "stackblitz",
      "mitsubishi",
    ],
    height: 24,
    category: "Logos",
    palette: false,
  },
  logos: {
    name: "SVG Logos",
    total: 1861,
    author: { name: "Gil Barbara", url: "https://github.com/gilbarbara/logos" },
    license: {
      title: "CC0",
      spdx: "CC0-1.0",
      url: "https://raw.githubusercontent.com/gilbarbara/logos/master/LICENSE.txt",
    },
    samples: ["npm-icon", "uikit", "patreon", "serverless", "vue", "modernizr"],
    category: "Logos",
    palette: true,
  },
  devicon: {
    name: "Devicon",
    total: 1036,
    author: {
      name: "konpa",
      url: "https://github.com/devicons/devicon/tree/master",
    },
    license: {
      title: "MIT",
      spdx: "MIT",
      url: "https://github.com/devicons/devicon/blob/master/LICENSE",
    },
    samples: [
      "windows8",
      "tensorflow",
      "logstash",
      "stackblitz",
      "fsharp",
      "vite",
    ],
    height: 32,
    displayHeight: 16,
    category: "Programming",
    palette: true,
  },
  "devicon-plain": {
    name: "Devicon Plain",
    total: 755,
    author: {
      name: "konpa",
      url: "https://github.com/devicons/devicon/tree/master",
    },
    license: {
      title: "MIT",
      spdx: "MIT",
      url: "https://github.com/devicons/devicon/blob/master/LICENSE",
    },
    samples: ["kotlin", "bulma", "logstash", "flutter", "vuejs", "fsharp"],
    height: 32,
    displayHeight: 16,
    category: "Programming",
    palette: false,
  },
  "vscode-icons": {
    name: "VSCode Icons",
    total: 1508,
    version: "12.18.0",
    author: {
      name: "Roberto Huertas",
      url: "https://github.com/vscode-icons/vscode-icons",
    },
    license: {
      title: "MIT",
      spdx: "MIT",
      url: "https://github.com/vscode-icons/vscode-icons/blob/master/LICENSE",
    },
    samples: [
      "file-type-actionscript2",
      "file-type-json",
      "file-type-manifest",
      "default-file",
      "file-type-diff",
      "default-folder",
    ],
    height: 32,
    displayHeight: 16,
    category: "Programming",
    tags: ["Has Padding"],
    palette: true,
  },
  "fa-brands": {
    name: "Font Awesome 5 Brands",
    total: 457,
    version: "5.15.4",
    author: {
      name: "Dave Gandy",
      url: "https://github.com/FortAwesome/Font-Awesome",
    },
    license: {
      title: "CC BY 4.0",
      spdx: "CC-BY-4.0",
      url: "https://creativecommons.org/licenses/by/4.0/",
    },
    samples: ["amazon", "cc-visa", "vuejs", "chrome", "strava", "microsoft"],
    height: 32,
    displayHeight: 16,
    category: "Archive / Unmaintained",
    palette: false,
  },
};
