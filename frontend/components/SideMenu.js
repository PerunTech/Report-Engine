import {
  React,
  connect,
  elements,
  axios,
  Loading,
  PropTypes
} from "perun-core";
import { icons } from '../assets/svgHolder';
import { typeBadgeClass } from '../assets/fieldTypes';
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
    axios.get(`${window.server}/ReactElements/getTableData/${props.svSession}/SVAROG_TABLES/0`).then((res) => {
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
    const visibleTables = input ? inputArr : tables
    if (input && inputArr.length === 0) {
      return <div className={'re-rail-empty'}>{labelsManager.importLabel('no_tables_found', 'report_engine', context)}</div>
    }
    return visibleTables.map(table => generateTable(table))
  }

  const generateTable = (table) => {
    const isParent = table['SVAROG_TABLES.PARENT_ID'] === 0
    //only one parent table can feed a report, so the others are out of reach while one is picked
    const isLocked = isParent && props.lockedParent && table['SVAROG_TABLES.TABLE_NAME'] !== props.lockedParent
    return (
      <div className={`re-table ${table.opened ? 're-table--open' : ''} ${isLocked ? 're-table--locked' : ''}`}
        key={table['SVAROG_TABLES.OBJECT_ID']} id={table['SVAROG_TABLES.OBJECT_ID']}>
        <button type={'button'} className={'re-table-head'} onClick={() => handleClick(table)}>
          <span className={'re-chevron'}>{icons.chevron}</span>
          <span className={'re-table-name'} title={table['SVAROG_TABLES.TABLE_NAME']}>{table['SVAROG_TABLES.TABLE_NAME']}</span>
          {isParent && <span className={'re-badge re-badge--parent'}>{labelsManager.importLabel('parent_table', 'report_engine', context)}</span>}
          {table.childList && <span className={'re-count'}>{table.childList.length}</span>}
        </button>
        {table.opened && <div className={'re-field-list'}>
          {generateSideMenuChild(table)}
        </div>}
      </div>
    )
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
    if (!table.childList || table.childList.length === 0) {
      return <div className={'re-field-empty'}>{labelsManager.importLabel('no_fields_found', 'report_engine', context)}</div>
    }
    return table.childList.map((field) => {
      const isSelected = props.selectedKeys.indexOf(field.key) !== -1
      return (
        <div className={`re-field-row ${isSelected ? 're-field-row--selected' : ''}`}
          onClick={(e) => props.handleFieldClick(e, field, tableobj)} key={field.key}>
          <span className={'re-field-info'}>
            <span className={'re-field-name'} title={field['FIELD_NAME']}>{field['FIELD_NAME']}</span>
            {field.name && field.name !== field['FIELD_NAME'] && <span className={'re-field-label'}>{field.name}</span>}
          </span>
          {field['FIELD_TYPE'] && <span className={`re-type-badge ${typeBadgeClass(field['FIELD_TYPE'])}`}>{field['FIELD_TYPE']}</span>}
          <span className={'re-field-action'}>{isSelected ? icons.check : icons.plus}</span>
        </div>
      )
    })
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
  }

  return (
    <>
      {loading && <Loading />}
      <div className={'re-rail-search'}>
        <span className={'re-rail-search-icon'}>{icons.search}</span>
        <input className={'re-rail-search-input'} placeholder={labelsManager.importLabel('enter_search_value', 'report_engine', context)} onChange={(e) => { onChange(e) }} type={'text'} />
      </div>
      <div className={'re-rail-body'}>
        {generateSideMenu()}
      </div>
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
