import "./CustomChart.css"

function CustomChart({chartName, chartInfo}) {
    return (
        <div className="chart">
            <p className="chart-name">{chartName}</p>
            <p className="chart-info">{chartInfo}</p>
        </div>
    )
}

export default CustomChart;