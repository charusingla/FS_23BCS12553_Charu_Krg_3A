import { logs } from "../data/logs";

const Dashboard = () => {
  const totalCarbon = logs.reduce((sum, log) => sum + log.carbon, 0);

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        <li>Total Carbon Emissions: {totalCarbon} kg</li>
      </ul>
    </div>
  );
};

export default Dashboard;
