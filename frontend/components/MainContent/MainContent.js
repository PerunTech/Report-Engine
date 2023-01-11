import {
    React,
    connect
} from "perun-core";
import style from "./../../assets/ReportEngine.module.css"
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
        generateMainContentThree()
        generateMainContentTwo()
        tempArr = tempArr.reverse()
        let uniqueObjArray = [...new Map(tempArr.map((item) => [item["name"], item])).values()];
        globalArr = uniqueObjArray
        globalArr = globalArr.reverse()
    }


    const generateMainContentTwo = () => {
        let content = (<div className={style['main-field-container']}>
            {props.selectedFields.map(field => {
                return <select className={`custom-select ${style['main-content-select']}`} onChange={(e) => onChange(e, 'dd')} id={field.key}>
                    <option value={'equal'}>Equal</option>
                    <option value={'withlike'}>WithLike</option>
                    <option value={'endswith'}>Ends with</option>
                    <option value={'beginswith'}>Begins with</option>
                </select>
            })}
        </div>)
        setMainContnetTwo(content)
    }


    const generateMainContentThree = () => {
        let content = (<div className={style['main-field-container']}>
            {props.selectedFields.map(field => {
                return <input style={{ 'background': 'none' }} className={`custom-select ${style['main-content-select']}`} onChange={(e) => onChange(e, 'input')} id={field.key} type='string' />
            })}
        </div>)
        setMainContnetThree(content)
    }
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
