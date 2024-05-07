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
import { downloadFile } from '../../assets/DownloadFile';
import { labelsManager } from "../../assets/LabelsExport";
import { schema, uiSchema } from "../AggregateFormSchema";
import "../style.css"
const { useEffect, useState } = React
let globalArr = []
const MainContent = (props, context) => {
  const [mainContentOne, setMainContnetOne] = useState(undefined)
  const [mainContentTwo, setMainContnetTwo] = useState(undefined)
  const [mainContentThree, setMainContnetThree] = useState(undefined)
  const [formData, setFormData] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const { alertUser } = elements
  useEffect(() => {
    generateMainContentOne()
  }, [props.selectedFields])

  useEffect(() => {
    return () => {
      globalArr = []
    }
  }, [])
  //generates  the table names and creates a basic clone array of objects for the formData
  const generateMainContentOne = () => {
    let tempArr = globalArr
    let key = 'key'
    if (props.isAnalytics) {
      key = 'KEY'
    }
    let content = (<div className={'report-engine-class-for-scroll report-engine-main-field-container'}>
      {props.selectedFields.map(field => {
        { tempArr.push({ field_name: field[`${key}`], field_type: field.FIELD_TYPE ? field.FIELD_TYPE : '', operator: 'equal', dropDownOptions: field.formatterOptions ? field.formatterOptions : [] }) }
        let newobj = { ['field[`${key}`]']: {} }
        Object.assign(globalArr, newobj)
        return <div className={`custom-select  report-engine-main-content-select  report-engine-main-field-one ${field.parent && 'report-engine-has-parent'}`}>
          <p>{field[`${key}`]}</p>

        </div>
      })}
    </div>)
    setMainContnetOne(content)
    tempArr = tempArr.reverse()
    let uniqueObjArray = [...new Map(tempArr.map((item) => [item["field_name"], item])).values()];
    globalArr = uniqueObjArray
    globalArr = globalArr.reverse()
    generateMainContentThree()
    generateMainContentTwo()
  }


  //generates the dropdown
  const generateMainContentTwo = () => {
    let content = (<div className={'report-engine-main-field-container'}>
      {globalArr.map(field => {
        switch (field.field_type) {
          case 'NUMERIC':
            return <select className={'custom-select report-engine-main-content-select'} onChange={(e) => onChange(e, 'operator')} id={field.field_name} key={field.field_name}>
              <option value={'equal'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-equal', defaultMessage: 'perun.plugin.report-engine-equal' })}</option>
              <option value={'less'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-less', defaultMessage: 'perun.plugin.report-engine-less' })}</option>
              <option value={'greater'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-greater', defaultMessage: 'perun.plugin.report-engine-greater' })}</option>
              {props.isAnalytics && <option value={'sum'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-sum', defaultMessage: 'perun.plugin.report-engine-sum' })}</option>}
            </select>
          case 'NVARCHAR':
            return <select className={`custom-select report-engine-main-content-select`} onChange={(e) => onChange(e, 'operator')} id={field.field_name} key={field.field_name}>
              <option value={'equal'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-equal', defaultMessage: 'perun.plugin.report-engine-equal' })}</option>
              <option value={'like'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-like', defaultMessage: 'perun.plugin.report-engine-like' })}</option>
              <option value={'startsWith'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-start', defaultMessage: 'perun.plugin.report-engine-start' })}</option>
              <option value={'endsWith'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-end', defaultMessage: 'perun.plugin.report-engine-end' })}</option>
            </select>
          default:
            return <select className={`custom-select report-engine-main-content-select`} onChange={(e) => onChange(e, 'operator')} id={field.field_name} key={field.field_name}>
              <option value={'equal'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-equal', defaultMessage: 'perun.plugin.report-engine-equal' })}</option>
              <option value={'like'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-like', defaultMessage: 'perun.plugin.report-engine-like' })}</option>
              <option value={'startsWith'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-start', defaultMessage: 'perun.plugin.report-engine-start' })}</option>
              <option value={'endsWith'}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-end', defaultMessage: 'perun.plugin.report-engine-end' })}</option>
            </select>
        }

      })}
    </div>)
    setMainContnetTwo(content)
  }
  //Used to generate the inputs 
  const generateMainContentThree = () => {
    let content = (<div className={'report-engine-main-field-container'}>
      {globalArr.map(field => {
        if (field?.dropDownOptions?.length > 0) {
          return (<div className={'report-engine-input-container'}>
            <select className={`custom-select report-engine-main-content-select`} onChange={(e) => onChange(e, 'drop-down')} name={field.field_name} id={field.field_name}>
              {field.dropDownOptions.map((opt, i) =>
                <option key={`${field.field_name}/${opt.id}`} selected={i === 0 ? true : false} id={`${field.field_name}/${opt.id}`} value={opt.value}>{opt.text}</option>
              )}
            </select>
            <span onClick={() => {
              props.removeFileClick(field)
              innerRemoveFunc(field)
            }}>{icons.delete}</span>
          </div>)
        } else {
          return (<div className={'report-engine-input-container'}><input value={field.value && field.value} style={{ 'background': 'none' }}
            className={'custom-select report-engine-main-content-select'}
            onChange={(e) => onChange(e, 'input')} key={field.field_name} id={field.field_name} type={fieldType(field)} /> <span onClick={() => {
              props.removeFileClick(field)
              innerRemoveFunc(field)
            }}>{icons.delete}</span> </div>)
        }
      })}
    </div >)
    setMainContnetThree(content)
  }

  const removeAfterSlash = (str) => {
    const symbol = str.indexOf('/');
    if (symbol !== -1) {
      return str.substring(0, symbol);
    }
    return str;
  }

  //basic onchange function to handle input/select changes
  const onChange = (e, inputType) => {
    let tempArr = globalArr
    tempArr.forEach(field => {
      if (inputType === 'input') {
        if (field.field_name === e.target.id) {
          field.value = e.target.value
        }
      } else if (inputType === 'drop-down') {
        if (field.field_name === removeAfterSlash(e.target[e.target.selectedIndex].id)) {
          field.value = e.target.value
        }
      }
      else {
        if (field.field_name === e.target.id) {
          field.operator = e.target.value
        }
      }
    })
    globalArr = tempArr
    generateMainContentThree()
  }

  const fieldType = (field) => {
    let fieldType
    switch (field.field_type) {
      case 'NUMERIC':
        fieldType = 'number';
        break;
      case 'NVARCHAR':
        fieldType = 'string';
        break;
      default:
        fieldType = 'string';

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
  }

  const onClickCheckbox = (e) => {
    setFormData(e.formData)

  }

  const removeDropDownOptions = (arr) => {
    const modifiedArray = arr.map(obj => {
      const { dropDownOptions, ...rest } = obj;
      return rest;
    });
    return modifiedArray;
  }


  const getData = () => {
    let temp = JSON.parse(JSON.stringify(globalArr))
    temp = setValueFunc(temp)
    temp = removeDropDownOptions(temp)
    setLoading(true)
    let url = window.server + `/svarog-reporting/get/xls/${props.svSession}`
    let data = { 'params': [temp, { aggregates: formData.aggregateFunctions }] }

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
    }).catch(err => {
      console.error(err)
      setLoading(false)
      alertUser(true, 'error', err.response?.data?.title || '', err.response?.data?.message || '');
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

  return (
    <>
      {loading && <Loading />}
      <div className={'report-engine-mid-content-container'}>
        <div className={'report-engine-mid-content'}>{mainContentOne}</div>

        <div className={'report-engine-mid-content'}>{mainContentTwo}</div>
        <div className={'report-engine-mid-content'}>{mainContentThree}</div>
      </div>

      <div className={'report-engine-mid-content-btn-holder'}>
        <div class='report-engine-checkbox'>
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
        <button className={'btn-success btn_save_form report-engine-btn-width'} onClick={() => getData()}>{context.intl.formatMessage({ id: 'perun.plugin.report-engine-generate-report', defaultMessage: 'perun.plugin.report-engine-generate-report' })}</button>
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
