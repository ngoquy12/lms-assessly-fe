export const APP_CONFIG = {
    NAME: "LMS Assessly",
    DESCRIPTION: "Hệ thống khảo thí và đánh giá năng lực",
    ORGANIZATION: "Assessly",
    ACCESS_TOKEN_KEY: "assessly_access_token",
    /** One-time banner on /login after flows that force re-auth (e.g. change password). */
    AUTH_LOGIN_NOTICE_KEY: "assessly_auth_login_notice",
    DEFAULT_LOCALE: "vi",
    CONTACT_EMAIL: "support@assessly.local",
    DATE_FORMAT_DISPLAY: "dd/MM/yyyy",
} as const;

/**
 * Icon sizes from design tokens
 */
export const ICON_SIZES = {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 20,
    XL: 24,
    XXL: 40,
} as const;

/**
 * Icon colors from design tokens
 * These values match CSS variables in src/styles/theme.css
 */
export const ICON_COLORS = {
    WHITE: "#ffffff",
    GRAY_400: "#64748b",
    GRAY_500: "#475569",
    GRAY_300: "#94a3b8",
    GRAY_600: "#334155",
    GRAY_700: "#1E293B",
    GRAY_800: "#0F172A",
    BRAND_50: "#ECEDFB",
    BRAND_400: "#6C72E0",
    BRAND_500: "#4B51C4",
    BRAND_600: "#363C97",
    NAV_100: "#CBCEF3",
    NAV_200: "#C0C4EF",
    NAV_300: "#B7BCEC",
    NAV_400: "#9AA0DC",
    NAV_500: "#454A72",
    NAV_700: "#30334D",
    GOLD_50: "#F8EED6",
    GOLD_100: "#F4D68A",
    GOLD_500: "#CE9A38",
    GOLD_600: "#A97A1F",
    GOLD_INK: "#4a2f00",
    CREAM: "#F6F7FC",
    INK: "#20233A",
    MUTED: "#5B6070",
    LINE: "#E6E8F2",
    AI_400: "#2E8FBE",
    AI_500: "#1B6CA8",
    AI_600: "#14567F",
    BLUE_25: "#F5F6FF",
    BLUE_400: "#4C59D9",
    BLUE_LIGHT_50: "#F0F9FF",
    BLUE_LIGHT_700: "#026AA2",
    SUCCESS_50: "#E3F1E8",
    SUCCESS_500: "#3E8E5A",
    SUCCESS_700: "#027A48",
    PINK_50: "#FDF2FA",
    PINK_700: "#C11574",
    WARNING_50: "#FBEED8",
    WARNING_500: "#CF8A2C",
    WARNING_700: "#B54708",
    ERROR_50: "#FBE5E2",
    ERROR_700: "#B42318",
    ERROR_500: "#C0392B",
    RED_500: "#C0392B",
    GREEN_500: "#3E8E5A",

    // Textarea resize handle colors
    GRAY_NEUTRAL_300: "#D2D5DA",
    GRAY_NEUTRAL_700: "#38404A",
    BLACK: "#000000",

    // Theme 400 Colors
    ERROR_400: "#F97066",
    RED_400: "#F97066",
    WARNING_400: "#FDB022",
    SUCCESS_400: "#32D583",
    GREEN_400: "#32D583",
    TEAL_400: "#2ED3B7",
    INDIGO_400: "#8098F9",
    PURPLE_400: "#9B8AFB",
    PINK_400: "#F670C7",
    ORANGE_400: "#F38744",

    AMBER_500: "#CF8A2C",
    AMBER_50: "#FBEED8",
    BLUE_500: "#1B6CA8",
    BLUE_50: "#EFF6FF",
    RED_600: "#DC2626",
    RED_50: "#FBE5E2",
    GREEN_600: "#16A34A",
    GRAY_100: "#F2F4F7",
    GRAY_100_SLATE: "#E2E8F0",
    GRAY_200: "#E4E7EC",
    GRAY_200_SLATE: "#CBD5E1",
    TOAST_SUCCESS_BG: "#E3F1E8",
    TOAST_INFO_BG: "#EFF6FF",
    TOAST_INFO_BORDER: "#1B6CA8",
    TOAST_INFO_ICON: "#1B6CA8",
} as const;

/** Alias for lint rule "COLORS từ config". Use ICON_COLORS or this. */
export const COLORS = ICON_COLORS;

/**
 * Application routes
 */
export const ROUTES = {
    LOGIN: "/login",
    HOME: "/",
    DASHBOARD: "/dashboard",
    ANNOUNCEMENTS: "/announcements",
    STUDENT_SERVICES: "/student-services",
    CHAT: "/chat",
    CHAT_CONVERSATION: (id: string) => `/chat/${id}`,
    LEARNING_PATH: "/learning-path",
    COURSES: "/courses",
    RESULTS: "/results",
    STUDY_RESULTS: "/study-results",
    LANGUAGE_PRACTICE: "/language-practice",
    SCHEDULE: "/schedule",
    LEADERBOARD: "/leaderboard",
    CONTESTS: "/contests",
    TASKS: "/tasks",
    AVATAR: "/avatar",
    PORTFOLIO: "/portfolio",
    PROFILE: "/profile",
    /** Course detail route builder (WP-04). */
    COURSE_DETAIL: (courseId: string) => `/courses/${courseId}`,
    /** Study-mode lesson route builder (WP-04). */
    LESSON: (courseId: string, lessonId: string) => `/courses/${courseId}/lessons/${lessonId}`,
    /** Announcement detail route builder (WP-05). */
    ANNOUNCEMENT_DETAIL: (id: string) => `/announcements/${id}`,
} as const;

export const IMAGE_PATHS = {
    LOGO: "/logo.svg",
    RIKKEI_LOGO: "/assets/rikkei-logo.png",
    /** Shell chrome icons — files live in `public/icons/` */
    MENU: "/icons/menu.svg",
    BELL: "/icons/bell.svg",
    STAR: "/icons/star.svg",
    STAR_OUTLINE: "/icons/star-outline.svg",
    /** Level/XP footer — outline star (EP), not filled */
    STAR_LEVEL: "/icons/star-level.svg",
    CHEVRON_RIGHT: "/icons/chevron-right.svg",
    FLAME: "/icons/flame.svg",
    PIN: "/icons/pin.svg",
    JERSEY: "/icons/jersey.svg",
    COAT: "/icons/coat.svg",
    MASKS: "/icons/masks.svg",
    ROCKET: "/icons/rocket.svg",
    COMPASS: "/icons/compass.svg",
    MEGAPHONE: "/icons/megaphone.svg",
    CALENDAR: "/icons/calendar.svg",
    CLOCK: "/icons/clock.svg",
    BRAIN: "/icons/brain.svg",
    TROPHY: "/icons/trophy.svg",
    WAVE: "/icons/wave.svg",
    MEDAL_GOLD: "/icons/medal-gold.svg",
    MEDAL_SILVER: "/icons/medal-silver.svg",
    MEDAL_BRONZE: "/icons/medal-bronze.svg",
    /** Student-learning icons (WP-04) — files live in `public/icons/` */
    MAP: "/icons/map.svg",
    NOTE: "/icons/note.svg",
    PUZZLE: "/icons/puzzle.svg",
    FLAG_CHECKERED: "/icons/flag-checkered.svg",
    FLAG: "/icons/flag.svg",
    SWORD: "/icons/sword.svg",
    PINE: "/icons/pine.svg",
    TREE: "/icons/tree.svg",
    MUSHROOM: "/icons/mushroom.svg",
    CLOUD: "/icons/cloud.svg",
    BIRD: "/icons/bird.svg",
    FLOWER: "/icons/flower.svg",
    LEAF: "/icons/leaf.svg",
    BLOSSOM: "/icons/blossom.svg",
    ROCK: "/icons/rock.svg",
    PARTY: "/icons/party.svg",
    ATOM: "/icons/atom.svg",
    PALETTE: "/icons/palette.svg",
    DOT: "/icons/dot.svg",
    LINK: "/icons/link.svg",
    ALERT: "/icons/alert.svg",
    CLOCK2: "/icons/clock2.svg",
    CHAT: "/icons/chat.svg",
    ARROW_UP_RIGHT: "/icons/arrow-up-right.svg",
    CHECK: "/icons/check.svg",
    CHECK_CIRCLE: "/icons/check-circle.svg",
    FOX: "/icons/fox.svg",
    SPARKLES: "/icons/sparkles.svg",
    FOLDER: "/icons/folder.svg",
    GRADUATION: "/icons/graduation.svg",
    BRIEFCASE: "/icons/briefcase.svg",
    ROBOT: "/icons/robot.svg",
    VIDEO: "/icons/video.svg",
    BOOK_OPEN: "/icons/book-open.svg",
    ZAP: "/icons/zap.svg",
    GIFT: "/icons/gift.svg",
    SEARCH: "/icons/search.svg",
    BULB: "/icons/bulb.svg",
    TARGET: "/icons/target.svg",
    CHEVRON_LEFT: "/icons/chevron-left.svg",
    CHEVRON_DOWN: "/icons/chevron-down.svg",
    SEND: "/icons/send.svg",
    LOCK: "/icons/lock.svg",
    /** WP-05 results / announcements */
    CLIPBOARD: "/icons/clipboard.svg",
    HOME_ICON: "/icons/home.svg",
    BOOK: "/icons/book.svg",
    EXAM_AVATAR: "/icons/avatar-thi.png",
    CRITERIA_WAVE_ATTENDANCE: "/icons/criteria-wave-attendance.svg",
    CRITERIA_WAVE_HOMEWORK: "/icons/criteria-wave-homework.svg",
    CRITERIA_WAVE_ELEARNING: "/icons/criteria-wave-elearning.svg",
    CRITERIA_WAVE_RPOINT: "/icons/criteria-wave-rpoint.svg",
    INBOX: "/icons/inbox.svg",
    PENCIL: "/icons/pencil.svg",
    EYE: "/icons/eye.svg",
    EYE_OFF: "/icons/eye-off.svg",
    BOOKMARK: "/icons/bookmark.svg",
    /** WP-06 game / portfolio / contests / language */
    USERS: "/icons/users.svg",
    REFRESH: "/icons/refresh.svg",
    BACKPACK: "/icons/backpack.svg",
    MEAT: "/icons/meat.svg",
    CHICK: "/icons/chick.svg",
    EGG: "/icons/egg.svg",
    CAT: "/icons/cat.svg",
    DOG: "/icons/dog.svg",
    RABBIT: "/icons/rabbit.svg",
    CROWN: "/icons/crown.svg",
    TIE: "/icons/tie.svg",
    NINJA: "/icons/ninja.svg",
    WIZARD: "/icons/wizard.svg",
    RING: "/icons/ring.svg",
    BEADS: "/icons/beads.svg",
    GOGGLES: "/icons/goggles.svg",
    SHIELD: "/icons/shield.svg",
    TICKET: "/icons/ticket.svg",
    SNOWFLAKE: "/icons/snowflake.svg",
    LANGUAGES: "/icons/languages.svg",
    GLOBE: "/icons/globe.svg",
    MEDAL: "/icons/medal.svg",
    TREND_UP: "/icons/trend-up.svg",
    HEADPHONES: "/icons/headphones.svg",
    MIC: "/icons/mic.svg",
    VOLUME: "/icons/volume.svg",
    /** WP-07 services / schedule / profile */
    FILE_TEXT: "/icons/file-text.svg",
    HOURGLASS: "/icons/hourglass.svg",
    SETTINGS: "/icons/settings.svg",
    USER: "/icons/user.svg",
    LOGOUT: "/icons/logout.svg",
    CLOSE: "/icons/x.svg",
    CAMERA: "/icons/camera.svg",
    UPLOAD: "/icons/upload.svg",
    SAVE: "/icons/save.svg",
    EXPAND: "/icons/expand.svg",
    PLUS: "/icons/plus.svg",
    ARROW_RIGHT: "/icons/arrow-right.svg",
} as const;

/**
 * Error message keywords for parsing backend error responses
 */
export const ERROR_KEYWORDS = {
    EXPIRED: ["hết hạn", "expired"],
    INVALID: ["không hợp lệ", "invalid"],
    CONSTRAINT: ["constraint", "liên kết", "foreign key"],
} as const;

export const SENTRY_CONFIG = {
    TRACES_SAMPLE_RATE: 0.1,
    REPLAYS_SESSION_SAMPLE_RATE: 0.05,
    REPLAYS_ERROR_SAMPLE_RATE: 1.0,
} as const;

export const ANALYTICS_CONFIG = {
    GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
} as const;

export const VALIDATION_LIMITS = {
    NAME_MAX_LENGTH: 255,
    DESCRIPTION_MAX_LENGTH: 1000,
} as const;

export const DEBOUNCE_MS = 300;

/**
 * Độ trễ giả lập cho tầng service khi chưa có API thật (ms).
 * Dùng bởi `src/services/mock-delay.ts`. Khi nối API thật, service không dùng hằng số này nữa.
 */
export const MOCK_LATENCY_MS = 400;

/**
 * UI Breakpoints in pixels
 */
export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
    /** EP `.lms-hidesm` */
    HIDESM: 560,
    /** EP sidebar drawer / bottom nav */
    NAV: 920,
} as const;
