import { React, MenuHolder, createHashHistory } from "perun-core";
const { useState, useEffect } = React;
import "../../assets/styles.css";
import ReportEngine from '../ReportEngine';
const Mainholder = (props) => {
  const [component, setComponent] = useState(undefined);

  useEffect(() => {
    assignComponentToRoute(props);
    if (document.getElementById("identificationScreen")) {
      document.getElementById("identificationScreen").className =
        "identificationScreen";
      document.getElementById("identificationScreen").innerText = "report-engine";
    }
  }, []);


  const assignComponentToRoute = (props) => {
    const { match, history } = props;
    const pathName = match.path.split("/")[2];
    let component;
    switch (pathName) {
      case 'report-engine':
        component = <ReportEngine />
        break;
      default:
        break;
    }
    setComponent(component);
  };

  return (
    <>
      {component}
    </>
  );
};

export default Mainholder;