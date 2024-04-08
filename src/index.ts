import { inject as injectAnalytics } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { play } from "./game";

injectAnalytics();
injectSpeedInsights();

play();
