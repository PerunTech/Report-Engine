import {
  React,
  connect,
  elements,
  axios,
  PropTypes,
  Loading
} from "perun-core";
import { icons } from '../assets/svgHolder';
import { typeBadgeClass } from '../assets/fieldTypes';
const { alertUser } = elements
const { useState, useEffect } = React;
import { labelsManager } from "../assets/LabelsExport"
const SideMenuAnalytics = (props, context) => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputArr, setinputArr] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    setLoading(true)
    axios.get(`${window.server}/svarog-reporting/get/analytics/tables/${props.svSession}/`).then((res) => {
      res.data.forEach(data => {
        data.opened = false;

      })
      setLoading(false)
      setTables(res.data)
    }).catch(err => {
      console.log(err.response)
      const title = err.response?.data?.title || labelsManager.importLabel('error_occurred', 'report_engine', context)
      const message = err.response?.data?.message || err.response?.data
      alertUser(true, 'error', title, message)
      setLoading(false)
    })
  }, [])

  const generateSideMenuAnalytics = () => {
    const visibleTables = input ? inputArr : tables
    if (input && inputArr.length === 0) {
      return <div className={'re-rail-empty'}>{labelsManager.importLabel('no_tables_found', 'report_engine', context)}</div>
    }
    return visibleTables.map(table => (
      <div className={`re-table ${table.opened ? 're-table--open' : ''}`} key={table['OBJECT_ID']} id={table['OBJECT_ID']}>
        <button type={'button'} className={'re-table-head'} onClick={() => handleClick(table)}>
          <span className={'re-chevron'}>{icons.chevron}</span>
          <span className={'re-table-name'} title={table['OBJECT_NAME']}>{table['OBJECT_NAME']}</span>
          {table.childList && <span className={'re-count'}>{table.childList.length}</span>}
        </button>
        {table.opened && <div className={'re-field-list'}>
          {generateSideMenuAnalyticsChild(table)}
        </div>}
      </div>
    ))
  }

  const handleClick = (table) => {
    let tempArr = [...tables]
    if (table.opened) {
      tempArr.forEach(object => {
        if (object['OBJECT_ID'] == table['OBJECT_ID']) {
          object.opened = false
        }
      })
      setTables(tempArr)
    } else {
      tempArr.forEach(object => {
        if (object['OBJECT_ID'] == table['OBJECT_ID']) {
          setLoading(true)
          axios.get(`${window.server}/svarog-reporting/get/analytics/fields/${props.svSession}/${table['OBJECT_NAME']}`).then((res) => {
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

  const generateSideMenuAnalyticsChild = (table) => {
    let tableobj = table
    if (!table.childList || table.childList.length === 0) {
      return <div className={'re-field-empty'}>{labelsManager.importLabel('no_fields_found', 'report_engine', context)}</div>
    }
    return table.childList.map((field) => {
      const isSelected = props.selectedKeys.indexOf(field['KEY']) !== -1
      return (
        <div className={`re-field-row ${isSelected ? 're-field-row--selected' : ''}`}
          onClick={(e) => props.handleFieldClick(e, field, tableobj)} key={field['KEY']}>
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
      if (element['OBJECT_NAME'].toUpperCase().startsWith(e.target.value.toUpperCase())) {
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
        {generateSideMenuAnalytics()}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

SideMenuAnalytics.contextTypes = {
  intl: PropTypes.object.isRequired
}
export default connect(mapStateToProps)(SideMenuAnalytics);
