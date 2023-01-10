import {
    React,
    connect,
    elements,
    axios,
} from "perun-core";
import style from "./../assets/ReportEngine.module.css"
import { icons } from '../assets/svgHolder';
const { useState, useEffect } = React;
const { alertUser } = elements;
const { ReactBootstrap } = elements;

const SideMenu = (props) => {
    const [tables, setTables] = useState([])
    const [childFields, setChildFields] = useState([])
    useEffect(() => {
        axios.get(`${window.server}/ReactElements/getTableData/${props.svSession}/SVAROG_TABLES/100000`).then((res) => {
            res.data.forEach(data => {
                data.opened = false;
            })
            setTables(res.data)
        })
    }, [])

    const generateSideMenu = () => {
        return tables.map(table => <div style={{ 'cursor': 'pointer' }} className={`${style['table-container']} ${table.opened ? style['opened'] : style['closed']}`} onClick={() => handleClick(table)} key={table['SVAROG_TABLES.OBJECT_ID']} id={table['SVAROG_TABLES.OBJECT_ID']}>
            <div className={style['table-name']}><p>{table['SVAROG_TABLES.TABLE_NAME']}</p> <span>{table.opened ? icons.minus : icons.plus}</span></div>
            <div className={style['field-container']}>
                {table.opened && generateSideMenuChild(table)}
            </div>
        </div>)
    }

    const handleClick = (table) => {
        let tempArr = [...tables]
        if (table.opened) {
            tempArr.forEach(object => {
                if (object['SVAROG_TABLES.OBJECT_ID'] == table['SVAROG_TABLES.OBJECT_ID']) {
                    object.opened = false
                }
            })
            setTables(tempArr)
        } else {
            tempArr.forEach(object => {
                if (object['SVAROG_TABLES.OBJECT_ID'] == table['SVAROG_TABLES.OBJECT_ID']) {

                    axios.get(`${window.server}/ReactElements/getTableFieldList/${props.svSession}/${table['SVAROG_TABLES.TABLE_NAME']}`).then((res) => {
                        object.childList = res.data
                        object.opened = true
                        setTables(tempArr)
                    })
                }
            })

        }

    }


    const generateSideMenuChild = (table) => {
        return table.childList.map(field => <div onClick={(e) => props.handleFieldClick(e, field)} key={field.key}>

            <p>{field['FIELD_NAME']}</p>
        </div>

        )
    }

    return (
        <>
            {generateSideMenu()}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

export default connect(mapStateToProps)(SideMenu);
