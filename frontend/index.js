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
