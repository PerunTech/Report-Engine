import {
    React,
} from "perun-core";
import MainContent from './MainContent/MainContent';
import SideMenu from './SideMenu';
import style from "./../assets/ReportEngine.module.css"
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
    return (
        <div className={style['report-engine-main-container']}>
            <div className={style['side-menu-container']}>
                <SideMenu handleFieldClick={handleFieldClick} />
            </div>
            {selectedFields.length > 0 && <div className={style['main-content-container']}>
                <MainContent selectedFields={selectedFields} />
            </div>}
        </div>
    )
}

export default ReportEngine