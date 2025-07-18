import "../styles/ProgressCircle.css";

const ProgressCircle = ({ progress, size = 80, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const getProgressColor = (progress) => {
    if (progress <= 33) {
      return "#EF4444";
    } else if (progress <= 66) {
      return "#F59E0B";
    } else {
      return "#10B981";
    }
  };

  const progressColor = getProgressColor(progress);

  return (
    <div className="progress-circle" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-svg">
        <circle
          className="progress-circle-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-circle-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ stroke: progressColor }}
        />
      </svg>
      <div className="progress-text">
        <span className="progress-percentage">{progress}%</span>
      </div>
    </div>
  );
};

export default ProgressCircle;
