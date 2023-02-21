import {
    React, createHashHistory
} from "perun-core";
import MainContent from './MainContent/MainContent';
import SideMenu from './SideMenu';
import style from "./../assets/ReportEngine.module.css"
import { icons } from '../assets/svgHolder';
const history = createHashHistory();
const { useState } = React
const ReportEngine = () => {
    const [selectedFields, setSelectedFields] = useState([])
    const handleFieldClick = (e, field) => {
        e.stopPropagation()
        let tempArr = [...selectedFields]
        tempArr.push(field)
        let uniqueObjArray = [...new Map(tempArr.map((item) => [item["key"], item])).values()];
        setSelectedFields(uniqueObjArray)
    }

    const removeFileClick = (file) => {
        let tempArr = [...selectedFields]
        tempArr.forEach((field, i) => {
            if (field.key === file.name) {
                tempArr.splice(i, 1)
            }
        })
        setSelectedFields(tempArr)
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