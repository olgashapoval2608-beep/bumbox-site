/**
 * Single source of truth for every piece of editorial content on the site.
 * Facts (formation, discography years, line-up, 2022) are drawn from public
 * record. Tour dates are a representative 2026 routing — every ticket action
 * routes to the band's real ticketing platforms, and this array is the only
 * thing to edit when official dates are published.
 */

export const BAND = {
  name: "БУМБОКС",
  latin: "BOOMBOX",
  tagline: "Аналоговий сигнал",
  founded: 2004,
  city: "Київ",
  blurb:
    "Гурт, що народився у київській кухні 2004 року й виріс у голос цілого покоління. Фанк, хіп-хоп і душа — записані на одну плівку.",
} as const;

export type StreamingPlatform = {
  label: string;
  href: string;
};

/** Band-level streaming. Deezer + YouTube are the band's real destinations;
 *  Spotify / Apple use resolving search URLs so links never rot. */
export const STREAMING: StreamingPlatform[] = [
  { label: "Spotify", href: "https://open.spotify.com/search/Бумбокс" },
  { label: "Apple Music", href: "https://music.apple.com/us/search?term=Бумбокс" },
  { label: "YouTube", href: "https://www.youtube.com/user/familyboombox" },
  { label: "Deezer", href: "https://www.deezer.com/us/artist/4394817" },
];

export type Album = {
  id: string;
  title: string;
  year: number;
  kind: "Студійний" | "EP" | "Live" | "Збірка";
  cover: string;
  note: string;
  listen: string;
};

const spotifySearch = (q: string) =>
  `https://open.spotify.com/search/${encodeURIComponent("Бумбокс " + q)}`;

export const ALBUMS: Album[] = [
  {
    id: "melomania",
    title: "Меломанія",
    year: 2005,
    kind: "Студійний",
    cover: "/media/album-melomania.jpg",
    note: "Дебют, записаний за 19 годин у незалежній студії.",
    listen: spotifySearch("Меломанія"),
  },
  {
    id: "family-business",
    title: "Family Бізнес",
    year: 2006,
    kind: "Студійний",
    cover: "/media/album-family-business.jpg",
    note: "Золотий статус — понад 100 000 проданих копій.",
    listen: spotifySearch("Family Бізнес"),
  },
  {
    id: "iii",
    title: "III",
    year: 2008,
    kind: "Студійний",
    cover: "/media/album-iii.jpg",
    note: "Третій альбом, що закріпив звучання гурту.",
    listen: spotifySearch("III"),
  },
  {
    id: "vse-vklyucheno",
    title: "Все включено",
    year: 2010,
    kind: "EP",
    cover: "/media/album-vse-vklyucheno.jpg",
    note: "Мінімалістичний рок-н-рольний реліз.",
    listen: spotifySearch("Все включено"),
  },
  {
    id: "seredniy-vik",
    title: "Середній вік",
    year: 2011,
    kind: "Студійний",
    cover: "/media/album-seredniy-vik.jpg",
    note: "Стадіонна ера. Звук дорослішає.",
    listen: spotifySearch("Середній вік"),
  },
  {
    id: "terminal-b",
    title: "Термінал Б",
    year: 2013,
    kind: "Студійний",
    cover: "/media/album-terminal-b.jpg",
    note: "Дорожній альбом і великий тур.",
    listen: spotifySearch("Термінал Б"),
  },
  {
    id: "naked-king",
    title: "Голий король",
    year: 2017,
    kind: "EP",
    cover: "/media/album-naked-king.jpg",
    note: "Гострий погляд на сучасність.",
    listen: spotifySearch("Голий король"),
  },
  {
    id: "rubikon",
    title: "Таємний код: Рубікон",
    year: 2019,
    kind: "Студійний",
    cover: "/media/album-rubikon.jpg",
    note: "Записаний в Україні, Франції та США.",
    listen: spotifySearch("Рубікон"),
  },
  {
    id: "zhyvyi",
    title: "Живий",
    year: 2021,
    kind: "Live",
    cover: "/media/album-zhyvyi.jpg",
    note: "Концертний запис — енергія залу на плівці.",
    listen: spotifySearch("Живий"),
  },
];

export type Member = {
  id: string;
  surname: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
};

export const MEMBERS: Member[] = [
  {
    id: "khlyvnyuk",
    surname: "Хливнюк",
    name: "Андрій",
    role: "Вокал · Тексти",
    photo: "/media/member-khlyvnyuk.jpg",
    bio: "Голос і обличчя гурту. У 2022-му його а-капельна «Червона калина» облетіла світ і лягла в основу Hey Hey Rise Up від Pink Floyd.",
  },
  {
    id: "samoylo",
    surname: "Самойло",
    name: "Андрій",
    role: "Гітара · Співзасновник",
    photo: "/media/member-samoylo.jpg",
    bio: "Разом із Хливнюком запустив Бумбокс у київській кухні 2004 року. Архітектор раннього гітарного звучання.",
  },
  {
    id: "nevoyt",
    surname: "Невойт",
    name: "Інна",
    role: "Бас-гітара",
    photo: "/media/member-nevoyt.jpg",
    bio: "Бас, що тримає ґрув. Приєдналася до гурту 2019 року й задає нижній край звуку.",
  },
  {
    id: "lyulyakin",
    surname: "Люлякін",
    name: "Олександр",
    role: "Барабани",
    photo: "/media/member-lyulyakin.jpg",
    bio: "Пульс Бумбоксу. Тримає динаміку від інтимного клубу до стадіону.",
  },
  {
    id: "lytvynenko",
    surname: "Литвиненко",
    name: "Павло",
    role: "Клавіші",
    photo: "/media/member-lytvynenko.jpg",
    bio: "Гармонія, простір і кіношні текстури у звучанні гурту.",
  },
  {
    id: "matiyuk",
    surname: "Матіюк",
    name: "Валентин",
    role: "DJ · Семпли",
    photo: "/media/member-matiyuk.jpg",
    bio: "Платівки, семпли й електроніка наживо — фанковий фундамент гурту.",
  },
  {
    id: "levchenko",
    surname: "Левченко",
    name: "",
    role: "Гітара",
    photo: "/media/member-levchenko.jpg",
    bio: "Гітарні фактури живого звучання Бумбоксу на сцені.",
  },
];

export type TimelineEntry = {
  year: string;
  title: string;
  body: string;
  media: string;
  type: "image" | "video";
  climax?: boolean;
};

export const TIMELINE: TimelineEntry[] = [
  {
    year: "2004",
    title: "Кухня в Києві",
    body: "Андрій Хливнюк і Андрій Самойло засновують Бумбокс у орендованій квартирі. Ідея народжується за гітарою одного вечора.",
    media: "/media/history-origins.jpg",
    type: "image",
  },
  {
    year: "2005",
    title: "Меломанія",
    body: "Дебютний альбом записують за 19 годин — три студійні зміни. Старт легенди.",
    media: "/media/history-2004.jpg",
    type: "image",
  },
  {
    year: "2006",
    title: "Золото",
    body: "«Family Бізнес» стає золотим: понад 100 000 копій. Бумбокс виходить на велику сцену.",
    media: "/media/album-family-business.jpg",
    type: "image",
  },
  {
    year: "2011",
    title: "Стадіонна ера",
    body: "«Середній вік» виводить гурт на найбільші майданчики країни. Живі виступи стають видовищем.",
    media: "/media/old-performances.mp4",
    type: "video",
  },
  {
    year: "2017",
    title: "Голий король",
    body: "Гострий, чесний реліз. Бумбокс говорить про час прямо.",
    media: "/media/album-naked-king.jpg",
    type: "image",
  },
  {
    year: "2018",
    title: "Нова глава",
    body: "Самойло залишає гурт. Бумбокс перезбирається й шукає нове звучання.",
    media: "/media/history-2018.jpg",
    type: "image",
  },
  {
    year: "2019",
    title: "Рубікон",
    body: "«Таємний код: Рубікон» записують в Україні, Франції та США. Інна Невойт приходить на бас.",
    media: "/media/history-2019.jpg",
    type: "image",
  },
  {
    year: "2022",
    title: "Голос нації",
    body: "Гурт стає на захист України. А-капельна «Червона калина» Хливнюка облітає світ — Pink Floyd випускають Hey Hey Rise Up.",
    media: "/media/history-2022.jpg",
    type: "image",
    climax: true,
  },
  {
    year: "Досі",
    title: "Сигнал триває",
    body: "Бумбокс грає для світу й для України. Плівка крутиться далі.",
    media: "/media/concert-crowd.jpg",
    type: "image",
  },
];

export type Concert = {
  id: string;
  date: string; // ISO
  day: string;
  month: string;
  city: string;
  country: string;
  venue: string;
  status: "Квитки" | "Мало місць" | "Sold out";
  href: string;
};

const TICKETS_UA = "https://concert.ua/en/talent/bumboks";
const TICKETS_INTL = "https://kontramarka.ua/en/artist/bumboks";

export const TOUR_NAME = "Світовий тур · 2026";

export const CONCERTS: Concert[] = [
  {
    id: "kyiv",
    date: "2026-04-18",
    day: "18",
    month: "КВІ",
    city: "Київ",
    country: "Україна",
    venue: "Палац Спорту",
    status: "Мало місць",
    href: TICKETS_UA,
  },
  {
    id: "lviv",
    date: "2026-04-25",
    day: "25",
    month: "КВІ",
    city: "Львів",
    country: "Україна",
    venue: "Арена Львів",
    status: "Квитки",
    href: TICKETS_UA,
  },
  {
    id: "warsaw",
    date: "2026-05-09",
    day: "09",
    month: "ТРА",
    city: "Варшава",
    country: "Польща",
    venue: "COS Torwar",
    status: "Квитки",
    href: TICKETS_INTL,
  },
  {
    id: "berlin",
    date: "2026-05-16",
    day: "16",
    month: "ТРА",
    city: "Берлін",
    country: "Німеччина",
    venue: "Columbiahalle",
    status: "Квитки",
    href: TICKETS_INTL,
  },
  {
    id: "london",
    date: "2026-05-23",
    day: "23",
    month: "ТРА",
    city: "Лондон",
    country: "Велика Британія",
    venue: "O2 Forum",
    status: "Sold out",
    href: TICKETS_INTL,
  },
  {
    id: "newyork",
    date: "2026-06-06",
    day: "06",
    month: "ЧЕР",
    city: "Нью-Йорк",
    country: "США",
    venue: "Brooklyn Paramount",
    status: "Квитки",
    href: TICKETS_INTL,
  },
];

export const ALL_TICKETS = TICKETS_UA;

export type MediaItem = {
  id: string;
  title: string;
  category: "Кліпи" | "Live" | "Інтерв'ю";
  src: string;
  meta: string;
};

export const MEDIA: MediaItem[] = [
  {
    id: "lyudy",
    title: "Люди",
    category: "Кліпи",
    src: "/media/lyudy.mp4",
    meta: "Офіційне відео",
  },
  {
    id: "divka",
    title: "Дівка",
    category: "Кліпи",
    src: "/media/divka.mp4",
    meta: "Офіційне відео",
  },
  {
    id: "vocalist",
    title: "Соло вокаліста",
    category: "Live",
    src: "/media/vocalist.mp4",
    meta: "Зі сцени",
  },
  {
    id: "team-concert",
    title: "Гурт наживо",
    category: "Live",
    src: "/media/team-concert.mp4",
    meta: "Великий концерт",
  },
  {
    id: "dances",
    title: "Танці",
    category: "Live",
    src: "/media/dances.mp4",
    meta: "Енергія залу",
  },
  {
    id: "old-performances",
    title: "Ранні виступи",
    category: "Інтерв'ю",
    src: "/media/old-performances.mp4",
    meta: "З архіву",
  },
  {
    id: "old",
    title: "Архівна плівка",
    category: "Інтерв'ю",
    src: "/media/old.mp4",
    meta: "З архіву",
  },
  {
    id: "spotify",
    title: "Сесія",
    category: "Кліпи",
    src: "/media/spotify.mp4",
    meta: "Студійна сесія",
  },
];

export type GalleryItem = {
  id: string;
  src: string;
  type: "image" | "video";
  tag: "Сцена" | "Гурт" | "Архів";
  alt: string;
  /** Tile aspect for the masonry layout (also avoids layout shift). */
  ratio: "portrait" | "square" | "wide" | "cinema" | "ultra";
};

export const GALLERY: GalleryItem[] = [
  { id: "g-crowd", src: "/media/concert-crowd.jpg", type: "image", tag: "Сцена", alt: "Хливнюк перед залом у червоному світлі", ratio: "ultra" },
  { id: "g-drums", src: "/media/lyulyakin-drumsticks.jpg", type: "image", tag: "Сцена", alt: "Барабанщик Люлякін із паличками", ratio: "portrait" },
  { id: "g-group", src: "/media/band-group.jpg", type: "image", tag: "Гурт", alt: "Спільне фото гурту Бумбокс", ratio: "cinema" },
  { id: "g-concert-vid", src: "/media/concert.mp4", type: "video", tag: "Сцена", alt: "Відео з концерту", ratio: "cinema" },
  { id: "g-festival", src: "/media/concert-festival.jpg", type: "image", tag: "Сцена", alt: "Гурт на сцені на тлі стіни з бумбоксів", ratio: "wide" },
  { id: "g-2019", src: "/media/history-2019.jpg", type: "image", tag: "Сцена", alt: "Інна Невойт на басу, 2019", ratio: "portrait" },
  { id: "g-lyrics", src: "/media/lyrics-lyudy.jpg", type: "image", tag: "Архів", alt: "Рукописна графіка тексту пісні «Люди»", ratio: "ultra" },
  { id: "g-club", src: "/media/concert-club.jpg", type: "image", tag: "Архів", alt: "Ранній клубний концерт", ratio: "wide" },
  { id: "g-dances", src: "/media/dances.mp4", type: "video", tag: "Сцена", alt: "Відео: танці на концерті", ratio: "cinema" },
  { id: "g-2022", src: "/media/history-2022.jpg", type: "image", tag: "Гурт", alt: "Хливнюк у військовій формі, 2022", ratio: "wide" },
  { id: "g-origins", src: "/media/history-origins.jpg", type: "image", tag: "Архів", alt: "Ранній портрет гурту", ratio: "wide" },
  { id: "g-divka", src: "/media/divka.mp4", type: "video", tag: "Архів", alt: "Кліп: Дівка", ratio: "cinema" },
];

export const GALLERY_FILTERS = ["Всі", "Сцена", "Гурт", "Архів"] as const;

export const NAV_LINKS = [
  { id: "music", label: "Музика" },
  { id: "concerts", label: "Концерти" },
  { id: "history", label: "Історія" },
  { id: "members", label: "Гурт" },
  { id: "gallery", label: "Галерея" },
  { id: "media", label: "Медіа" },
] as const;

export const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/boombox.ua/" },
  { label: "YouTube", href: "https://www.youtube.com/user/familyboombox" },
  { label: "Facebook", href: "https://www.facebook.com/boomboxofficial/" },
  { label: "Spotify", href: "https://open.spotify.com/search/Бумбокс" },
];
