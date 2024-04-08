import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { play } from "./game";

inject();
injectSpeedInsights();

play();
