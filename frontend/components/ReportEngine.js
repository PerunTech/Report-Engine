import {
  React, createHashHistory, elements
} from "perun-core";
import MainContent from './MainContent/MainContent';
import SideMenu from './SideMenu';
import style from "./../assets/ReportEngine.module.css"
import { icons } from '../assets/svgHolder';
const { alertUser } = elements
const history = createHashHistory();
const { useState } = React
const ReportEngine = () => {
  const [selectedFields, setSelectedFields] = useState([])
  const [parentActive, setParentActive] = useState(false)
  const [parentName, setParentName] = useState('')
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
      alertUser(true, 'info', "Ова да се смени не знам што да пишува")
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
    let tempArr = [...selectedFields]
    tempArr.forEach((field, i) => {
      if (field.key === file.field_name) {
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

  return (
    <div className={style['report-engine-main-container']}>
      <div className={style['side-menu-container']}>
        <button onClick={() => { history.goBack() }} className={style['btn-back']}><span>{icons.back}Назад</span></button>
        <SideMenu handleFieldClick={handleFieldClick} />
      </div>

      {selectedFields.length > 0 && <div className={style['main-content-container']}>
        <MainContent selectedFields={selectedFields} removeFileClick={removeFileClick} />
      </div>}
    </div>
  )
}

export default ReportEngine