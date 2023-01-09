/**
 * Import all internal indexes, thus including the code in the final build.
 * export all content representing the surface of your plugin API. Noone is expected to call, but wth.
 * Wait to be called for render, Core will call you.
 */

import Mainholder from "./components/Holder/Mainholder";

const routes = [
  {
    name: "report-engine",
    path: "/main/report-engine",
    render: Mainholder,
    isExact: false,
  },
];

export { Mainholder, routes };
