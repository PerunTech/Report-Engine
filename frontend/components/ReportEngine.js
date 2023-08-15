import {
  React, createHashHistory, elements, PropTypes
} from "perun-core";
import MainContent from './MainContent/MainContent';
import SideMenu from './SideMenu';
import SideMenuAnalytics from './SideMenuAnalytics';
import { icons } from '../assets/svgHolder';
import { labelsManager } from "../assets/LabelsExport"
const { alertUser } = elements
const history = createHashHistory();
const { useState } = React
const ReportEngine = (context) => {
  const [selectedFields, setSelectedFields] = useState([])
  const [parentActive, setParentActive] = useState(false)
  const [parentName, setParentName] = useState('')
  const [system, setShowSystem] = useState(false)
  const handleFieldClick = (e, field, table) => {
    let innerField = field
    if (table['SVAROG_TABLES.PARENT_ID']) {

    } else {
      if (!parentActive) {
        setParentName(table['SVAROG_TABLES.TABLE_NAME'])
        setParentActive(true)
        innerField.parent = true
      }
    }
    e.stopPropagation()
    let tempArr = [...selectedFields]
    if (table['SVAROG_TABLES.PARENT_ID'] === 0 && table['SVAROG_TABLES.TABLE_NAME'] !== parentName && parentName) {
      alertUser(true, 'info', labelsManager.importLabel('notification_title', 'report_engine', context), `${labelsManager.importLabel('already_selected_parent', 'report_engine', context)}. (${parentName})`)
    } else if (table['SVAROG_TABLES.PARENT_ID'] === 0 && !parentName) {
      tempArr.push(innerField)

    } else if (table['SVAROG_TABLES.PARENT_ID'] === 0 && table['SVAROG_TABLES.TABLE_NAME'] === parentName) {
      innerField.parent = true
      tempArr.push(innerField)
    }
    else {
      tempArr.push(innerField)
    }

    let uniqueObjArray = [...new Map(tempArr.map((item) => [item["key"], item])).values()];
    setSelectedFields(uniqueObjArray)
  }

  const removeFileClick = (file) => {
    let key = 'key'
    if (!system) {
      key = 'KEY'
    }
    let tempArr = [...selectedFields]
    tempArr.forEach((field, i) => {
      if (field[`${key}`] === file.field_name) {
        tempArr.splice(i, 1)
      }
    })
    setSelectedFields(tempArr)
    if (tempArr.length === 0) {
      setParentActive(false)
      setParentName('')
    } else {
      let flag = false
      tempArr.map(field => {
        if (field.parent) {
          flag = true
        }
      })
      if (!flag) {
        setParentActive(false)
        setParentName('')
      }
    }
  }
  //used to clean up after table switch and toggle which table is shown
  const toggleFunction = () => {
    //toggle tables
    setShowSystem(!system)
    //clean up
    setParentActive(false)
    setSelectedFields([])
    setParentName('')
  }

  const handleFieldClickAnalytics = (e, field) => {
    let key = 'key'
    if (!system) {
      key = 'KEY'
    }
    e.stopPropagation()
    let tempArr = [...selectedFields]
    tempArr.push(field)
    let uniqueObjArray = [...new Map(tempArr.map((item) => [item[`${key}`], item])).values()];
    setSelectedFields(uniqueObjArray)
  }
  return (
    <div className={'report-engine-main-container'}>
      <div className={'report-engine-side-menu-container'}>
        <button onClick={() => { history.goBack() }} className={'report-engine-btn-back'}><span>{icons.back}{this.context.intl.formatMessage({ id: 'perun.plugin.report-engine-back', defaultMessage: 'perun.plugin.report-engine-back' })}</span></button>
        <div className={'report-engine-table-toggle-button'} onClick={() => toggleFunction()}>
          <p>{this.context.intl.formatMessage({ id: 'perun.plugin.report-engine-show', defaultMessage: 'perun.plugin.report-engine-show' })} {system ? context.intl.formatMessage({ id: 'perun.plugin.report-engine-analytics', defaultMessage: 'perun.plugin.report-engine-analytics' }) : context.intl.formatMessage({ id: 'perun.plugin.report-engine-system', defaultMessage: 'perun.plugin.report-engine-system' })}</p>
        </div>
        {system && <SideMenu handleFieldClick={handleFieldClick} />}
        {!system && <SideMenuAnalytics handleFieldClick={handleFieldClickAnalytics} />}
      </div>

      {selectedFields.length > 0 && <div className={'report-engine-main-content-container'}>
        <MainContent isAnalytics={!system} selectedFields={selectedFields} removeFileClick={removeFileClick} />
      </div>}
    </div>
  )
}
ReportEngine.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default ReportEngine