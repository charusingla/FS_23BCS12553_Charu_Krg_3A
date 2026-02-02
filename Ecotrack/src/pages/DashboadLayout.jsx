import{Link,Outlet} from" react-router-dom";
const DashboardLayout =()=>{
    return(
        <div style={{padding:"1rem"}}>
            <h3>
                Dashboard
            </h3>
            <nav>
                <Link to="summary">Summary</Link>|{" "}
                <Link to="ananlytics">Analythics</Link>
            </nav>
            <hr />
            <Outlet/>
        </div>
    )
}