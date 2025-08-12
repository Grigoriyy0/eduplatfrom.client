import "./CustomChart.css"

function CustomChart(props) {
    return (
        <div className="chart">
            <p className="chart-name">{props.chartName}</p>
            <p className="chart-info">{props.chartInfo}</p>
        </div>
    )
}

export default CustomChart;