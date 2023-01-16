import {
    React,
    connect
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
                { tempArr.push({ name: field.key, dd: 'equal' }) }
                let newobj = { ['field.key']: {} }
                Object.assign(globalArr, newobj)
                return <div className={style['main-field-one']}>
                    <p>{field.key}</p>

                </div>
            })}
        </div>)
        setMainContnetOne(content)
        tempArr = tempArr.reverse()
        let uniqueObjArray = [...new Map(tempArr.map((item) => [item["name"], item])).values()];
        globalArr = uniqueObjArray
        globalArr = globalArr.reverse()
        generateMainContentThree()
        generateMainContentTwo()
    }
//generates the dropdown
    const generateMainContentTwo = () => {
        let content = (<div className={style['main-field-container']}>
            {globalArr.map(field => {
                return <select className={`custom-select ${style['main-content-select']}`} onChange={(e) => onChange(e, 'dd')} id={field.name} key={field.name}>
                    <option value={'equal'}>Equal</option>
                    <option value={'withlike'}>WithLike</option>
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
                return (<div className={style['input-container']}><input value={field.input && field.input} style={{ 'background': 'none' }} className={`custom-select ${style['main-content-select']}`} onChange={(e) => onChange(e, 'input')} key={field.name} id={field.name} type='string'/> <span onClick={()=>{
                    props.removeFileClick(field)
                    innerRemoveFunc(field)
                }}>{icons.delete}</span> </div> )
            })}
        </div>)
        setMainContnetThree(content)
    }
//basic onchange function to handle input/select changes
    const onChange = (e, inputType) => {
        let tempArr = globalArr
        tempArr.forEach(field => {
            if (inputType === 'input') {
                if (field.name === e.target.id) {
                    field.input = e.target.value
                }
            } else {
                if (field.name === e.target.id) {
                    field.dd = e.target.value
                }
            }
        })
        globalArr = tempArr
    }
//
const innerRemoveFunc=(file)=>{
    globalArr.forEach((field,i)=>{
        if(field.name===file.name){
           globalArr.splice(i,1)
        }
    })
  }
    return (
        <>

            <div className={style['mid-content-container']}>
                <div className={style['mid-content']}>{mainContentOne}</div>

                <div className={style['mid-content']}>{mainContentTwo}</div>
                <div className={style['mid-content']}>{mainContentThree}</div>
            </div>
            <div>
                <button className={`btn-success btn_save_form`} onClick={() => { console.log(globalArr) }}>Generate Report</button>
            </div>

        </>
    )
}
const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

export default connect(mapStateToProps)(MainContent);
