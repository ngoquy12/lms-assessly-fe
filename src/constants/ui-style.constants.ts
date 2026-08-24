/**
 * LMS Assessly — Design System & Style Guidelines Configuration
 *
 * File cấu hình phong cách thiết kế, màu sắc, bo tròn (radius), kích thước (sizing)
 * và các biến thể giao diện dùng chung cho toàn bộ component trong dự án.
 *
 * 🎯 NGUYÊN TẮC: Mọi thay đổi về style, size, radius của hệ thống CHỈ CẦN SỬA TẠI FILE NÀY!
 */

/**
 * 1. BẢNG MÃ MÀU VÀ THEME CHỦ ĐẠO (Brand & Semantic Themes)
 */
export const THEME_COLORS = {
    brand: {
        primary: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800",
        soft: "bg-brand-50 text-brand-700 hover:bg-brand-100 active:bg-brand-200",
        border: "border-brand-300 focus:border-brand-500",
        ring: "focus-visible:ring-brand-500",
    },
    neutral: {
        background: "bg-white",
        surface: "bg-gray-50",
        subtle: "bg-gray-100",
        border: "border-gray-300",
        borderLight: "border-gray-200",
        textPrimary: "text-gray-900",
        textSecondary: "text-gray-600",
        textMuted: "text-gray-400",
    },
    semantic: {
        success: {
            solid: "bg-success-600 text-white hover:bg-success-700",
            soft: "bg-success-50 text-success-700 border-success-200/60",
            ring: "focus-visible:ring-success-500",
        },
        warning: {
            solid: "bg-warning-600 text-white hover:bg-warning-700",
            soft: "bg-warning-50 text-warning-700 border-warning-200/60",
            ring: "focus-visible:ring-warning-500",
        },
        error: {
            solid: "bg-error-600 text-white hover:bg-error-700",
            soft: "bg-error-50 text-error-700 border-error-200/60",
            ring: "focus-visible:ring-error-500",
        },
    },
} as const;

/**
 * 2. QUY CHUẨN BO TRÒN (Radius Tokens)
 */
export const RADIUS_TOKENS = {
    none: "rounded-none",
    xs: "rounded-sm", // 2px
    sm: "rounded-md", // 6px
    md: "rounded-lg", // 8px — Chuẩn mặc định cho Input, Button, Dropdown
    lg: "rounded-xl", // 12px — Chuẩn cho Editors, Popover, Sub-cards
    xl: "rounded-2xl", // 16px — Chuẩn cho Modal, Dialog, Main Cards
    full: "rounded-full", // 9999px — Chuẩn cho Badge, Avatar, Radio, Pill buttons
} as const;

/**
 * 3. QUY CHUẨN ĐƯỜNG VIỀN FOCUS & INTERACTION (Focus Ring System)
 */
export const FOCUS_RING = {
    default: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
    subtle: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/20 focus-visible:border-brand-500",
    error: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-500 focus-visible:ring-offset-2",
} as const;

/**
 * 4. QUY CHUẨN KÍCH THƯỚC COMPONENT (Component Sizing Standards)
 * Mặc định mọi component đều có size="md"
 */
export const COMPONENT_SIZING = {
    // 🔘 Button Sizing
    button: {
        xs: "h-7 px-2.5 text-xs rounded-md gap-1.5",
        sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
        md: "h-10 px-4 py-2 text-sm rounded-lg gap-2", // Default
        lg: "h-11 px-5 text-base rounded-xl gap-2.5",
        xl: "h-12 px-6 text-base rounded-xl gap-3 font-semibold",
        icon: {
            sm: "h-8 w-8 rounded-lg",
            md: "h-10 w-10 rounded-lg", // Default icon
            lg: "h-11 w-11 rounded-xl",
        },
    },

    // 📝 Input / Form Field Sizing
    input: {
        sm: "h-8 px-2.5 text-xs rounded-lg",
        md: "h-10 px-3.5 py-2 text-sm rounded-lg", // Default
        lg: "h-12 px-4 text-base rounded-xl",
    },

    // 🏷️ Badge Sizing
    badge: {
        sm: "px-2.5 py-0.5 text-xs font-semibold rounded-full",
        md: "px-3 py-1 text-xs font-bold rounded-full", // Default
        lg: "px-3.5 py-1.5 text-sm font-bold rounded-full",
    },

    // 🗂️ Card / Container Sizing
    card: {
        sm: "p-4 rounded-xl",
        md: "p-6 rounded-2xl", // Default
        lg: "p-8 rounded-3xl",
    },

    // 📊 Progress Bar Sizing
    progress: {
        sm: "h-1.5 rounded-full",
        md: "h-2.5 rounded-full", // Default
        lg: "h-4 rounded-full",
    },

    // 🖼️ Avatar Sizing
    avatar: {
        sm: "size-8 text-xs",
        md: "size-10 text-sm", // Default
        lg: "size-12 text-base",
        xl: "size-16 text-lg",
    },

    // 💬 Dialog / Modal Sizing
    dialog: {
        sm: "max-w-sm rounded-2xl p-4",
        md: "max-w-lg rounded-2xl p-6", // Default
        lg: "max-w-2xl rounded-3xl p-8",
        xl: "max-w-4xl rounded-3xl p-8",
    },

    // 📑 Tabs Sizing
    tabs: {
        sm: "h-8 text-xs p-0.5 rounded-lg",
        md: "h-10 text-sm p-1 rounded-xl", // Default
        lg: "h-12 text-base p-1.5 rounded-2xl",
    },
} as const;

/**
 * 5. CÁC BIẾN THỂ PHONG CÁCH (Component Variants)
 */
export const COMPONENT_VARIANTS = {
    // Button Variants
    button: {
        default: "bg-brand-600 text-white shadow-xs hover:bg-brand-700 active:bg-brand-800",
        secondary: "bg-brand-50 text-brand-700 shadow-xs hover:bg-brand-100 active:bg-brand-200",
        outline: "border border-gray-300 bg-white text-gray-700 shadow-xs hover:bg-gray-50 active:bg-gray-100 hover:text-gray-900",
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200",
        destructive: "bg-error-600 text-white shadow-xs hover:bg-error-700 active:bg-error-800",
        success: "bg-success-600 text-white shadow-xs hover:bg-success-700 active:bg-success-800",
        warning: "bg-warning-600 text-white shadow-xs hover:bg-warning-700 active:bg-warning-800",
        link: "text-brand-600 underline-offset-4 hover:underline",
    },

    // Badge Variants
    badge: {
        default: "border-transparent bg-brand-50 text-brand-700 hover:bg-brand-100",
        primary: "border-transparent bg-brand-600 text-white shadow-xs hover:bg-brand-700",
        secondary: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200",
        outline: "border-gray-300 bg-white text-gray-700",
        success: "border-transparent bg-success-50 text-success-700",
        warning: "border-transparent bg-warning-50 text-warning-700",
        destructive: "border-transparent bg-error-50 text-error-700",
    },
} as const;
