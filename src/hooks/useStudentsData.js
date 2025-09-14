import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching students analytics data
 * @param {string} apiKey - Base API URL
 * @param {string} token - Authorization token
 * @returns {Object} - { studentsData, loading, error }
 */
export const useStudentsData = (apiKey, token) => {
    const [studentsData, setStudentsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiKey}/analytics/students`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки данных: ${response.status}`);
                }

                const data = await response.json();
                setStudentsData(data);

            } catch (err) {
                setError(err.message);
                console.error('Ошибка:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiKey, token]);

    return { studentsData, loading, error };
};
