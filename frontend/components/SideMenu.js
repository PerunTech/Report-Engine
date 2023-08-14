import {
  React,
  connect,
  elements,
  axios,
  Loading,
  PropTypes
} from "perun-core";
import { icons } from '../assets/svgHolder';
import { labelsManager } from "../assets/LabelsExport"
const { useState, useEffect } = React;
const { alertUser } = elements
const SideMenu = (props, context) => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputArr, setinputArr] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    setLoading(true)
    axios.get(`${window.server}/ReactElements/getTableData/${props.svSession}/SVAROG_TABLES/100000`).then((res) => {
      let temp1 = []
      let temp2 = []
      res.data.forEach(data => {
        data.opened = false;
        setLoading(false)
      })
      res.data.map(table => {
        if (table['SVAROG_TABLES.PARENT_ID'] !== 0) {
          temp1.push(table)
        }
        else { temp2.push(table) }
      })
      setTables(temp1.concat(temp2))
    }).catch(err => {
      console.log(err.response)
      const title = err.response?.data?.title || labelsManager.importLabel('error_occurred', 'report_engine', context)
      const message = err.response?.data?.message || err.response?.data
      alertUser(true, 'error', title, message)
      setLoading(false)
    })
  }, [])

  const generateSideMenu = () => {
    if (input) {
      if (inputArr.length > 0) {
        return inputArr.map(table => <div style={{ 'cursor': 'pointer' }} className={`report-engine-table-container ${table.opened ? 'report-engine-opened' : 'report-engine-closed'} ${table['SVAROG_TABLES.PARENT_ID'] === 0 ? 'report-engine-parent' : 'report-engine-notparent'}`} onClick={() => handleClick(table)} key={table['SVAROG_TABLES.OBJECT_ID']} id={table['SVAROG_TABLES.OBJECT_ID']}>
          <div className={'report-engine-table-name'}><p>{table['SVAROG_TABLES.TABLE_NAME']}</p> <span>{table.opened ? icons.minus : icons.plus}</span></div>
          {table.opened && <div className={`report-engine-field-container ${table['SVAROG_TABLES.PARENT_ID'] === 0 ? 'report-engine-has-parent' : 'report-engine-noparent'}`}>
            {generateSideMenuChild(table)}
          </div>}
        </div>)
      } else {
        return <div className={'report-engine-empty-search-container'}><p>{labelsManager.importLabel('no_tables_found', 'report_engine', context)}</p></div>
      }
    } else {
      return tables.map(table => <div style={{ 'cursor': 'pointer' }} className={`report-engine-table-container ${table.opened ? 'report-engine-opened' : 'report-engine-closed'} ${table['SVAROG_TABLES.PARENT_ID'] === 0 ? 'report-engine-parent' : 'report-engine-notparent'}`} onClick={() => handleClick(table)} key={table['SVAROG_TABLES.OBJECT_ID']} id={table['SVAROG_TABLES.OBJECT_ID']}>
        <div className={'report-engine-table-name'}><p>{table['SVAROG_TABLES.TABLE_NAME']}</p> <span>{table.opened ? icons.minus : icons.plus}</span></div>
        {table.opened && <div className={`report-engine-field-container ${table['SVAROG_TABLES.PARENT_ID'] === 0 ? 'report-engine-has-parent' : 'report-engine-noparent'}`}>
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

  const generateSideMenuChild = (table) => {
    let tableobj = table
    return table.childList.map((field) => <div onClick={(e) => props.handleFieldClick(e, field, tableobj)} key={field.key}>

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
      <div className={'report-engine-search-div'}><span>{icons.search}</span><input placeholder={labelsManager.importLabel('enter_search_value', 'report_engine', context)} onChange={(e) => { onChange(e) }} type='string' /></div>
      {generateSideMenu()}
    </>
  );
};

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});
SideMenu.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(SideMenu);
