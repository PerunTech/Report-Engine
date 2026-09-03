import {
  React,
  connect,
  axios,
  Loading,
  PropTypes,
  elements,
  Form,
  validator
} from "perun-core";
import { icons } from "../../assets/svgHolder";
import { typeBadgeClass } from "../../assets/fieldTypes";
import { downloadFile } from '../../assets/DownloadFile';
import { labelsManager } from "../../assets/LabelsExport";
import { schema, uiSchema } from "../AggregateFormSchema";
const { useEffect, useState } = React
let globalArr = []
const MainContent = (props, context) => {
  //globalArr stays the source of truth for the criteria; criteria is its render mirror
  const [criteria, setCriteria] = useState([])
  const [formData, setFormData] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const { alertUserResponse } = elements
  useEffect(() => {
    syncCriteria()
  }, [props.selectedFields])

  useEffect(() => {
    return () => {
      globalArr = []
    }
  }, [])

  const publish = () => setCriteria([...globalArr])

  //merges the fields picked in the side menu into the criteria list, keeping
  //the operator and value already entered for the ones that were there before
  const syncCriteria = () => {
    let key = 'key'
    if (props.isAnalytics) {
      key = 'KEY'
    }
    let tempArr = globalArr
    props.selectedFields.forEach(field => {
      tempArr.push({
        field_name: field[`${key}`],
        field_type: field.FIELD_TYPE ? field.FIELD_TYPE : '',
        operator: 'equal',
        dropDownOptions: field.formatterOptions ? field.formatterOptions : [],
        field_label: field['FIELD_NAME'] ? field['FIELD_NAME'] : field[`${key}`],
        table_name: field['TABLE_NAME'] ? field['TABLE_NAME'] : '',
        parent: field.parent ? true : false
      })
    })
    tempArr = tempArr.reverse()
    let uniqueObjArray = [...new Map(tempArr.map((item) => [item["field_name"], item])).values()];
    globalArr = uniqueObjArray.reverse()
    publish()
  }

  const operatorOptions = (field) => {
    switch (field.field_type) {
      case 'NUMERIC':
        return [
          { value: 'equal', id: 'perun.plugin.report-engine-equal' },
          { value: 'less', id: 'perun.plugin.report-engine-less' },
          { value: 'greater', id: 'perun.plugin.report-engine-greater' },
          ...(props.isAnalytics ? [{ value: 'sum', id: 'perun.plugin.report-engine-sum' }] : [])
        ]
      default:
        return [
          { value: 'equal', id: 'perun.plugin.report-engine-equal' },
          { value: 'like', id: 'perun.plugin.report-engine-like' },
          { value: 'startsWith', id: 'perun.plugin.report-engine-start' },
          { value: 'endsWith', id: 'perun.plugin.report-engine-end' }
        ]
    }
  }

  //basic onchange function to handle input/select changes
  const onChange = (e, inputType) => {
    const fieldName = e.target.dataset.field
    globalArr.forEach(field => {
      if (field.field_name === fieldName) {
        if (inputType === 'operator') {
          field.operator = e.target.value
        } else {
          field.value = e.target.value
        }
      }
    })
    publish()
  }

  const fieldType = (field) => {
    let fieldType
    switch (field.field_type) {
      case 'NUMERIC':
        fieldType = 'number';
        break;
      default:
        fieldType = 'text';

    }
    return fieldType
  }
  //
  const innerRemoveFunc = (file) => {
    globalArr.forEach((field, i) => {
      if (field.field_name === file.field_name) {
        globalArr.splice(i, 1)
      }
    })
    publish()
  }

  const removeCriterion = (field) => {
    props.removeFileClick(field)
    innerRemoveFunc(field)
  }

  const onClickCheckbox = (e) => {
    setFormData(e.formData)

  }

  //only the four keys the reporting service expects ever leave the browser
  const toPayload = (arr) => {
    return arr.map(field => ({
      field_name: field.field_name,
      field_type: field.field_type,
      operator: field.operator,
      value: field.value
    }))
  }


  const getData = () => {
    let temp = JSON.parse(JSON.stringify(globalArr))
    temp = setValueFunc(temp)
    temp = toPayload(temp)
    setLoading(true)
    let url = window.server + `/svarog-reporting/get/xls/${props.svSession}`
    let aggregates = formData && formData.aggregateFunctions ? formData.aggregateFunctions : []
    let data = { 'params': [temp, { aggregates: aggregates }] }

    axios({
      method: "post",
      data: JSON.stringify(data),
      url,
      responseType: 'blob',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(res => {
      downloadFile(res, 'file', () => {
        setLoading(false)
      })
    }).catch(async err => {
      console.error(err)
      setLoading(false)
      if (err.response && err.response.data) {
        // Convert the Blob to text
        const text = await err.response.data.text();
        // Parse the text to JSON
        const jsonResponse = JSON.parse(text);
        alertUserResponse({ response: jsonResponse });
      }
    })
  }

  const setValueFunc = (arr) => {
    arr.forEach(obj => {
      if (obj.dropDownOptions && obj.dropDownOptions.length > 0 && !obj.value) {
        obj.value = obj.dropDownOptions[0].value;
      }
    });
    return arr;
  }

  const renderValueControl = (field) => {
    if (field?.dropDownOptions?.length > 0) {
      const value = field.value !== undefined ? field.value : field.dropDownOptions[0].value
      return (
        <select className={'re-select'} data-field={field.field_name} id={`re-value-${field.field_name}`}
          value={value} onChange={(e) => onChange(e, 'value')}>
          {field.dropDownOptions.map(opt =>
            <option key={`${field.field_name}/${opt.id}`} value={opt.value}>{opt.text}</option>
          )}
        </select>
      )
    }
    return (
      <input className={'re-input'} data-field={field.field_name} id={`re-value-${field.field_name}`}
        type={fieldType(field)} value={field.value !== undefined ? field.value : ''}
        placeholder={labelsManager.importLabel('value', 'report_engine', context)}
        onChange={(e) => onChange(e, 'value')} />
    )
  }

  return (
    <>
      {loading && <Loading />}
      <div className={'re-criteria'}>
        <div className={'re-criteria-head'}>
          <span>{labelsManager.importLabel('field', 'report_engine', context)}</span>
          <span>{labelsManager.importLabel('operator', 'report_engine', context)}</span>
          <span>{labelsManager.importLabel('value', 'report_engine', context)}</span>
          <span />
        </div>
        <div className={'re-criteria-body'}>
          {criteria.map(field =>
            <div className={`re-criteria-row ${field.parent ? 're-criteria-row--parent' : ''}`} key={field.field_name}>
              <div className={'re-criteria-field'}>
                <div className={'re-criteria-field-top'}>
                  <span className={'re-field-name'} title={field.field_name}>{field.field_label}</span>
                  {field.field_type && <span className={`re-type-badge ${typeBadgeClass(field.field_type)}`}>{field.field_type}</span>}
                </div>
                {field.table_name && <span className={'re-field-label'}>{field.table_name}</span>}
              </div>
              <select className={'re-select'} data-field={field.field_name} id={`re-operator-${field.field_name}`}
                value={field.operator} onChange={(e) => onChange(e, 'operator')}>
                {operatorOptions(field).map(option =>
                  <option key={option.value} value={option.value}>
                    {context.intl.formatMessage({ id: option.id, defaultMessage: option.id })}
                  </option>
                )}
              </select>
              {renderValueControl(field)}
              <button className={'re-row-remove'} type={'button'} id={`re-btn-remove-${field.field_name}`}
                title={labelsManager.importLabel('remove_field', 'report_engine', context)}
                onClick={() => removeCriterion(field)}>{icons.close}</button>
            </div>
          )}
        </div>
      </div>

      <div className={'re-actionbar'}>
        <div className={'re-aggregates'}>
          <span className={'re-aggregates-label'}>{labelsManager.importLabel('aggregate_functions', 'report_engine', context)}</span>
          <Form
            id='functions'
            key='functions'
            validator={validator}
            schema={schema}
            uiSchema={uiSchema}
            onChange={onClickCheckbox}
            formData={formData}
          >
            <></>
          </Form>
        </div>
        <button id={'re-btn-generate-report'} className={'re-primary-btn'} onClick={() => getData()}>
          {icons.download}
          <span>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-generate-report', defaultMessage: 'perun.plugin.report-engine-generate-report' })}</span>
        </button>
      </div>

    </>
  )
}
const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});
MainContent.contextTypes = {
  intl: PropTypes.object.isRequired
}
export default connect(mapStateToProps)(MainContent);
