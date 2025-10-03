import React, { useState } from 'react';
import './BarChart.css';

/**
 * BarChart component with toggle between lessons and salary data
 * @param {Object} props
 * @param {Array} props.lessonsData - Daily lessons data
 * @param {Array} props.salaryData - Daily salary data
 * @param {boolean} props.lessonsLoading - Loading state for lessons
 * @param {boolean} props.salaryLoading - Loading state for salary
 * @param {string} props.lessonsError - Error message for lessons
 * @param {string} props.salaryError - Error message for salary
 */
const BarChart = ({ 
    lessonsData = [], 
    salaryData = [], 
    lessonsLoading = false, 
    salaryLoading = false,
    lessonsError = null,
    salaryError = null 
}) => {
    const [activeTab, setActiveTab] = useState('lessons');

    const isLoading = activeTab === 'lessons' ? lessonsLoading : salaryLoading;
    const error = activeTab === 'lessons' ? lessonsError : salaryError;
    const data = activeTab === 'lessons' ? lessonsData : salaryData;

    const formatDate = (index) => {
        const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        return weekdays[index % 7];
    };

    const getMaxValue = () => {
        if (!data || data.length === 0) return 100;
        return Math.max(...data);
    };

    const renderBar = (value, index) => {
        const maxValue = getMaxValue();
        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const unit = activeTab === 'lessons' ? 'lessons' : 'RUB';

        return (
            <div key={index} className="bar-item">
                <div className="bar-container">
                    <div 
                        className="bar" 
                        style={{ height: `${height}%` }}
                        title={`${value} ${unit}`}
                    >
                        <span className="bar-value">{value}</span>
                    </div>
                </div>
                <div className="bar-label">{formatDate(index)}</div>
            </div>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="chart-loading">
                    <div className="loading-spinner"></div>
                    <span>Loading chart data...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="chart-error">
                    <span className="error-icon">⚠️</span>
                    <span>Error loading chart data</span>
                </div>
            );
        }

        if (!data || data.length === 0) {
            return (
                <div className="chart-empty">
                    <span>No data available</span>
                </div>
            );
        }

        return (
            <div className="chart-bars">
                {data.map(renderBar)}
            </div>
        );
    };

    return (
        <div className="bar-chart">
            <div className="chart-header">
                <h3 className="chart-title">Daily Statistics</h3>
                <div className="chart-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'lessons' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lessons')}
                    >
                        Lessons
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'salary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('salary')}
                    >
                        Salary
                    </button>
                </div>
            </div>
            <div className="chart-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default BarChart;
