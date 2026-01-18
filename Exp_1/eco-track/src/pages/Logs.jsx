import {logs} from '../data/logs';

const Logs = () => {
    const highImpactLogs = logs.filter(
        log => log.carbon >= 4
    );
    const total_HighCarbon = highImpactLogs.reduce((sum, high) => sum + high.carbon, 0);

    return (
        <div style={{textAlign:"left"}}>
            <p>Total of High Carbon Footprints: {total_HighCarbon} kg CO2</p>
            <p>High Carbon Activities are:</p>
            <ul>
                {highImpactLogs.map(log => (
                    <li key={log.id}>
                        {log.activity} = {log.carbon} kg
                    </li>
                ))
            }
            </ul>
        </div>
    );
};

export default Logs;