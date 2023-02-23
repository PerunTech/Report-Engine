import {
  React,
  connect,
  axios
} from "perun-core";
import style from "./../../assets/ReportEngine.module.css"
import { icons } from "../../assets/svgHolder";
const { useEffect, useState } = React
let globalArr = []
const MainContent = (props) => {
  const [mainContentOne, setMainContnetOne] = useState(undefined)
  const [mainContentTwo, setMainContnetTwo] = useState(undefined)
  const [mainContentThree, setMainContnetThree] = useState(undefined)
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
    let content = (<div className={style['main-field-container']}>
      {props.selectedFields.map(field => {
        { tempArr.push({ field_name: field.key, field_type: field.FIELD_TYPE ? field.FIELD_TYPE : '', operator: 'equal' }) }
        let newobj = { ['field.key']: {} }
        Object.assign(globalArr, newobj)
        return <div className={`${style['main-field-one']} ${field.parent && style['has-parent']}`}>
          <p>{field.key}</p>

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
    let content = (<div className={style['main-field-container']}>
      {globalArr.map(field => {
        return <select className={`custom-select ${style['main-content-select']}`} onChange={(e) => onChange(e, 'operator')} id={field.field_name} key={field.field_name}>
          <option value={'equal'}>Equal</option>
          <option value={'like'}>Like</option>
          <option value={'endswith'}>Ends with</option>
          <option value={'beginswith'}>Begins with</option>
        </select>
      })}
    </div>)
    setMainContnetTwo(content)
  }
  //Used to generate the inputs 
  const generateMainContentThree = () => {
    let content = (<div className={style['main-field-container']}>
      {globalArr.map(field => {
        return (<div className={style['input-container']}><input value={field.value && field.value} style={{ 'background': 'none' }}
          className={`custom-select ${style['main-content-select']}`}
          onChange={(e) => onChange(e, 'input')} key={field.field_name} id={field.field_name} type={fieldType(field)} /> <span onClick={() => {
            props.removeFileClick(field)
            innerRemoveFunc(field)
          }}>{icons.delete}</span> </div>)
      })}
    </div>)
    setMainContnetThree(content)
  }
  //basic onchange function to handle input/select changes
  const onChange = (e, inputType) => {
    let tempArr = globalArr
    tempArr.forEach(field => {
      if (inputType === 'input') {
        if (field.field_name === e.target.id) {
          field.value = e.target.value
        }
      } else {
        if (field.field_name === e.target.id) {
          field.operator = e.target.value
        }
      }
    })
    globalArr = tempArr
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
  const getData = () => {
    let url = window.server + `/WsReporting/svarog-reporting/get/xls/${props.svSession}`
    axios({
      method: "post",
      data: globalArr,
      url: url,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(res => {
      console.log(res.data)
    })
  }
  return (
    <>

      <div className={style['mid-content-container']}>
        <div className={style['mid-content']}>{mainContentOne}</div>

        <div className={style['mid-content']}>{mainContentTwo}</div>
        <div className={style['mid-content']}>{mainContentThree}</div>
      </div>
      <div className={style['mid-content-btn-holder']}>
        <button className={`btn-success btn_save_form ${style['btn-width']}`} onClick={() => getData()}>Generate Report</button>
      </div>

    </>
  )
}
const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

export default connect(mapStateToProps)(MainContent);
