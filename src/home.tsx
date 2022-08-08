/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "../deps.ts";
import { site } from "./constants.ts";
import {
  ColorSchemeButton,
  DeployButton,
  ExampleImage,
  Footer,
  GitHubButton,
  Heading,
  Link,
  ParamList,
  RouteSchema,
} from "./components.tsx";

export const Home = () => {
  return (
    <>
      <div class="max-w-2xl px-8 mx-auto h-screen relative">
        <div class="w-full py-10">
          {/* Header */}
          <header class="app-header relative">
            <h1 class="app-title">
              <a href="/" title={site.title} rel="noopener">migo</a>
            </h1>
            <ColorSchemeButton class="absolute top-7 right-2" />
          </header>
          <p class="my-1.5 md:my-2 text-sm md:text-base">
            <ExampleImage src={site.image} url={site.repository} />
          </p>
          {/* Deploy With Deno button */}
          <div class="btn-wrapper">
            <DeployButton>Deploy with Deno</DeployButton>
            <GitHubButton>Star on GitHub</GitHubButton>
          </div>

          {/* What is this? */}
          <Heading title="What is this?">What is this?</Heading>
          <p class="my-2 md:my-2.5 text-sm md:text-base text-center leading-6">
            Migo is a free service to generate OpenGraph Images and globally
            deployed on{" "}
            <Link url="https://deno.com/deploy">Deno Deploy</Link>. Images are
            rendered as SVG, rasterized to PNG, and cached as immutable assets
            with{" "}
            <Link url="https://developers.cloudflare.com/workers/runtime-apis/kv">
              Cloudflare KV
            </Link>, providing low-latency responses that scale.
          </p>
          <p class="mb-2 mt-4 md:mt-5 md:mb-2.5 text-sm sm:text-base md:text-lg text-center leading-6">
            Read further documentation or check out the source code{"  "}
            <Link url="https://github.com/nberlette/migo#readme">
              GitHub Repository
            </Link>. If you encounter any bugs please{" "}
            <Link url="https://github.com/nberlette/migo/issues/new">
              create a new issue
            </Link>{" "}
            so it can be fixed.
          </p>

          {/* Schema */}
          <Heading title="Schema">Schema</Heading>
          <RouteSchema />
          <RouteSchema subtitle=":subtitle" />
          <RouteSchema subtitle=":subtitle" params=":params" />

          {/* Parameters */}
          <Heading title="Parameters">Parameters and Defaults</Heading>
          <ParamList />

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};
