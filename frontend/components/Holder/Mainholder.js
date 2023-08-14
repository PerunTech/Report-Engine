import { React, PropTypes } from "perun-core";
const { useState, useEffect } = React;
import ReportEngine from '../ReportEngine';
import { labelsManager } from "../../assets/LabelsExport";
const Mainholder = (props, context) => {
  const [component, setComponent] = useState(undefined);

  useEffect(() => {
    assignComponentToRoute(props);
    if (document.getElementById("identificationScreen")) {
      document.getElementById("identificationScreen").className = "identificationScreen";
      document.getElementById("identificationScreen").innerText = labelsManager.importLabel('report-engine', 'plugin', context);
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

Mainholder.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default Mainholder;