import React from "react";

const Logs = ({ logs }) => {
  return (
    <div>
      <h2>Activity Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            {log.activity}: {log.carbon} carbon units
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Logs;
