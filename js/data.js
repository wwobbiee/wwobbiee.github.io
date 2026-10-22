export const TIERS = [
  {
    id: 'primary',
    name: 'primary',
    desc: '<span class="text-acid/70">I use it regularly</span> and can build with it independently without needing to constantly reference documentation.'
  },
  {
    id: 'proficient',
    name: 'proficient',
    desc: '<span class="text-acid/70">I can comfortably work with it</span> and understand its common patterns and concepts, though it isn\'t necessarily my strongest technology.'
  },
  {
    id: 'knowledge',
    name: 'knowledge',
    desc: 'I\'ve build meaningful things with it and <span class="text-acid/70">I understand the fundamentals</span>, but have less experience with it than my primary technologies.'
  },
  {
    id: 'familiar',
    name: 'familiar',
    desc: 'I\'ve used it in a project or course and <span class="text-acid/70">I understand the basics</span>, but would need to revisit the documentation before doing substantial work with it.'
  },
  {
    id: 'exposure',
    name: 'exposure',
    desc: 'I\'ve encountered or <span class="text-acid/70">experimented with it</span>, but don\'t have enough practical experience to claim proficiency.'
  }
];

export const SKILLS = [
  {
    cat: 'languages',
    label: 'inspect(_languages)',
    items: [
      ['Javascript', 'primary'],  ['Python', 'proficient'], ['C++', 'knowledge'],
      ['C#',         'familiar'], ['Go',     'familiar'],   ['Bash', 'exposure']
    ]
  },
  {
    cat: 'web',
    label: 'enumerate(_webTechnologies)',
    items: [
      ['Tailwind', 'primary'],    ['CSS 3',     'proficient'], ['Express.js', 'proficient'],
      ['HTML5',    'proficient'], ['Bootstrap', 'knowledge'],  ['Next.js',    'familiar'],
      ['Vite',     'familiar']
    ]
  },
  {
    cat: 'data',
    label: 'query(_databases)',
    items: [
      ['MongoDB', 'knowledge'], ['SQLite',     'knowledge'],
      ['MySQL',   'familiar'],  ['PostgreSQL', 'familiar']
    ]
  },
  {
    cat: 'runtimes',
    label: 'resolve(_runtimes && _platforms)',
    items: [
      ['Node.js', 'proficient'], ['.NET', 'knowledge'], ['Linux', 'knowledge'],
      ['Windows', 'knowledge'],  ['WSL',  'knowledge']
    ]
  },
  {
    cat: 'tools',
    label: 'enumerate(_tools && _development)',
    items: [
      ['Git',     'proficient'], ['Github',         'proficient'], ['npm',    'proficient'],
      ['VS Code', 'proficient'], ['Github Actions', 'knowledge'],  ['Docker', 'exposure'],
      ['Postman', 'exposure']
    ]
  }
]

export const PROJECTS = [
  {
    n:      '01',
    id:     'journalsec',
    lens:   'journalsec',
    title:  'JournalSec',
    long:   'encrypted local journal',
    kind:   'local app',
    status: 'prototype [unaudited]',
    statusClass: 'prototype',
    stack: ['Express', 'AES-256-GCM', 'Argon2id'],
    topics: [
      'cryptography', 'password-based key derivation', 'protected data',
      'practical security implementation'
    ],
    summary: 'A locally oriented journal with encrypted storage: keys derived from a passphrase, entries sealed with authenticated encryption.',
    problem: 'A journal is the most personal data there is, and "it\'s just on my machine" is not a security model. The goal was to practice best security practices rather than ship a product.',
    approach: 'Passphrases are stretched with Argon2id into an envelope wrapped encryption key: entries are sealed with AES-256-GCM so confidentiality and integrity are both covered. Everything runs locally on a small Express service; the attack surface is the point of this project.',
    statusNote: 'Prototype. It has not had an independent security audit and should not by trusted with data you cannot afford to lose. The crypto primitives are standard; the surrounding code is hobbyist quality.',
    link: ''
  },
  {
    n:      '02',
    id:     'ube',
    lens:   'ube',
    title:  'UBE',
    long:   'Universal Beatmap Extractor',
    kind:   'format tooling',
    status: 'active development',
    statusClass: 'active',
    stack: ['JavaScript', 'Node'],
    topics: [
      'file-format parsing', 'data modelling', 'format interoperability',
      'archive extraction',  'audio/image assets'
    ],
    summary: 'A beatmap converter for mania rhythm games: parse multiple formats into one shared internal representation, convert between them.',
    problem: 'Every rhythm game speaks its own beatmap dialect. Charts people care about are locked inside format-specific silos, and existing converters tend to cover one narrow pariring at a time.',
    approach: 'Each supported format gets a parser that maps onto a single intermediate representation; timing, lanes, notes, and metadata as plain data. Converters are just parser/serializer pairs, which makes adding a new format a matter of writing one side of the mapping. Assets (audio, images) are pullef from the game specific archive/format during extraction.',
    statusNote: 'osu! parsing is the furthest along. Quaver, StepMania and beatmania are targeted formats, not finished ones; treat support as partial until the parser tables say otherwise. Beatmap editing is future work, not a shipped feature.',
    link: ''
  },
  {
    n:      '03',
    id:     'dekiru',
    lens:   'dekiru',
    title:  'Dekiru',
    long:   'Japanese sentence learning tool',
    kind:   'web app',
    status: 'active development',
    statusClass: 'active',
    stack: ['Next.js', 'SQLite', 'Python', 'SudachiPy'],
    topics: [
      'NLP / morphological analysis', 'language learning', 'data pipelines',
      'SQLite full-text search',      'Japanese linguistics'
    ],
    summary: 'A Japanese reading tool built around real Tatoeba sentences: tap any word to see its meaning, readings, and full conjugation table with the current inflection highlighted.',
    problem: 'Vocabulary apps teach words in isolation. Reading real Japanese means encountering words mid-conjugation, inside polite constructions, stacked with auxiliary verbs; none of which maps cleanly onto a dictionary entry. Most tools either skip that gap or paper over it with furigana.',
    approach: 'A Python pipeline parses JMdict, KANJIDIC2, and Tatoeba into SQLite, then runs SudachiPy over every sentence to tokenize and resolve each morpheme to its dictionary entry. A grouping pass merges auxiliary chains into a learner-facing display units (お会いしましょう as one clickable chunk, not four). The Next.js frontend renders tappable sentence tiles; tapping one opens a word card showing the head word\'s conjugation table with the active inflection row highlighted, followed by a morpheme breakdown of each piece: honorific prefix, verb stem, auxiliary, as its own mini dictionary entry.',
    statusNote: 'Core pipeline and UI are working. Grammar grouping covers honorific, suru-chain, and te-auxiliary patterns. Sentence-level dependency parsing (subject/object relationships) is the next planned layer.',
    link: ''
  },
  {
    n:      '04',
    id:     'des-by-hand',
    lens:   'des',
    title:  'DES, by hand',
    long:   'from-scratch DES in every language I learn',
    kind:   'learning exercise',
    status: 'ongoing - multi-language',
    statusClass: 'active',
    stack: ['Python', 'JavaScript', 'C++ (planned)', 'C# (planned)'],
    topics: [
      'block ciphers', 'Feistel networks', 'bit manipulation',
      'S-Boxes',       'key schedules',    'cli tools'
    ],
    summary: 'A recurring ritual: implement DES from nothing in each new language I pick up; no crypto libraries, just loops, literal tables, and bit-by-bit string surgery.',
    problem: 'Tutorials teach syntax; they don\'t teach how a language feels under real work. I wanted one fixed, non-trivial problem with enough structure; real logic, real bit manipulation, real edge cases, to force me through a language\'s loops, strings, types, and idioms.',
    approach: 'The spec followed literally and awkwardly on purpose: initial permutation, expansion, S-Box lookups, P-Box, and the key schedule all declared as plain table arrays. Bits are handled by indexing strings; if the character at posiion n is `0` do this, if it\'s `1` do that. Only loops, functions, and the occasional class; native API calls kept to a minimum. A small CLI takes a hex or plaintext key plus a mode and outputs the encrypted result in hex. The constraint is the point; by the time DES encrypts and decrypts correctly, the language\'s rough edges are mapped.',
    statusNote: 'Python and JavaScript versions work end to end. C++ and C# are planned, with more languages after; each implementation lives in its own folder of one repo, and the collection itself is the project.',
    link: ''
  },
  {
    n:      '05',
    id:     'otakulog',
    lens:   'otakulog',
    title:  'OtakuLog',
    long:   'anime tracking web app',
    kind:   'web app',
    status: 'stable',
    statusClass: 'stable',
    stack: ['Vite', 'vanilla JS', 'Tailwind CSS', 'REST APIs'],
    topics: [
      'application design', 'API-driven data', 'responsive interfaces',
      'lightweight frontend architecture', 'persistent preferences'
    ],
    summary: 'An anime-tracking application built on API-driven data, with preferences and watch state kept locally.',
    problem: 'Tracking what you watch should not require an account on someone else\'s service, and most trackers are heavier than the problem deserves.',
    approach: 'A deliberately lightweight frontend: Vite for tooling, vanilla JavaScript for behaviour, Tailwind for styling. Show and episode data comes from local storage so the app stays useful without a backend.',
    statusNote: 'Stable and usable. Maintenance-style development; fixes and small improvements rather than feature pushes.',
    link: ''
  },
  {
    n:     '06',
    id:    'offred',
    lens:  'offred',
    title: 'OffRed',
    long:  'local SubReddit archiver',
    kind:  'desktop app',
    status: 'working prototype',
    statusClass: 'prototype',
    stack: ['Electron', 'SQLite'],
    topics: [
      'desktop software', 'local persistence', 'data retrieval',
      'web tech on a desktop runtime'
    ],
    summary: 'An Electron application for archiving Reddit content locally, stored in a real database you own.',
    problem: 'Content posted to platforms dissapears; deleted, removed, privatized. Archiving it means pulling it out of the platform context and keeping it somewhere durable and queryable.',
    approach: 'Electron hosts a familiar web-technology UI while the data layer is a local SQLite database: retrieval, storage, and browsing all run on the machine, no server required. The interesting part was the seam where web conventions meet a desktop runtime and a relational schema.',
    statusNote: 'A working prototype, not a polished product. Core retrieval and storage work; the UI and edge cases are where the remaining effort sits.',
    link: ''
  },
  {
    n:      '07',
    id:     'wobbies_toolbox',
    lens:   'toolbox',
    title:  'WobbiesToolBox',
    long:   'python utilities & media workflows',
    kind:   'utilities',
    status: 'active',
    statusClass: 'active',
    stack: ['Python', 'FFmpeg', 'Git'],
    topics: [
      'command-line tools', 'automation', 'file processing',
      'eliminating repetitive work'
    ],
    summary: 'A collection of personal Python utilities and media-processing workflows; scripts that exist because a task was repetitive and a tool was more interesting than doing it by hand.',
    problem: 'Repetitive media and file tasks: converting, renaming, extracting, checking, batching. Each one is small, but together they eat time and attention.',
    approach: 'Small, composable command-line tools, most of them wrapping FFmpeg for the heavy lifting. The design rule is that a tool must justify its existence the third time the task comes up; otherwise the shell history entry was enough.',
    statusNote: 'Continuously growing and being pruned. Somet ools graduate into regular use, some get deleted when the workflow changes. That is the point of the collection.',
    link: ''
  }
]

export const LAB = [
  {
    tag: 'bot',
    title: 'modular discord bot',
    desc: 'discord.js bot with plugin-style commands and self-hosted local AI integration using llama.cpp',
    href: ''
  },
  {
    tag: 'ml',
    title: 'local LLM experiments',
    desc: 'running, poking at and wiring small language models into local tooling',
    href: ''
  },
  {
    tag: 'media',
    title: 'OBS / audio automation',
    desc: 'scripts and hotkey workflows for streaming and media production',
    href: ''
  },
  {
    tag: 'web',
    title: 'nfo site',
    desc: 'this site styled as ASCII / NFO. Serves as the "No JavaScript" version of this site.',
    href: '/nfo/'
  },
  {
    tag: 'web',
    title: 'rfc site',
    desc: 'this site styled as an RFC - the portfolio as a protocol document.',
    href: '/rfc/'
  },
  {
    tag: 'gfx',
    title: 'creative-coding sketches',
    desc: 'small WebGL / canvas experiments; several mutated into the machine behind this page.',
    href: ''
  }
]