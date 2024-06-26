export const DEBUG = Deno.env.get("DEBUG") ?? false;

export const DEV = Deno.env.get("DENO_DEPLOYMENT_ID") === undefined || DEBUG;

/**
 * Used as the base for all icon requests.
 * @default https://api.iconify.design
 * @example https://icns.deno.dev -> https://icns.deno.dev/twemoji:letter-m.svg
 */
export const CDN_URL = "https://icns.deno.dev" as const;

export const FAVICON_URL = `${CDN_URL}/game-icons:sauropod-head.svg` as const;

export const FALLBACK_ICON_URL =
  `${CDN_URL}/fluent-emoji:sauropod.svg` as const;

/**
 * various cache TTL values, from 1 minute to 1 year
 */
export const YEAR = 86400 * 365;
export { YEAR as TTL_1Y };

/**
 * Cache-Control header values for long-term, short-term, and no-cache.
 */
export const CACHING: Record<string, string> = {
  none: "public, no-cache, no-store, s-maxage=0, max-age=0, must-revalidate",
  short: `public, s-maxage=1800, max-age=1800, stale-if-error=120, stale-while-revalidate=60`,
  medium: `public, s-maxage=86400, max-age=86400, stale-if-error=900, stale-while-revalidate=120`,
  long: `public, s-maxage=${YEAR}, max-age=${YEAR}, stale-if-error=3600, stale-while-revalidate=300, immutable`,
} as const;

export const CACHE_NAME = "migo.deno.dev";

export { CACHE_NAME as cacheName, CACHING as cacheTerm };

/**
 * Default Param values for the handle.image() function
 */
export const defaultParams = {
  title: "",
  subtitle: "",
  width: "1280",
  height: "640",
  pxRatio: "1.5",
  icon: "noto:t-rex",
  iconW: "240",
  iconH: "240",
  bgColor: "FFFFFF",
  titleColor: "112233",
  titleFontSize: "64",
  subtitleFontSize: "36",
} as const;

/**
 * Metadata for SEO
 */
export const site = {
  ...({
    url: "https://migo.deno.dev",
    title: "Edge-rendered OpenGraph Images · migo",
    author: "Nicholas Berlette",
    description:
      "Edge-generated OpenGraph images, globally distributed via the Deno Edge Network.",
    keywords:
      "deno deploy,migo,edge,api,serverless,opengraph,generator,dynamic,image generator,social media,social images,deno,cover+images,ogimage,twittercard api,cloudflare,workers,generator",
    image:
      "/image.png?title=Edge-rendered%20OpenGraph%20Images&subtitle=migo.deno.dev&subtitleFontSize=48&bgColor=123&titleColor=fff&subtitleColor=papayawhip&icon=game-icons:t-rex-skull&pxRatio=1&borderRadius=15",
    banner:
      "/image.png?title=migo.deno.dev&subtitle=Generate+dynamic+images+on+the+Edge&bgColor=111827&titleColor=fff&subtitleColor=aaa&pxRatio=1.5&borderRadius=15&width=1000&height=400&iconW=240&iconH=240&iconX=-10&iconY=180&titleFontSize=88&titleFontFamily=serif&titleFontWeight=100&titleX=300&titleTextAnchor=left&titleY=320&subtitleY=130&subtitleFontFamily=monospace&subtitleFontSize=40&icon=game-icons:sauropod-head",
    repository: "https://github.com/nberlette/migo",
  } as const),
};

export const styles = [
  `.param-list:hover .param-group:not(:hover) span:not(.param-comment){opacity:0.666 !important} .param-list:hover .param-group:hover span,.param-group:not(:hover) :is(.param-comment,.param-comment-block){opacity:1 !important}`,
];

/**
 * Document `<meta>` tags added in the page `<head>`
 */
export const meta: Meta = {
  ...({
    viewport: "width=device-width, initial-scale=1.0",
    title: site.title,
    author: site.author,
    description: site.description,
    keywords: site.keywords,
    "og:url": site.url,
    "og:type": "website",
    "og:image": site.image,
    "twitter:image": site.image,
    "og:title": site.title,
    "og:description": site.description,
    "og:author": site.author,
    "twitter:title": site.title,
    "twitter:url": site.url,
    "twitter:card": "summary_large_image",
    "twitter:summary": site.description,
    "twitter:creator": site.author,
    "twitter:image:src": site.image,
    "theme-color": "#112233",
  } as const),
};

/**
 * `<link />` elements added to the page `<head>`
 */
export const links = [
  {
    rel: "prefetch",
    href: "/favicon.svg",
    type: "image/svg+xml",
    as: "image",
  },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

/**
 * List of parameters with default values and comments.
 * Used to render the Parameters section of the documentation site.
 * @see ParamList
 */
export const paramList = [
  ["// base props of the image"],
  ["width", "1280"],
  ["height", "640"],
  ["viewBox", "0 0 1280 640"],
  ["pxRatio", "1.5", "// set to 1 for low-res"],
  ["bgColor", "white"],
  ["borderRadius", "0", "// rounded image corners"],
  ["// icon"],
  ["icon", "noto:t-rex", "// set to false to disable icon"],
  ["iconUrl", "https://icns.ml/{icon}.svg"],
  ["iconW", "240"],
  ["iconH", "240", "// +iconW"],
  ["iconX", "520", "// ((width - iconW) / 2)"],
  ["iconY", "60", "// (iconH / 4)"],
  ["iconColor", "black", "// fill color"],
  ["iconStroke", "none", "// stroke color"],
  ["iconStrokeWidth", "0", "// stroke width"],
  ["// title (first line of text)"],
  ["titleX", "640", "// (width / 2)"],
  ["titleY", "450", "// (iconH + iconY + (titleFontSize * 2.5))"],
  ["titleFontSize", "64"],
  ["titleFontFamily", "sans-serif", '// "Inter"'],
  ["titleFontWeight", "bold"],
  ["titleColor", "#112233", "// text color"],
  ["titleStroke", "none", "// stroke color"],
  ["titleStrokeWidth", "0", "// stroke width"],
  ["titleTextAnchor", "middle", "// text-anchor"],
  ["// subtitle (second line of text)"],
  ["subtitleX", "640", "// (width / 2)"],
  ["subtitleY", "530", "// (titleY + (subtitleFontSize * 2.5))"],
  ["subtitleFontSize", "32"],
  ["subtitleFontFamily", "monospace", '// "JetBrains Mono"'],
  ["subtitleFontWeight", "normal"],
  ["subtitleColor", "#334455", "// text color"],
  ["subtitleStroke", "none", "// stroke color"],
  ["subtitleStrokeWidth", "0", "// stroke width"],
  ["subtitleTextAnchor", "middle", "// text-anchor"],
] as const;

/**
 * Shortcuts for UnoCSS configuration
 * @see {@link https://uno.antfu.me}
 */
export const shortcuts = {
  ...({
    "btn-large":
      "bg-black text-white inline-flex flex-row flex-nowrap gap-x-3 place-items-center py-1.5 sm:py-2 md:py-2.5 px-4 sm:px-5 md:px-6 mt-6 mb-5 sm:mt-7 sm:mb-6 md:mt-10 md:mb-9 rounded-full ring-2 ring-blue-gray-900 dark:ring-blue-gray-50 hover:!bg-white hover:!text-blue-gray-900 dark:hover:!ring-white shadow-sm hover:shadow-xl hover:animate-pulse-alt !animate-duration-2s transition-all duration-500 ease-in-out tracking-tight whitespace-nowrap break-normal",
    "btn-icon":
      "filter -invert-[1.0] w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6",
    "btn-colorscheme":
      "cursor-pointer dark:!text-white inline-block overflow-hidden bg-transparent border-none",
    "app-header":
      "text-center py-2 my-4 border-b border-gray-200 dark:!border-gray-700 select-none",
    "app-title":
      "text-7xl font-thin tracking-tighter text-left text-black dark:text-white -mb-3",
    "btn-wrapper":
      "mb-2 mt-1 text-base md:text-lg text-center place-items-center justify-center align-middle w-full flex flex-row flex-nowrap gap-4 sm:!gap-x-6 md:!gap-x-8",
    "example-image":
      "sm:rounded-lg md:rounded-xl lg:rounded-3xl border border-2 border-gray-100 shadow-sm dark:!border-gray-900 hover:shadow-md transition-all duration-500 my-2 w-[full] sm:h-full z-10 relative block",
    "example-image-link": "w-[110%] -mx-[5%] h-auto block",
    "param-list":
      "text-sm bg-gray-50/50 border border-b-2 border-gray-200 dark:!bg-blue-gray-800/75 dark:!border-gray-700 dark:!text-blue-gray-50 p-4 rounded flex flex-col w-full my-2 overflow-x-scroll whitespace-pre",
    "param-group": "block",
    "param-base":
      "text-sm md:text-base underline underline-dashed text-black dark:!text-white underline-gray-400 dark:!underline-blue-gray-500 transition-opacity duration-400 ease-out opacity-100",
    "param-comment":
      "!text-gray-900 tracking-tight dark:!text-gray-50 text-xs md:text-sm xl:text-base inline-block transition-opacity duration-400 opacity-40",
    "param-comment-block": "param-comment !block mb-1 !opacity-100",
    "param-name": "param-base font-semibold cursor-pointer",
    "param-value": "param-base font-medium cursor-pointer",
    "param-other":
      "param-base font-light !underline-0 !no-underline !text-gray-900 dark:!text-gray-50",
  } as const),
};
