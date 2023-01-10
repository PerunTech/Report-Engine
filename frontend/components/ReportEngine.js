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
        setSelectedFields(tempArr)
    }
    return (
        <div className={style['report-engine-main-container']}>
            <div className={style['side-menu-container']}>
                <SideMenu handleFieldClick={handleFieldClick} />
            </div>
            <div className={style['main-content-container']}>
                <MainContent selectedFields={selectedFields} />
            </div>
        </div>
    )
}

export default ReportEngine