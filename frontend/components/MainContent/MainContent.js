import {
    React,
    connect
} from "perun-core";
import style from "./../../assets/ReportEngine.module.css"
const MainContent = (props) => {

    useEffect(() => {
        generateMainContent()
    }, [props.selectedFields])

    const generateMainContent = () => {
    }

    return (
        <>
            <div className={style['mid-content-container']}>
                <div className={style['mid-content']}>MainContent1</div>
                <div className={style['mid-content']}>MainContent2</div>
                <div className={style['mid-content']}>MainContent3</div>
            </div>
            <div>
                <div>MainContent4</div>
            </div>
        </>
    )
}
const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

export default connect(mapStateToProps)(MainContent);
