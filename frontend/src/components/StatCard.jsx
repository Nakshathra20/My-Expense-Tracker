
function StatCard({ title, value, icon, color }) { 
    return (
      <div className={"card stat-card " + color}>
        <div className="label">{icon} {title}</div>
        <div className="value">{value}</div>
      </div>
    );
  }
  
  export default StatCard;