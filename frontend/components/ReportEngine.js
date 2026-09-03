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
const ReportEngine = (props, context) => {
  const [selectedFields, setSelectedFields] = useState([])
  const [parentActive, setParentActive] = useState(false)
  const [parentName, setParentName] = useState('')
  const [system, setShowSystem] = useState(true)
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
  const selectSource = (showSystem) => {
    if (showSystem === system) {
      return
    }
    //toggle tables
    setShowSystem(showSystem)
    //clean up
    clearSelection()
  }

  const clearSelection = () => {
    setParentActive(false)
    setSelectedFields([])
    setParentName('')
  }

  const handleFieldClickAnalytics = (e, field, table) => {
    let key = 'key'
    if (!system) {
      key = 'KEY'
    }
    e.stopPropagation()
    //carry the source table so the criteria row can show where the field comes from
    if (table && !field['TABLE_NAME']) {
      field['TABLE_NAME'] = table['OBJECT_NAME']
    }
    let tempArr = [...selectedFields]
    tempArr.push(field)
    let uniqueObjArray = [...new Map(tempArr.map((item) => [item[`${key}`], item])).values()];
    setSelectedFields(uniqueObjArray)
  }

  const selectedKeys = selectedFields.map(field => system ? field['key'] : field['KEY'])

  return (
    <div className={'re-root'}>
      <aside className={'re-rail'}>
        <div className={'re-rail-header'}>
          <button onClick={() => { history.goBack() }} className={'re-back-btn'}>
            {icons.back}
            <span>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-back', defaultMessage: 'perun.plugin.report-engine-back' })}</span>
          </button>
          <span className={'re-rail-title'}>{labelsManager.importLabel('tables', 'report_engine', context)}</span>
        </div>

        <div className={'re-tabs'}>
          <button className={`re-tab ${system ? 're-tab--active' : ''}`} onClick={() => selectSource(true)}>
            {context.intl.formatMessage({ id: 'perun.plugin.report-engine-system', defaultMessage: 'perun.plugin.report-engine-system' })}
          </button>
          <button className={`re-tab ${!system ? 're-tab--active' : ''}`} onClick={() => selectSource(false)}>
            {context.intl.formatMessage({ id: 'perun.plugin.report-engine-analytics', defaultMessage: 'perun.plugin.report-engine-analytics' })}
          </button>
        </div>

        {system && <SideMenu handleFieldClick={handleFieldClick} selectedKeys={selectedKeys} lockedParent={parentName} />}
        {!system && <SideMenuAnalytics handleFieldClick={handleFieldClickAnalytics} selectedKeys={selectedKeys} />}
      </aside>

      <main className={'re-canvas'}>
        <div className={'re-canvas-header'}>
          <h2 className={'re-canvas-title'}>{labelsManager.importLabel('report_criteria', 'report_engine', context)}</h2>
          <span className={'re-count re-count--accent'}>{selectedFields.length}</span>
          {parentName && <span className={'re-scope-chip'} title={parentName}>{parentName}</span>}
          {selectedFields.length > 0 && <button className={'re-ghost-btn'} onClick={() => clearSelection()}>
            {labelsManager.importLabel('clear_all', 'report_engine', context)}
          </button>}
        </div>

        {selectedFields.length > 0
          ? <MainContent isAnalytics={!system} selectedFields={selectedFields} removeFileClick={removeFileClick} />
          : <div className={'re-placeholder'}>
            <span className={'re-placeholder-title'}>{labelsManager.importLabel('no_fields_selected', 'report_engine', context)}</span>
            <span className={'re-placeholder-hint'}>{labelsManager.importLabel('no_fields_selected_hint', 'report_engine', context)}</span>
          </div>}
      </main>
    </div>
  )
}
ReportEngine.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default ReportEngine
