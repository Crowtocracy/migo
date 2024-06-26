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

  if (iconUrl.startsWith("data")) {
    const [minX, minY, width, height] = viewBox.split(" ").map(Number);
    const cx = minX + width / 2;
    const cy = minY + height / 2;
    const r = Math.min(width, height) / 2;
    return (
      <defs>
        <symbol id="icon" viewBox={viewBox} image-rendering="optimizeQuality">
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
      {iconUrl.includes("siv:logo") && (
        <text
          {...{
            id: "title",
            x: +width / 2,
            y: +height / 2,
            dy: "0.35em",
            "font-size": 192, // use 148 for square
            "font-family": "sans-serif",
            "font-weight": titleFontWeight,
            fill: "#0D9488",
            color: "#0D9488",
            stroke: titleStroke,
            "stroke-width": +titleStrokeWidth,
            "text-anchor": "middle",
          }}
        >
          <tspan>SIV</tspan>
        </text>
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
