import {logs} from '../data/logs';

const Dashboard = () => {
    const totalCarbon = logs.reduce((total, log) => total + log.carbon, 0);

    return (    
        <div style={{textAlign:"left"}}>
            <h2>Dashboard</h2>
            <p>Total Carbon Footprint: {totalCarbon} kg CO2</p>

            <ul>
                {logs.map(log => (
                    <li key={log.id}>
                        {log.activity} = {log.carbon} kg
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;