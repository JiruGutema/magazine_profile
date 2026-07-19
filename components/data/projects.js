export const projects = [
  {
    id: 1,
    title: "Email Craft",
    description:
      "Email Craft is a full-stack application for composing, styling, and sending custom HTML emails directly from your Gmail account.",
    note: "I haven't verified it with Google yet, so it is currently in testing mode and can only be used by a limited number of users. if you want to try it out, please contact me.or watch the demo video below!",
    technologies: [
      "NestJS",
      "NextJS",
      "Prisma ORM",
      "PostgreSQL",
      "Google OAuth",
      "Gmail API",
      "JWT",
    ],
    details: [
      "Email Craft is a web application designed to create, style, and send professional emails directly from your Gmail account.",
      "Implements secure Google OAuth authentication and JWT-based authorization for safe, user-specific email sending.",
      "Integrates with the Gmail API to support sending both plain text and rich HTML emails.",
      "Backend built with NestJS and Prisma ORM for efficient database and token management using PostgreSQL.",
      "Automatic token refresh ensures uninterrupted email-sending access without manual reauthentication.",
      "Frontend built with NextJS provides a live HTML email editor with syntax highlighting and real-time preview.",
      "Drafts are automatically cached in the browser, allowing users to resume unfinished emails anytime.",
      "Features custom backend guards to protect sensitive routes and operations.",
      "Demonstrates proficiency in full-stack development, OAuth integration, and secure API design.",
    ],
    liveDemoLink: "https://email-craft-olive.vercel.app/",
    githubLink: "https://github.com/JiruGutema/email-craft",
  },

  {
    id: 2,
    title: "Kai-Share",
    description:
      "KaiShare is a secure platform for sharing code snippets and text with others, focusing on privacy, simplicity, and collaborative sharing.",
    note: "If you don't have an account, don't forget to copy the generated link after posting, as there is no way to retrieve it later.",
    technologies: ["NextJS", "Go (Gin Framework)", "PostgreSQL"],
    details: [
      "Easily share code blocks or plain text securely with encryption options.",
      "Supports 20+ programming languages for code formatting.",
      "Modern and intuitive UI built with NextJS for a smooth user experience.",
      "Backend built with Go (Gin Framework) for robust and scalable services.",
      "Privacy-focused platform with options for expiry and one-time viewing of shared content.",
    ],
    liveDemoLink: "https://kai-share.vercel.app/",
    githubLink: "https://github.com/JiruGutema/KaiShare",
  },

  {
    id: 3,
    title: "Page Marker (Firefox Extension)",
    note: "",
    description:
      "A simple Firefox extension that lets you draw, annotate, and highlight directly on any webpage.",
    technologies: ["JavaScript", "HTML5 Canvas", "WebExtensions API", "CSS"],
    details: [
      "Ever wanted to jot down quick notes or draw on a webpage while browsing? Page Marker makes it possible.",
      "Allows users to draw freehand, highlight text areas, and mark important sections on any webpage.",
      "Built using the WebExtensions API and HTML5 Canvas for smooth, responsive drawing.",
      "Supports brush size and color customization for flexible annotations.",
      "Includes an intuitive interface for clearing, saving, or restoring drawings.",
      "Enhances productivity by allowing visual note-taking without switching tabs.",
      "Showcases strong skills in browser extension development and canvas manipulation.",
    ],
    liveDemoLink:
      "https://addons.mozilla.org/en-US/firefox/addon/draw-and-mark-a-webpage/",
    githubLink: "https://github.com/JiruGutema/Firefox-Marker-Extension",
  },
  {
    id: 13,
    title: "Youtube Shorts Blocker (Firefox Extension)",
    description: "A Firefox extension to block YouTube Shorts.",
    note: "",
    technologies: ["JavaScript", "WebExtensions API", "HTML", "CSS"],
    details: [
      "Have you ever wanted to watch youtube videos and then lost yourself in the endless loop of YouTube Shorts?",
      "This extension is designed to block YouTube Shorts, allowing you to focus on full-length videos without distractions.",
      "It uses the WebExtensions API to modify YouTube's DOM, removing Shorts content.",
      "Developed a Firefox extension that blocks YouTube Shorts.",
      "Utilizes the WebExtensions API to modify YouTube's DOM.",
      "Provides users with a cleaner YouTube experience by removing Shorts content.",
      "Demonstrates proficiency in browser extension development and JavaScript.",
    ],
    liveDemoLink:
      "https://addons.mozilla.org/en-US/firefox/addon/hide-youtube-short/",
    githubLink: "https://github.com/JiruGutema/Hide-Youtube-Shorts",
  },
  {
    id: 14,
    title: "Content Section Blocker (Browser Extension)",
    description:
      "A cross-browser extension that force-hides any element on any website by CSS selector (class or id). Rules are editable and stored locally — per-site by default, or globally across all sites.",
    note: "",
    technologies: [
      "JavaScript",
      "WebExtensions API",
      "Manifest V3",
      "HTML",
      "CSS",
    ],
    details: [
      "Block any element by pasting a CSS selector like `.ad-container` or `#promoted-post`; the matching element is force-hidden with `display: none !important`.",
      "Includes a point-and-click element picker that generates a selector (preferring the element's id) and blocks it instantly.",
      "Supports per-site rules that fire only on the domain they were added on, plus global rules that apply everywhere.",
      "Rules are fully editable — toggle on/off, edit the selector, or delete — and persist in storage.local, with a master switch to pause or resume all blocking.",
      "Injects rules as a stylesheet at document_start, so blocked elements never flash and dynamically-added elements stay hidden without per-node scanning.",
      "Shares a single Manifest V3 codebase across Chrome/Edge and Firefox using the WebExtensions API.",
    ],
    liveDemoLink:
      "https://addons.mozilla.org/en-US/firefox/addon/element-selector-blocker",
    githubLink:
      "https://github.com/JiruGutema/element-blocker-browser-extension",
  },

  {
    id: 2,
    title: "Tooran Android Application ",
    description: "A task organizer Flutter app.",
    note: "",
    technologies: [
      "Flutter",
      "Dart",
      "Firebase (optional for future features)",
    ],
    details: [
      "Allows users to manage tasks within categories.",
      "Features include creating categories, adding tasks, and efficient task management.",
      "Designed for a clean and intuitive user experience on Android devices.",
    ],
    liveDemoLink: "https://tooran-documentation.vercel.app/",
    githubLink: "https://github.com/JiruGutema/Tooran",
  },

  {
    id: 4,
    title: "Sentiment Analysis Web Application",
    description:
      "A sentiment analysis web application built with Python and Flask.",
    technologies: ["Python", "Natural Language Processing", "Flask"],
    note: "",
    details: [
      "Built a sentiment analysis web application that allows users to analyze the sentiment of text.",
      "Utilizes Natural Language Processing techniques for accurate sentiment detection.",
      "Demonstrates proficiency in backend development and machine learning integration.",
    ],
    liveDemoLink: "https://github.com/JiruGutema/sentiment-analysis",
    githubLink: "https://github.com/JiruGutema/sentiment-analysis",
  },
  // },
  // {
  //   id: 5,
  //   title: "Walaloo a Poetry Application ",
  //   note: "Private Repository",
  //   description:
  //     "A poetry application built with Next.js and Nestjs (Private Repository).",
  //   technologies: ["Next.js", "NestJS", "TypeScript", "PostgreSQL", "Prisma"],
  //   details: [
  //     "Built a Reddit Style Afaan Oromo poetry application that allows users to create and share poems, Comments, and likes.",
  //     "Utilizes a modern tech stack for a seamless user experience.",
  //     "Demonstrates proficiency in full-stack development and database management.",
  //   ],
  //   liveDemoLink: "https://github.com/JiruGutema/Walaloo",
  //   githubLink: "https://github.com/JiruGutema/Walaloo",
  // },
  // {
  //   id: 6,
  //   title: "JirenIntelli",
  //   description: "A chatbot based on a Gemini free flash API.",
  //   note: "",
  //   technologies: ["Javascript", "Node.js", "Express", "Gemini API"],
  //   details: [
  //     "Built a mini chatbot that utilizes the Gemini chatbot API.",
  //     "Assists users with basic tasks, coding queries, and writing paragraphs.",
  //     "Demonstrates integration with external AI services.",
  //   ],
  //   liveDemoLink: "https://gemini-chat-bot-bice.vercel.app/",
  //   githubLink: "https://github.com/JiruGutema/gemini_chat_bot",
  // },
  {
    id: 7,
    title: "House Rental Web Application (Group Project)",
    description: "A full-stack web application for a house rental platform.",
    note: "",
    technologies: ["Node.js", "Express", "MySQL", "React", "JWT"],
    details: [
      "Developed a comprehensive platform for listing and renting houses.",
      "Implemented user authentication and authorization using JWT.",
      "Managed database interactions with MySQL.",
      "Contributed to both frontend (React) and backend (Node.js/Express) development.",
    ],
    liveDemoLink:
      "https://github.com/JiruGutema/House_Rental_and_Sell_Management_System",
    githubLink:
      "https://github.com/JiruGutema/House_Rental_and_Sell_Management_System",
  },
  {
    id: 8,
    title: "Restaurant Management System (Group Project)",
    description: "A full-stack restaurant management system.",
    technologies: ["Node.js", "NestJS", "TypeScript", "Vanilla HTML", "MySQL"],
    note: "",
    details: [
      "Participated in a group project contributing as a database designer, frontend developer, and API integrator.",
      "Built with modern backend frameworks (NestJS, TypeScript) and vanilla HTML for the frontend.",
      "Designed and implemented the database schema for restaurant operations.",
    ],
    liveDemoLink:
      "https://github.com/JiruGutema/Restaurant_Ordering_System_2024_25",
    githubLink:
      "https://github.com/JiruGutema/Restaurant_Ordering_System_2024_25",
  },
  {
    id: 9,
    title: "VolunteerConnect (Group Project)",
    description: "Connects volunteers with organizations.",
    technologies: ["Express", "MySQL", "Flutter", "JWT", "Firebase"],
    note: "",
    details: [
      "Contributed as a backend developer and Flutter developer.",
      "Implemented backend functionalities using Express and MySQL.",
      "Developed mobile features with Flutter.",
      "Integrated JWT for secure authentication and Firebase for additional services.",
    ],
    liveDemoLink: "https://github.com/JiruGutema/VolunteerConnect",
    githubLink: "https://github.com/JiruGutema/VolunteerConnect",
  },
  {
    id: 10,
    title: "React-Next-Folder Creator (Contribution)",
    description:
      "A Node.js library that creates folders for React and Next.js projects.",
    technologies: ["Node.js"],
    note: "",
    details: [
      "Contributed to a project by enhancing user experience with commands.",
      "Added multi-argument support for creating multiple folders simultaneously.",
      "Improved the utility and efficiency of the library for developers.",
    ],
    liveDemoLink: "https://www.npmjs.com/package/react-cli-builder",
    githubLink: "https://github.com/JiruGutema/react-next_folder",
  },
  {
    id: 11,
    title: "db4free-net-l10n (Contribution)",
    note: "",
    description: "Contribution to a free online database host platform.",
    technologies: ["Localization", "Afaan Oromoo"],
    details: [
      "Contributed to the db4free.net project by adding an Afaan Oromoo Translation pool.",
      "Helped make the platform more accessible to Afaan Oromoo speakers.",
      "Demonstrates commitment to open-source and localization efforts.",
    ],
    liveDemoLink: "https://www.db4free.net/translate.php?language=om",
    githubLink: "https://github.com/mpopp75/db4free-net-l10n/tree/main/om",
  },
  {
    id: 12,
    title: "Local File Sharing",
    description: "A file sharing application built with Node.js and Express.",
    note: "",
    technologies: ["Javascript", "Node.js", "Express", "Socket.IO"],
    details: [
      "Built a file sharing application that allows users to upload and share files.",
      "Utilizes Express for real-time file transfer.",
      "Demonstrates proficiency in backend development and real-time web applications.",
    ],
    liveDemoLink: "https://github.com/JiruGutema/FileShare-Hub",
    githubLink: "https://github.com/JiruGutema/FileShare-Hub",
  },
];
