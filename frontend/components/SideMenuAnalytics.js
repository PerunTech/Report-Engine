import {
  React,
  connect,
  elements,
  axios,
  PropTypes,
  Loading
} from "perun-core";
import { icons } from '../assets/svgHolder';
const { alertUser } = elements
const { useState, useEffect } = React;
import { labelsManager } from "../assets/LabelsExport"
const SideMenuAnalytics = (props, context) => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(`${window.server}/svarog-reporting/get/analytics/tables/${props.svSession}/`).then((res) => {
      res.data.forEach(data => {
        data.opened = false;
        setLoading(false)
      })
      setTables(res.data)
    }).catch(err => {
      console.log(err.response)
      const title = err.response?.data?.title || labelsManager.importLabel('error_occurred', 'report_engine', context)
      const message = err.response?.data?.message || err.response?.data
      alertUser(true, 'error', title, message)
      setLoading(false)
    })
  }, [])

  const generateSideMenuAnalytics = () => {
    return tables.map(table => <div style={{ 'cursor': 'pointer' }} className={`'report-engine-table-container' ${table.opened ? 'report-engine-opened' : 'report-engine-closed'} ${table['SVAROG_TABLES.PARENT_ID'] === 0 ? 'report-engine-parent' : 'report-engine-notparent'}`} onClick={() => handleClick(table)} key={table['SVAROG_TABLES.OBJECT_ID']} id={table['SVAROG_TABLES.OBJECT_ID']}>
      <div className={'report-engine-table-name'}><p>{table['OBJECT_NAME']}</p> <span>{table.opened ? icons.minus : icons.plus}</span></div>
      {table.opened && <div className={'report-engine-field-container'}>
        {generateSideMenuAnalyticsChild(table)}
      </div>}
    </div>)
  }

  const handleClick = (table) => {
    let tempArr = [...tables]
    if (table.opened) {
      tempArr.forEach(object => {
        if (object['OBJECT_ID'] == table['OBJECT_ID']) {
          object.opened = false
        }
      })
      setTables(tempArr)
    } else {
      tempArr.forEach(object => {
        if (object['OBJECT_ID'] == table['OBJECT_ID']) {
          setLoading(true)
          axios.get(`${window.server}/svarog-reporting/get/analytics/fields/${props.svSession}/${table['OBJECT_NAME']}`).then((res) => {
            object.childList = res.data
            object.opened = true
            setTables(tempArr)
            setLoading(false)
          }).catch(err => {
            console.log(err.response)
            const title = err.response?.data?.title || labelsManager.importLabel('error_occurred', 'report_engine', context)
            const message = err.response?.data?.message || err.response?.data
            alertUser(true, 'error', title, message)
            setLoading(false)
          })
        }
      })

    }

  }

  const generateSideMenuAnalyticsChild = (table) => {
    let tableobj = table
    return table.childList.map((field) => <div onClick={(e) => props.handleFieldClick(e, field, tableobj)} key={field.key}>

      <p>{field['FIELD_NAME']}</p>
    </div>

    )
  }

  return (
    <>
      {loading && <Loading />}
      {generateSideMenuAnalytics()}
    </>
  );
};

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

SideMenuAnalytics.contextTypes = {
  intl: PropTypes.object.isRequired
}
export default connect(mapStateToProps)(SideMenuAnalytics);
