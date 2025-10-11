import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching salary analytics data
 * @param {string} apiKey - Base API URL
 * @param {string} token - Authorization token
 * @returns {Object} - { salaryData, loading, error }
 */
export const useTimeSlotsData = (apiKey, token) => {
    const [timeSlotsData, setTimeSlotsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiKey}/time-slots/all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки данных: ${response.status}`);
                }

                const data = await response.json();
                setTimeSlotsData(data);

            } catch (err) {
                setError(err.message);
                console.error('Ошибка:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiKey, token]);

    return { timeSlotsData, loading, error };
};