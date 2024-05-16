/** @jsx h */
/** @jsxFrag Fragment */
import {
  decode,
  formatHex,
  Fragment,
  h,
  is,
  parseColor,
  renderToString,
  VNode,
} from "../deps.ts";
import { adjustViewBoxValue, Params, sanitizeIcon } from "./utils.ts";
import { CDN_URL, defaultParams, FALLBACK_ICON_URL } from "./constants.ts";

const createIconUrl = (icon: string) =>
  icon.startsWith("http")
    ? new URL(icon).href
    : icon.startsWith("data:")
    ? decode(icon)
    : new URL(`/${icon.replace(/\.svg\?.*$/i, "")}.svg`, CDN_URL).href;

export async function generateIcon(
  iconUrl: string | URL,
  properties?: IconProps
): Promise<any> {
  const {
    iconW: width = 240,
    iconH: height = width,
    iconColor: fill = "currentColor",
    iconStroke: stroke = "none",
    iconStrokeWidth: strokeWidth = "0",
    viewBox = "0 0 24 24",
    ...props
  } = (properties ?? {}) as IconProps;

  is.assert.url(iconUrl);

  let iconContents = "",
    iconViewBox = viewBox;
  let external = false;
  const url = new URL(String(iconUrl));
  url.search = "";
  iconUrl = url.href;
  console.log("iconUrl", iconUrl);
  if (iconUrl.includes("siv:logo")) {
    const [minX, minY, width, height] = viewBox.split(" ").map(Number);
    const cx = minX + width / 2;
    const cy = minY + height / 2;
    const r = Math.min(width, height) / 2;
    return (
      <defs>
        <symbol id="icon" viewBox={viewBox} image-rendering="optimizeQuality">
          <circle id="circle" cx="${cx}" cy="${cy}" r="${r}" fill="#F0FDFA" />
          <path
            d="M248.983 269.4C265.97 269.4 280.436 272.48 292.383 278.64C304.516 284.8 314.69 294.227 322.903 306.92L300.223 327.36C294.996 316.16 288.463 308.04 280.623 303C272.783 297.96 262.33 295.44 249.263 295.44C236.383 295.44 226.396 298.054 219.303 303.28C212.21 308.32 208.663 314.854 208.663 322.88C208.663 330.347 212.116 336.32 219.023 340.8C225.93 345.094 238.25 348.827 255.983 352C272.596 354.987 285.756 358.814 295.463 363.48C305.356 367.96 312.543 373.654 317.023 380.56C321.503 387.28 323.743 395.68 323.743 405.76C323.743 416.587 320.663 426.107 314.503 434.32C308.343 442.534 299.663 448.88 288.463 453.36C277.45 457.654 264.663 459.8 250.103 459.8C212.583 459.8 186.076 447.294 170.583 422.28L191.583 401.28C197.556 412.48 205.21 420.694 214.543 425.92C224.063 431.147 235.823 433.76 249.823 433.76C263.076 433.76 273.436 431.52 280.903 427.04C288.556 422.374 292.383 415.84 292.383 407.44C292.383 400.72 288.93 395.307 282.023 391.2C275.303 387.094 263.45 383.454 246.463 380.28C229.476 377.107 215.943 373.187 205.863 368.52C195.783 363.854 188.41 358.067 183.743 351.16C179.263 344.254 177.023 335.854 177.023 325.96C177.023 315.507 179.916 305.987 185.703 297.4C191.49 288.814 199.796 282 210.623 276.96C221.636 271.92 234.423 269.4 248.983 269.4Z"
            fill="white"
          />
          <path
            d="M375.208 293.48C368.861 293.48 363.914 291.894 360.368 288.72C356.821 285.36 355.048 280.694 355.048 274.72C355.048 268.747 356.821 264.174 360.368 261C363.914 257.827 368.861 256.24 375.208 256.24C381.554 256.24 386.408 257.827 389.768 261C393.314 264.174 395.088 268.747 395.088 274.72C395.088 280.694 393.314 285.36 389.768 288.72C386.408 291.894 381.554 293.48 375.208 293.48ZM390.048 457H360.088V317H390.048V457Z"
            fill="white"
          />
          <path
            d="M560.154 317L504.434 457H471.674L415.674 317H448.714L488.194 432.64L528.794 317H560.154Z"
            fill="white"
          />
        </symbol>
      </defs>
    );
  }

  if (iconUrl.startsWith("data")) {
    const [minX, minY, width, height] = viewBox.split(" ").map(Number);
    const cx = minX + width / 2;
    const cy = minY + height / 2;
    const r = Math.min(width, height) / 2;
    return (
      <defs>
        <symbol id="icon" viewBox={viewBox} image-rendering="optimizeQuality">
          <circle id="circle" cx="${cx}" cy="${cy}" r="${r}" fill="#F0FDFA" />
          <image href={iconUrl} width={"100%"} height={"100%"} />
        </symbol>
      </defs>
    );
  } else {
    if (!iconUrl.startsWith("http")) {
      iconUrl = createIconUrl(iconUrl);
    }
    try {
      iconContents = await (await fetch(iconUrl)).text();
    } catch (err) {
      console.error(err);
      try {
        iconContents = await (await fetch(FALLBACK_ICON_URL)).text();
      } catch (error) {
        throw new Error(`Failed to fetch icon at ${iconUrl}`, {
          cause: iconUrl,
        });
      }
    }
  }

  iconContents = sanitizeIcon(iconContents);

  if (stroke !== "none" || +strokeWidth > 0) {
    iconContents = iconContents.replace(
      /(?<=viewBox=['"])([^'"]+?)(?=['"])/i,
      (m) => (
        (iconViewBox = viewBox || adjustViewBoxValue(m, +strokeWidth)),
        iconViewBox
      )
    );
  }

  return iconContents;
}

export async function generateSVG({
  params,
  type = "png",
}: {
  params: Params;
  type?: "png" | "svg" | (string & Record<never, never>);
}): Promise<string> {
  const mergedParams: AllProps = {
    ...defaultParams,
    ...params.toJSON(),
  };
  console.log("params at svg start", params);

  const {
    title = "",
    subtitle = "",
    width = "1200",
    height = "630",
    viewBox = `0 0 ${width} ${height}`,
    bgColor: fill = "#FFFFFF",
    pxRatio = "2",
    borderRadius: rx = "0",
    iconW = "240",
    iconH = iconW,
    iconX = (+width - +iconW) / 2,
    iconY = (+height - +iconH) / 2,
    iconStroke = "none",
    iconStrokeWidth = "0",
    titleFontSize = "48",
    titleFontFamily = "serif",
    titleFontWeight = "bold",
    titleX = +width / 2,
    titleY = +iconH + +iconY * 2 + +titleFontSize * 1,
    subtitleFontSize = "32",
    subtitleFontFamily = "monospace",
    subtitleFontWeight = "normal",
    subtitleX = +width / 2,
    subtitleY = +titleY + +subtitleFontSize * 2,
    titleColor = "#0D9488",
    titleStroke = "none",
    titleStrokeWidth = "0",
    titleTextAnchor = "middle",
    subtitleColor = "#345",
    subtitleStroke = "none",
    subtitleStrokeWidth = "0",
    subtitleTextAnchor = "middle",
  } = (mergedParams ?? {}) as AllProps;

  params = new Params(
    new URLSearchParams(mergedParams as Record<string, string>)
  );
  console.log("params in svgfunc", params);
  for (const k in params) {
    if (/(stroke|color)$/i.test(k)) {
      const color = params.get(k)!;
      params.set(k, formatHex(parseColor(color))!);
    }
  }

  let iconColor = params.get("iconColor") ?? "#0D9488";
  let iconType = "svg";

  const iconUrl = createIconUrl(
    decode(
      params.get("iconUrl") ?? params.get("icon") ?? "game-icons:sauropod-head"
    )
  );

  const iconContents = await generateIcon(iconUrl, {
    iconColor,
    iconStroke,
    iconStrokeWidth,
    iconW,
    iconH,
  } as any);

  if (/(\.svg|^data[:]image\/svg\+xml)/gi.test(new URL(iconUrl).href)) {
    iconType = "svg";
  }

  const iconProps: Record<string, any> = {};

  if (iconType === "svg") {
    Object.assign(iconProps, {
      fill: iconColor,
      color: iconColor,
    });

    if (iconStroke !== "none" || +iconStrokeWidth > 0) {
      Object.assign(iconProps, {
        stroke: iconStroke ?? "none",
        "stroke-width": +iconStrokeWidth || 0,
        "vector-effect": "non-scaling-stroke",
      });
    }
  }

  const svg = (
    <svg
      width={+width * +pxRatio}
      height={+height * +pxRatio}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={decode(title!)}
    >
      <title>{decode(title!)}</title>
      {iconContents && (
        <defs dangerouslySetInnerHTML={{ __html: iconContents }} />
      )}
      <rect
        fill={fill}
        x={0}
        y={0}
        width={width}
        height={height}
        rx={rx || 0}
      />
      <circle
        cx={+width / 2}
        cy={+height / 2}
        r={Math.min(+width, +height * 0.75) / 2}
        fill="#F0FDFA"
      />
      {iconContents && (
        <use
          width={iconW}
          height={iconH}
          x={iconX}
          y={iconY}
          href={"#icon"}
          {...iconProps}
        />
      )}
    </svg>
  );

  const DEV = Deno.env.get("DENO_DEPLOYMENT_ID") === undefined;

  return renderToString(
    svg,
    {},
    {
      pretty: DEV,
      shallow: true,
      xml: true,
    }
  );
}
