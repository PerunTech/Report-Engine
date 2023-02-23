import {
    React,
    connect,
    elements,
    axios,
    Loading
} from "perun-core";
import style from "./../assets/ReportEngine.module.css"
import { icons } from '../assets/svgHolder';
const { useState, useEffect } = React;

const SideMenu = (props) => {
    const [tables, setTables] = useState([])
    const [loading, setLoading] = useState(false)
    const [inputArr, setinputArr] = useState([])
    const [input, setInput] = useState('')

    useEffect(() => {
        setLoading(true)
        axios.get(`${window.server}/ReactElements/getTableData/${props.svSession}/SVAROG_TABLES/100000`).then((res) => {
            res.data.forEach(data => {
                data.opened = false;
                setLoading(false)
            })
            setTables(res.data)
        })
    }, [])

    const generateSideMenu = () => {
        if (input) {
            if (inputArr.length > 0) {
                return inputArr.map(table => <div style={{ 'cursor': 'pointer' }} className={`${style['table-container']} ${table.opened ? style['opened'] : style['closed']}`} onClick={() => handleClick(table)} key={table['SVAROG_TABLES.OBJECT_ID']} id={table['SVAROG_TABLES.OBJECT_ID']}>
                    <div className={style['table-name']}><p>{table['SVAROG_TABLES.TABLE_NAME']}</p> <span>{table.opened ? icons.minus : icons.plus}</span></div>
                    {table.opened && <div className={style['field-container']}>
                        {generateSideMenuChild(table)}
                    </div>}
                </div>)
            } else {
                return <div className={style['empty-search-container']}><p>Нема пронајдени табели</p></div>
            }
        } else {
            return tables.map(table => <div style={{ 'cursor': 'pointer' }} className={`${style['table-container']} ${table.opened ? style['opened'] : style['closed']}`} onClick={() => handleClick(table)} key={table['SVAROG_TABLES.OBJECT_ID']} id={table['SVAROG_TABLES.OBJECT_ID']}>
                <div className={style['table-name']}><p>{table['SVAROG_TABLES.TABLE_NAME']}</p> <span>{table.opened ? icons.minus : icons.plus}</span></div>
                {table.opened && <div className={style['field-container']}>
                    {generateSideMenuChild(table)}
                </div>}
            </div>)
        }
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
                    setLoading(true)
                    axios.get(`${window.server}/ReactElements/getTableFieldListFull/${props.svSession}/${table['SVAROG_TABLES.TABLE_NAME']}/true`).then((res) => {
                        object.childList = res.data
                        object.opened = true
                        setTables(tempArr)
                        setLoading(false)
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

    const onChange = (e) => {
        let tempArr = []
        setInput(e.target.value.toUpperCase())
        tables.forEach(element => {
            if (element['SVAROG_TABLES.TABLE_NAME'].toUpperCase().startsWith(e.target.value.toUpperCase())) {
                tempArr.push(element)
            }
        })
        setinputArr(tempArr)
        generateSideMenu(tempArr)
    }

    return (
        <>
            {loading && <Loading />}
            <div className={style['search-div']}><span>{icons.search}</span><input placeholder={'Внесете вредност за пребарување'} onChange={(e) => { onChange(e) }} type='string' /></div>
            {generateSideMenu()}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

export default connect(mapStateToProps)(SideMenu);
