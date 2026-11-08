import type { Project, ProjectMedia } from './types';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PROJECTS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Order here = order on the site. `featured: true` → large sticky card;
 *  the rest appear in the compact "More projects" index below the cards.
 *
 *  Real screenshots are prepared from media/originals/ by `npm run media`
 *  (crops are defined in scripts/prepare-media.mjs). Projects without
 *  screenshots use generated placeholder visuals (`npm run covers`); to replace
 *  one, add an image and set `placeholder: false`.
 *
 *  The last six entries were drafted from workspace notes — review them and
 *  delete anything you don't want to show.
 */

function art(slug: string, name: string): ProjectMedia {
  return { src: `/projects/${slug}/${name}.svg`, width: 1600, height: 1000, placeholder: true };
}

function shot(slug: string, name: string, width: number, height: number): ProjectMedia {
  return { src: `/projects/${slug}/${name}.jpg`, width, height, placeholder: false };
}

export const projects: Project[] = [
  {
    slug: 'pbc-game',
    year: '2026',
    status: 'live',
    featured: true,
    stack: ['Python', 'FastAPI', 'WebSockets', 'JavaScript', 'three.js', 'React Native'],
    links: {},
    cover: { ...shot('pbc-game', 'cover', 2400, 1500), position: '70% 60%' },
    gallery: [shot('pbc-game', 'detail-a', 1600, 1201), shot('pbc-game', 'detail-b', 1600, 1200)],
    copy: {
      en: {
        title: 'PBC Game',
        tagline: 'An online gaming platform with poker, chess, backgammon and checkers — built from the ground up.',
        category: 'Online gaming platform',
        role: 'Full-stack development from scratch',
        summary:
          'PBC Game is a full-featured online gaming platform with a diverse collection of games: several poker variants, Chinese poker, chess, backgammon and checkers. It was built around seamless gameplay, an intuitive interface and an architecture that scales.',
        challenge:
          'Multiplayer games are unforgiving: every move has to reach every player instantly, rules must be enforced on the server, and tables, tournaments and balances have to stay consistent under load — while the interface stays simple enough for casual players.',
        approach:
          'The backend runs on Python with FastAPI and native WebSockets, so game state lives on the server and every table updates in real time. The browser client is built with modern JavaScript modules, chess is rendered in 3D with three.js and compressed models, and an admin panel manages players, games and bots. The same platform ships as Android and Windows apps from a single React Native project.',
        outcome:
          'A live platform with real-time tables, tournaments, promotions, rewards and a referral programme, demo and real balances, a multilingual interface and native apps.',
        highlights: [
          { title: 'Real-time multiplayer', text: 'Server-authoritative game logic over WebSockets keeps every table in sync.' },
          { title: 'Many games, one platform', text: 'Poker, Chinese poker, chess, backgammon and checkers share accounts, balances, tables and tournaments.' },
          { title: '3D chess', text: 'Board and pieces rendered with three.js, with compressed models for fast loading.' },
          { title: 'Bots and native apps', text: 'Bots keep tables alive when few players are online, and the platform is packaged for Android and Windows.' },
        ],
        coverAlt: 'PBC Game home screen with live poker tables, a tournament banner and game categories',
      },
      ru: {
        title: 'PBC Game',
        tagline: 'Игровая онлайн-платформа с покером, шахматами, нардами и шашками — с нуля.',
        category: 'Игровая онлайн-платформа',
        role: 'Full-stack разработка с нуля',
        summary:
          'PBC Game — полноценная игровая онлайн-платформа с большим набором игр: несколько видов покера, китайский покер, шахматы, нарды и шашки. В основе — плавный игровой процесс, понятный интерфейс и архитектура, рассчитанная на рост.',
        challenge:
          'Многопользовательские игры не прощают ошибок: каждый ход должен мгновенно доходить до всех игроков, правила — проверяться на сервере, а столы, турниры и балансы — оставаться согласованными под нагрузкой. И всё это при интерфейсе, понятном даже случайному игроку.',
        approach:
          'Бэкенд на Python и FastAPI с нативными WebSocket: состояние игры живёт на сервере, и каждый стол обновляется в реальном времени. Клиент написан на современных JavaScript-модулях, шахматы отрисованы в 3D на three.js со сжатыми моделями, а админ-панель управляет игроками, играми и ботами. Та же платформа выходит приложениями для Android и Windows из одного проекта на React Native.',
        outcome:
          'Работающая платформа: столы в реальном времени, турниры, акции, награды и партнёрская программа, демо- и реальный баланс, многоязычный интерфейс и нативные приложения.',
        highlights: [
          { title: 'Мультиплеер в реальном времени', text: 'Игровая логика на сервере и WebSocket держат все столы в синхроне.' },
          { title: 'Много игр — одна платформа', text: 'Покер, китайский покер, шахматы, нарды и шашки используют общие аккаунты, балансы, столы и турниры.' },
          { title: '3D-шахматы', text: 'Доска и фигуры на three.js со сжатыми моделями для быстрой загрузки.' },
          { title: 'Боты и приложения', text: 'Боты поддерживают жизнь за столами, когда игроков мало, а платформа упакована в приложения для Android и Windows.' },
        ],
        coverAlt: 'Главный экран PBC Game: живые покерные столы, баннер турниров и категории игр',
      },
    },
  },
  {
    slug: 'pro-casino',
    status: 'client',
    featured: true,
    // TODO(you): add the technologies used, e.g. ['React', 'Node.js', 'PostgreSQL'].
    stack: [],
    links: {},
    cover: { ...shot('pro-casino', 'cover', 2400, 1500), position: '78% 50%' },
    gallery: [shot('pro-casino', 'detail-a', 1600, 1200)],
    copy: {
      en: {
        title: 'PRO Casino',
        tagline: 'A betting web app with live and pre-match markets, built end to end.',
        category: 'Betting platform · Custom web app',
        role: 'Full-stack development, full cycle',
        summary:
          'A custom web application for a betting platform, where users place bets and follow statistics. I was responsible for the full development cycle and built both the frontend and the backend from scratch.',
        challenge:
          'Matches and odds change constantly, and on a phone the whole flow — finding a match, choosing a market, confirming a bet — has to stay fast and readable on a small screen.',
        approach:
          'A mobile-first interface organised around the way people actually bet: pre-match and live tabs, popular leagues with counters, advanced filters, favourites and a bet slip, with the wallet and profile one tap away. Behind it, a backend handles matches, markets, bets and balances.',
        outcome: 'A complete product delivered from scratch: match listings with 1×2 markets, a live section, league filters, favourites, bet slip, wallet and user profile.',
        highlights: [
          { title: 'Mobile-first', text: 'Built for one-handed use, with bottom navigation and generous tap targets.' },
          { title: 'Live and pre-match', text: 'Separate flows for upcoming events and matches in progress.' },
          { title: 'Fast discovery', text: 'Popular leagues, counters and advanced filters get users to a market in a couple of taps.' },
          { title: 'Full ownership', text: 'Frontend, backend and data model designed and built by one developer.' },
        ],
        coverAlt: 'PRO Casino mobile interface with football matches, league filters and 1×2 odds',
      },
      ru: {
        title: 'PRO Casino',
        tagline: 'Веб-приложение для ставок с live и прематчем — от начала до конца.',
        category: 'Платформа ставок · Заказная разработка',
        role: 'Full-stack разработка, полный цикл',
        summary:
          'Заказное веб-приложение для платформы ставок: пользователи делают ставки и смотрят статистику. Я отвечал за весь цикл разработки и написал с нуля и фронтенд, и бэкенд.',
        challenge:
          'Матчи и коэффициенты постоянно меняются, а на телефоне весь путь — найти матч, выбрать исход, подтвердить ставку — должен оставаться быстрым и читаемым на маленьком экране.',
        approach:
          'Интерфейс в первую очередь под телефон и под то, как люди на самом деле делают ставки: вкладки «Прематч» и «Live», популярные лиги со счётчиками, расширенные фильтры, избранное и купон, а кошелёк и профиль — в одно касание. За ним — бэкенд, который ведёт матчи, рынки, ставки и балансы.',
        outcome: 'Готовый продукт с нуля: списки матчей с рынками 1×2, live-раздел, фильтры по лигам, избранное, купон ставок, кошелёк и профиль пользователя.',
        highlights: [
          { title: 'Mobile-first', text: 'Рассчитан на управление одной рукой: нижняя навигация и крупные зоны нажатия.' },
          { title: 'Live и прематч', text: 'Отдельные сценарии для будущих событий и матчей, которые идут прямо сейчас.' },
          { title: 'Быстрый поиск', text: 'Популярные лиги, счётчики и расширенные фильтры приводят к нужному рынку за пару касаний.' },
          { title: 'Полная ответственность', text: 'Фронтенд, бэкенд и модель данных спроектированы и написаны одним разработчиком.' },
        ],
        coverAlt: 'Мобильный интерфейс PRO Casino: футбольные матчи, фильтры по лигам и коэффициенты 1×2',
      },
    },
  },
  {
    slug: 'contentbuilder-ai',
    status: 'commercial',
    featured: true,
    stack: ['React', 'Next.js', 'TypeScript', 'AI APIs', 'Docker', 'Cursor', 'GitHub Copilot'],
    links: {},
    cover: { ...shot('contentbuilder-ai', 'cover', 2400, 1499), position: '70% 60%' },
    gallery: [shot('contentbuilder-ai', 'detail-a', 1600, 1200)],
    copy: {
      en: {
        title: 'ContentBuilder AI',
        tagline: 'An AI studio that turns an idea into a ready-to-launch course.',
        category: 'AI SaaS · Smart Expert (USA)',
        role: 'Frontend developer — React, TypeScript, Next.js',
        summary:
          'ContentBuilder is an AI-powered content creation platform from a San Francisco startup: courses, presentations, quizzes, video lessons and one-pagers generated from a single idea. I worked on it remotely as part of Smart Expert’s international team.',
        challenge:
          'An AI product lives or dies by its interface: long-running generations and many content formats have to feel simple — and the codebase has to keep pace with a fast-moving startup roadmap.',
        approach:
          'I developed and maintained user interfaces with React and TypeScript in a production Next.js application, contributed to the frontend architecture and complex interactive features, and integrated AI-powered functionality and backend APIs. Docker-based workflows and AI tools such as Cursor and GitHub Copilot kept delivery fast without trading off quality.',
        outcome: 'Features shipped to production in a commercial AI SaaS, built in close collaboration with a distributed team in the US.',
        highlights: [
          { title: 'Production Next.js', text: 'Day-to-day work in a live commercial codebase, not a prototype.' },
          { title: 'AI integrations', text: 'Interfaces connected to AI generation features and backend APIs.' },
          { title: 'Complex interactive features', text: 'Rich, multi-step interfaces for creating several content formats.' },
          { title: 'Remote collaboration', text: 'Working with an international team through async communication and code review.' },
        ],
        coverAlt: 'ContentBuilder landing page: “From idea to live course — all in one place”',
      },
      ru: {
        title: 'ContentBuilder AI',
        tagline: 'AI-студия, которая превращает идею в готовый к запуску курс.',
        category: 'AI SaaS · Smart Expert (США)',
        role: 'Frontend-разработчик — React, TypeScript, Next.js',
        summary:
          'ContentBuilder — платформа для создания контента с помощью ИИ от стартапа из Сан-Франциско: курсы, презентации, тесты, видеоуроки и одностраничники из одной идеи. Я работал над ней удалённо в международной команде Smart Expert.',
        challenge:
          'AI-продукт держится на интерфейсе: долгие генерации и множество форматов должны ощущаться простыми, а код — поспевать за быстрым роадмапом стартапа.',
        approach:
          'Разрабатывал и поддерживал интерфейсы на React и TypeScript в продакшен-приложении на Next.js, участвовал в построении фронтенд-архитектуры и сложных интерактивных функций, интегрировал AI-функциональность и бэкенд-API. Процессы на Docker и AI-инструменты вроде Cursor и GitHub Copilot помогали двигаться быстро без потери качества.',
        outcome: 'Функции в продакшене коммерческого AI SaaS — в тесной работе с распределённой командой из США.',
        highlights: [
          { title: 'Продакшен на Next.js', text: 'Ежедневная работа в живой коммерческой кодовой базе, а не в прототипе.' },
          { title: 'AI-интеграции', text: 'Интерфейсы, подключённые к функциям AI-генерации и бэкенд-API.' },
          { title: 'Сложные интерактивные функции', text: 'Насыщенные многошаговые интерфейсы для создания разных форматов контента.' },
          { title: 'Удалённая работа в команде', text: 'Работа с международной командой через асинхронную коммуникацию и код-ревью.' },
        ],
        coverAlt: 'Лендинг ContentBuilder: «From idea to live course — all in one place»',
      },
    },
  },
  {
    slug: 'worlddrop',
    year: '2026',
    status: 'live',
    featured: true,
    stack: ['Next.js', 'React Three Fiber', 'three.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'GLSL'],
    links: { live: 'https://worlddrop.world' },
    cover: art('worlddrop', 'cover'),
    gallery: [art('worlddrop', 'detail-a'), art('worlddrop', 'detail-b')],
    copy: {
      en: {
        title: 'WorldDrop',
        tagline: 'A link-in-bio page, reimagined as a personal 3D room.',
        category: 'Interactive 3D platform',
        role: 'Product design & full-stack development',
        summary:
          'WorldDrop replaces the familiar list of links with an explorable 3D room. Links, documents, videos and music live inside objects — visitors discover them by looking around.',
        challenge:
          'Make a real-time 3D scene feel as instant and dependable as a plain web page: fast on phones, editable by non-technical people and publishable at a public URL.',
        approach:
          'A Next.js app with a React Three Fiber scene and a complete room editor. Furniture is generated procedurally from a shared kit, so hundreds of models stay light and stylistically consistent. Shaders compile in the background before the scene appears, and rendering quality adapts to the device.',
        outcome:
          'A public product with accounts, a room editor, a catalog of 400+ procedural models, an interface in 10 languages and stylised 3D pets generated from a photo.',
        highlights: [
          { title: 'Procedural model pipeline', text: 'Every piece of furniture is built in code from a common kit and exported to optimised GLB files with thumbnails.' },
          { title: 'Shader warm-up', text: 'GPU programs compile before the first frame, so opening a room doesn’t stall on mobile devices.' },
          { title: '3D pets from a photo', text: 'In-browser breed detection and colour extraction drive a signed-distance-field body with fur, outfits and a skeletal rig.' },
          { title: 'Pluggable backend', text: 'Runs on zero-config SQLite locally and on Supabase in production, behind one interface.' },
        ],
        coverAlt: 'Abstract wireframe of an isometric room with floating objects — placeholder visual for WorldDrop',
      },
      ru: {
        title: 'WorldDrop',
        tagline: 'Страница со ссылками, переосмысленная как личная 3D-комната.',
        category: 'Интерактивная 3D-платформа',
        role: 'Дизайн продукта и full-stack разработка',
        summary:
          'WorldDrop заменяет привычный список ссылок трёхмерной комнатой, которую можно исследовать. Ссылки, документы, видео и музыка спрятаны в предметах — посетитель находит их, осматриваясь вокруг.',
        challenge:
          'Сделать так, чтобы 3D-сцена в реальном времени открывалась так же быстро и надёжно, как обычная страница: работала на телефонах, редактировалась без технических знаний и публиковалась по открытой ссылке.',
        approach:
          'Приложение на Next.js со сценой на React Three Fiber и полноценным редактором комнаты. Мебель генерируется процедурно из общего набора деталей, поэтому сотни моделей остаются лёгкими и выдержанными в одном стиле. Шейдеры компилируются в фоне ещё до появления сцены, а качество картинки подстраивается под устройство.',
        outcome:
          'Публичный продукт с аккаунтами, редактором комнаты, каталогом из 400+ процедурных моделей, интерфейсом на 10 языках и стилизованными 3D-питомцами по фотографии.',
        highlights: [
          { title: 'Процедурные модели', text: 'Каждый предмет мебели собирается в коде из общего набора деталей и экспортируется в оптимизированный GLB с превью.' },
          { title: 'Прогрев шейдеров', text: 'GPU-программы компилируются до первого кадра, поэтому комната открывается без подвисаний даже на телефоне.' },
          { title: '3D-питомцы по фото', text: 'Порода и окрас определяются прямо в браузере, а тело строится из SDF — с шерстью, одеждой и скелетной анимацией.' },
          { title: 'Сменный бэкенд', text: 'Локально работает на SQLite без настройки, в продакшене — на Supabase, за одним и тем же интерфейсом.' },
        ],
        coverAlt: 'Абстрактный каркас изометрической комнаты с парящими предметами — временная иллюстрация WorldDrop',
      },
    },
  },
  {
    slug: 'clickshield',
    year: '2026',
    status: 'mvp',
    featured: false,
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Edge Middleware', 'Tailwind CSS'],
    links: {},
    cover: art('clickshield', 'cover'),
    gallery: [art('clickshield', 'detail-a'), art('clickshield', 'detail-b')],
    copy: {
      en: {
        title: 'ClickShield',
        tagline: 'Protected links that keep bots out of paid traffic.',
        category: 'SaaS · Ad-traffic protection',
        role: 'Full-stack development & UI design',
        summary:
          'ClickShield issues protected short links for ad campaigns. Every click is scored at the edge: people continue to the destination, suspected bots are routed to a decoy page.',
        challenge:
          'Decide on every click within milliseconds, before any page renders and without a noticeable redirect delay — and give marketers a clear view of what was filtered out.',
        approach:
          'Edge middleware scores each request using headers, data-centre IP ranges and burst patterns, then resolves the link and records the visit in a single Postgres RPC. A Supabase-backed dashboard shows links and traffic, next to a trilingual marketing site.',
        outcome:
          'A working MVP with link management, edge bot filtering, click tracking, Google sign-in and a landing page in English, Russian and Ukrainian.',
        highlights: [
          { title: 'Edge scoring', text: 'Bot detection runs in middleware, before the application renders anything.' },
          { title: 'Single round-trip', text: 'Resolving a link and tracking the click happen in one database call.' },
          { title: 'Honeypot routing', text: 'Suspicious traffic lands on a decoy instead of the real destination.' },
          { title: 'Localised SEO', text: 'Separate landing routes per language with hreflang and localised metadata.' },
        ],
        coverAlt: 'A field of dots passing through a vertical filter line, a few diverted away — placeholder visual for ClickShield',
      },
      ru: {
        title: 'ClickShield',
        tagline: 'Защищённые ссылки, которые не пускают ботов в платный трафик.',
        category: 'SaaS · Защита рекламного трафика',
        role: 'Full-stack разработка и UI-дизайн',
        summary:
          'ClickShield выдаёт защищённые короткие ссылки для рекламных кампаний. Каждый клик оценивается на edge: люди попадают на целевую страницу, подозрительные боты — на страницу-приманку.',
        challenge:
          'Принимать решение по каждому клику за миллисекунды — ещё до рендера страницы и без заметной задержки редиректа — и наглядно показывать маркетологу, что было отфильтровано.',
        approach:
          'Edge-middleware оценивает запрос по заголовкам, диапазонам IP дата-центров и всплескам активности, а затем одним RPC-вызовом в Postgres находит ссылку и записывает визит. Дашборд на Supabase показывает ссылки и трафик, маркетинговый сайт работает на трёх языках.',
        outcome:
          'Рабочий MVP: управление ссылками, фильтрация ботов на edge, учёт кликов, вход через Google и лендинг на английском, русском и украинском.',
        highlights: [
          { title: 'Оценка на edge', text: 'Детекция ботов работает в middleware — до того, как приложение что-либо отрисует.' },
          { title: 'Один запрос к базе', text: 'Поиск ссылки и запись клика выполняются одним вызовом базы данных.' },
          { title: 'Маршрут в ловушку', text: 'Подозрительный трафик попадает на приманку, а не на реальную страницу.' },
          { title: 'Локализованное SEO', text: 'Отдельные языковые версии лендинга с hreflang и собственными метаданными.' },
        ],
        coverAlt: 'Поле точек проходит сквозь вертикальную линию-фильтр, часть отводится в сторону — временная иллюстрация ClickShield',
      },
    },
  },
  {
    slug: 'krevoo',
    year: '2026',
    status: 'mvp',
    featured: false,
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Radix UI', 'Zod', 'Playwright'],
    links: {},
    cover: art('krevoo', 'cover'),
    gallery: [art('krevoo', 'detail-a'), art('krevoo', 'detail-b')],
    copy: {
      en: {
        title: 'Krevoo',
        tagline: 'A social network built for AI creators.',
        category: 'Social platform',
        role: 'Full-stack development',
        summary:
          'Krevoo is a home for people who create with AI: project showcases, posts, a feed, profiles, discovery, direct messages and work requests.',
        challenge:
          'Ship a broad social product quickly without compromising data security — every table had to be safe to query straight from the browser.',
        approach:
          'Next.js on the front, Supabase (Postgres, Storage, Auth) underneath, with row-level security policies on every table. Migrations and policies run inside an embedded PGlite database during unit tests, and Playwright covers the main user journeys.',
        outcome:
          'An MVP with the complete social loop — onboarding, publishing, feed, messaging and requests — verified by end-to-end tests against a live database.',
        highlights: [
          { title: 'Security in the database', text: 'Row-level security policies are the access layer itself, not an afterthought.' },
          { title: 'Policies under test', text: 'RLS rules execute inside PGlite on every test run.' },
          { title: 'End-to-end coverage', text: 'Playwright scenarios walk through the key user journeys on a real backend.' },
          { title: 'Typed forms', text: 'React Hook Form and Zod share schemas between client validation and server logic.' },
        ],
        coverAlt: 'Nodes connected by fine lines on concentric orbits — placeholder visual for Krevoo',
      },
      ru: {
        title: 'Krevoo',
        tagline: 'Социальная сеть для тех, кто создаёт с помощью ИИ.',
        category: 'Социальная платформа',
        role: 'Full-stack разработка',
        summary:
          'Krevoo — место для авторов, которые работают с ИИ: витрины проектов, посты, лента, профили, поиск, личные сообщения и запросы на работу.',
        challenge:
          'Быстро запустить большой социальный продукт, не жертвуя безопасностью данных: к каждой таблице должно быть безопасно обращаться прямо из браузера.',
        approach:
          'Фронтенд на Next.js, под ним Supabase (Postgres, Storage, Auth) с политиками row-level security на каждой таблице. В юнит-тестах миграции и политики выполняются во встроенной базе PGlite, а основные пользовательские сценарии покрыты Playwright.',
        outcome:
          'MVP с полным социальным циклом — онбординг, публикации, лента, сообщения и запросы, — проверенный сквозными тестами на живой базе.',
        highlights: [
          { title: 'Безопасность в базе', text: 'Политики RLS — это и есть слой доступа, а не надстройка сверху.' },
          { title: 'Политики под тестами', text: 'Правила RLS выполняются в PGlite при каждом прогоне тестов.' },
          { title: 'Сквозные тесты', text: 'Сценарии Playwright проходят ключевые пути пользователя на реальном бэкенде.' },
          { title: 'Типизированные формы', text: 'React Hook Form и Zod используют общие схемы на клиенте и на сервере.' },
        ],
        coverAlt: 'Узлы, соединённые тонкими линиями на концентрических орбитах, — временная иллюстрация Krevoo',
      },
    },
  },
  {
    slug: 'viratext',
    year: '2026',
    status: 'mvp',
    featured: false,
    stack: ['Next.js', 'TypeScript', 'Auth.js', 'SQLite', 'Whisper', 'Groq', 'Tailwind CSS'],
    links: {},
    cover: art('viratext', 'cover'),
    gallery: [art('viratext', 'detail-a'), art('viratext', 'detail-b')],
    copy: {
      en: {
        title: 'ViraText',
        tagline: 'Short-form video in, SEO-ready article out.',
        category: 'SaaS · AI content',
        role: 'Full-stack development',
        summary:
          'ViraText turns TikTok, YouTube Shorts and Reels links into structured, search-friendly articles — transcription, writing and formatting in a single flow.',
        challenge:
          'Chain speech recognition and language models into a pipeline that is fast, affordable and still usable before any API keys are configured.',
        approach:
          'Audio is transcribed with Whisper and rewritten into an article by Llama 3.3 70B on Groq. Authentication uses Auth.js with credentials and Google, data lives in zero-config SQLite, and every external service falls back to realistic mocks in development.',
        outcome: 'An MVP with sign-up, a generation pipeline, an article library and a responsive dashboard with a mobile drawer.',
        highlights: [
          { title: 'Two-stage AI pipeline', text: 'Speech-to-text and long-form generation are separate, swappable steps.' },
          { title: 'Zero-config data', text: 'SQLite tables are created automatically — nothing to set up before the first run.' },
          { title: 'Graceful degradation', text: 'Without API keys the whole product still works end to end on mocks.' },
          { title: 'App-grade dashboard', text: 'A full-screen workspace that turns into drawer navigation on phones.' },
        ],
        coverAlt: 'Audio waveform bars gradually turning into lines of text — placeholder visual for ViraText',
      },
      ru: {
        title: 'ViraText',
        tagline: 'На входе — короткое видео, на выходе — готовая SEO-статья.',
        category: 'SaaS · AI-контент',
        role: 'Full-stack разработка',
        summary:
          'ViraText превращает ссылки на TikTok, YouTube Shorts и Reels в структурированные статьи, оптимизированные под поиск: расшифровка, текст и оформление — в одном потоке.',
        challenge:
          'Связать распознавание речи и языковые модели в конвейер, который работает быстро, стоит недорого и остаётся рабочим, даже пока API-ключи не настроены.',
        approach:
          'Аудио расшифровывает Whisper, а статью пишет Llama 3.3 70B через Groq. Авторизация — Auth.js с паролем и Google, данные хранятся в SQLite без настройки, а все внешние сервисы в разработке подменяются реалистичными моками.',
        outcome: 'MVP с регистрацией, конвейером генерации, библиотекой статей и адаптивным дашбордом с мобильным меню.',
        highlights: [
          { title: 'Двухэтапный AI-конвейер', text: 'Распознавание речи и генерация текста — отдельные заменяемые шаги.' },
          { title: 'Данные без настройки', text: 'Таблицы SQLite создаются автоматически — перед первым запуском ничего настраивать не нужно.' },
          { title: 'Плавная деградация', text: 'Без API-ключей продукт целиком работает на моках.' },
          { title: 'Дашборд уровня приложения', text: 'Полноэкранное рабочее пространство, которое на телефоне превращается в выдвижное меню.' },
        ],
        coverAlt: 'Звуковая волна постепенно превращается в строки текста — временная иллюстрация ViraText',
      },
    },
  },
  {
    slug: 'catalogflow',
    year: '2026',
    status: 'mvp',
    featured: false,
    stack: ['Next.js', 'TypeScript', 'Node.js', 'SQLite', 'XLSX'],
    links: {},
    cover: art('catalogflow', 'cover'),
    gallery: [art('catalogflow', 'detail-a'), art('catalogflow', 'detail-b')],
    copy: {
      en: {
        title: 'CatalogFlow',
        tagline: 'Supplier price lists, ready for any marketplace.',
        category: 'B2B SaaS · E-commerce tooling',
        role: 'Full-stack development',
        summary:
          'CatalogFlow takes a supplier’s XLSX or CSV price list, applies pricing rules and filters, and exports a file that matches the exact template of the chosen marketplace.',
        challenge:
          'Every marketplace expects a different format and every supplier file is messy in its own way. Adding a new marketplace must not mean touching the rest of the system.',
        approach:
          'Marketplaces are independent modules registered in a single list, so a new integration is one file. The backend runs on Node’s built-in SQLite with hand-written scrypt authentication, and access is granted per client through an approval flow in the admin panel.',
        outcome: 'A working product with uploads, pricing rules, marketplace exports, approval-based accounts and an admin dashboard.',
        highlights: [
          { title: 'Modular integrations', text: 'One module per marketplace; the core never changes.' },
          { title: 'Rules engine', text: 'Mark-ups, rounding and filters applied consistently across the entire price list.' },
          { title: 'Minimal dependencies', text: 'Built-in node:sqlite and node:crypto — no ORM, no auth library.' },
          { title: 'Approval flow', text: 'New accounts wait for manual approval, matching how the product is sold.' },
        ],
        coverAlt: 'A grid of table cells flowing into an ordered template — placeholder visual for CatalogFlow',
      },
      ru: {
        title: 'CatalogFlow',
        tagline: 'Прайсы поставщиков — в формате любого маркетплейса.',
        category: 'B2B SaaS · Инструменты для e-commerce',
        role: 'Full-stack разработка',
        summary:
          'CatalogFlow принимает прайс поставщика в XLSX или CSV, применяет правила цен и фильтры и выгружает файл точно по шаблону выбранного маркетплейса.',
        challenge:
          'Каждый маркетплейс ждёт свой формат, а каждый файл поставщика неаккуратен по-своему. Подключение новой площадки не должно затрагивать остальную систему.',
        approach:
          'Маркетплейсы — независимые модули, зарегистрированные в одном списке, поэтому новая интеграция — это один файл. Бэкенд работает на встроенном в Node SQLite с собственной авторизацией на scrypt, а доступ каждому клиенту выдаётся через одобрение в админке.',
        outcome: 'Рабочий продукт: загрузка прайсов, правила цен, выгрузки под маркетплейсы, аккаунты с одобрением и панель администратора.',
        highlights: [
          { title: 'Модульные интеграции', text: 'Один модуль на площадку — ядро не меняется.' },
          { title: 'Движок правил', text: 'Наценки, округление и фильтры применяются одинаково ко всему прайсу.' },
          { title: 'Минимум зависимостей', text: 'Встроенные node:sqlite и node:crypto — без ORM и библиотек авторизации.' },
          { title: 'Доступ по одобрению', text: 'Новые аккаунты ждут ручного подтверждения — так же, как продаётся продукт.' },
        ],
        coverAlt: 'Сетка ячеек таблицы перетекает в упорядоченный шаблон — временная иллюстрация CatalogFlow',
      },
    },
  },
  {
    slug: 'halfknives',
    year: '2026',
    status: 'in-development',
    featured: false,
    stack: ['TypeScript', 'three.js', 'GLSL', 'Vite'],
    links: {},
    cover: art('halfknives', 'cover'),
    gallery: [art('halfknives', 'detail-a'), art('halfknives', 'detail-b')],
    copy: {
      en: {
        title: 'HalfKnives',
        tagline: 'A dark-fantasy action game that runs in the browser.',
        category: 'Real-time 3D · R&D',
        role: 'Concept, engineering & technical art',
        summary:
          'HalfKnives is a souls-like prototype: a lone knight against waves of enemies in a sunset square overgrown with tall grass. Every model and animation is generated in code.',
        challenge: 'Reach a cinematic look and believable motion without downloaded models or animation clips — and keep it smooth inside a browser tab.',
        approach:
          'The knight is assembled from primitives and animated procedurally: leg IK, a step phase driven by distance travelled, rolls and jumps. The cloak is a Verlet simulation, the grass wraps around the camera in a vertex shader, and a custom grading pass (ACES, split-toning, grain) sets the mood.',
        outcome:
          'A playable first location that demonstrates real-time graphics, procedural animation and shader work. Combat and enemy AI come next.',
        highlights: [
          { title: 'Procedural animation', text: 'Inverse kinematics and gait phases instead of keyframed clips.' },
          { title: 'Verlet cloth', text: 'A particle-based cloak that reacts to every movement.' },
          { title: 'Shader grass', text: 'A field of grass that follows the camera, entirely on the GPU.' },
          { title: 'Film grading', text: 'ACES tone mapping with split-toning and grain for a cinematic image.' },
        ],
        coverAlt: 'Tall grass strokes against a low sun on the horizon — placeholder visual for HalfKnives',
      },
      ru: {
        title: 'HalfKnives',
        tagline: 'Экшен в мрачном фэнтези-мире — прямо в браузере.',
        category: '3D в реальном времени · R&D',
        role: 'Концепция, разработка и tech art',
        summary:
          'HalfKnives — прототип в духе souls-like: одинокий рыцарь против волн врагов на закатной площади, заросшей высокой травой. Все модели и анимации генерируются кодом.',
        challenge:
          'Добиться кинематографичной картинки и правдоподобного движения без скачанных моделей и готовых анимаций — и сохранить плавность во вкладке браузера.',
        approach:
          'Рыцарь собран из примитивов и анимирован процедурно: IK ног, фаза шага по пройденному пути, кувырки и прыжки. Плащ — симуляция частиц Верле, трава «оборачивается» вокруг камеры в вершинном шейдере, а собственный грейдинг (ACES, сплит-тонирование, зерно) задаёт настроение.',
        outcome:
          'Играбельная первая локация, которая показывает графику в реальном времени, процедурную анимацию и работу с шейдерами. Следующий этап — бой и ИИ противников.',
        highlights: [
          { title: 'Процедурная анимация', text: 'Инверсная кинематика и фазы походки вместо ключевых кадров.' },
          { title: 'Ткань на Верле', text: 'Плащ из частиц реагирует на каждое движение.' },
          { title: 'Трава в шейдере', text: 'Поле травы следует за камерой — целиком на GPU.' },
          { title: 'Кинограйдинг', text: 'Тонмаппинг ACES со сплит-тонированием и зерном.' },
        ],
        coverAlt: 'Штрихи высокой травы на фоне низкого солнца у горизонта — временная иллюстрация HalfKnives',
      },
    },
  },

  // ── Template for a project whose details aren't ready yet ──────────────────
  // {
  //   slug: 'project-name',
  //   year: '2026',
  //   status: 'placeholder',
  //   featured: false,
  //   stack: ['Next.js', 'TypeScript'],
  //   links: {},
  //   cover: art('project-name', 'cover'),
  //   gallery: [],
  //   copy: {
  //     en: { title: '[Project name]', tagline: '[One-line description]', category: '[Category]', role: '[Your role]',
  //           summary: '[Summary]', challenge: '[Challenge]', approach: '[Approach]', outcome: '[Outcome]',
  //           highlights: [], coverAlt: '[Describe the cover image]' },
  //     ru: { ... },
  //   },
  // },
];
