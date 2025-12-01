/**
 * Modiva - Report State
 * Report data state management
 * @module state/report
 */
/**
 * Report State Module
 */
export const ReportState = {
    /**
     * Get initial report state
     * @returns {object}
     */
    getInitialState() {
        return {
            list: [],
            currentReport: null,
            filters: {
                status: 'all',
                dateFrom: null,
                dateTo: null,
                sortBy: 'date',
                sortOrder: 'desc'
            },
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0
            },
            statistics: {
                total: 0,
                pending: 0,
                completed: 0,
                rejected: 0
            },
            loading: false,
            error: null
        };
    },
    /**
     * Set reports list
     * @param {object} state - Current state
     * @param {array} payload - Reports array
     * @returns {object} - New state
     */
    setReports(state, payload) {
        return {
            ...state,
            list: payload,
            loading: false,
            error: null
        };
    },
    /**
     * Add report
     * @param {object} state - Current state
     * @param {object} payload - Report object
     * @returns {object} - New state
     */
    addReport(state, payload) {
        return {
            ...state,
            list: [payload, ...state.list],
            statistics: {
                ...state.statistics,
                total: state.statistics.total + 1,
                pending: state.statistics.pending + 1
            }
        };
    },
    /**
     * Update report
     * @param {object} state - Current state
     * @param {object} payload - { id, updates }
     * @returns {object} - New state
     */
    updateReport(state, payload) {
        const { id, updates } = payload;
        
        const updatedList = state.list.map(report => 
            report.id === id 
                ? { ...report, ...updates, updatedAt: Date.now() }
                : report
        );
        return {
            ...state,
            list: updatedList
        };
    },
    /**
     * Delete report
     * @param {object} state - Current state
     * @param {string} payload - Report ID
     * @returns {object} - New state
     */
    deleteReport(state, payload) {
        const reportId = payload;
        
        const updatedList = state.list.filter(report => report.id !== reportId);
        return {
            ...state,
            list: updatedList,
            statistics: {
                ...state.statistics,
                total: state.statistics.total - 1
            }
        };
    },
    /**
     * Set current report
     * @param {object} state - Current state
     * @param {object} payload - Report object
     * @returns {object} - New state
     */
    setCurrentReport(state, payload) {
        return {
            ...state,
            currentReport: payload
        };
    },
    /**
     * Set filters
     * @param {object} state - Current state
     * @param {object} payload - Filter updates
     * @returns {object} - New state
     */
    setFilter(state, payload) {
        return {
            ...state,
            filters: {
                ...state.filters,
                ...payload
            }
        };
    },
    /**
     * Set pagination
     * @param {object} state - Current state
     * @param {object} payload - Pagination updates
     * @returns {object} - New state
     */
    setPagination(state, payload) {
        return {
            ...state,
            pagination: {
                ...state.pagination,
                ...payload
            }
        };
    },
    /**
     * Set statistics
     * @param {object} state - Current state
     * @param {object} payload - Statistics updates
     * @returns {object} - New state
     */
    setStatistics(state, payload) {
        return {
            ...state,
            statistics: {
                ...state.statistics,
                ...payload
            }
        };
    },
    /**
     * Set loading state
     * @param {object} state - Current state
     * @param {boolean} payload - Loading flag
     * @returns {object} - New state
     */
    setLoading(state, payload) {
        return {
            ...state,
            loading: payload
        };
    },
    /**
     * Set error
     * @param {object} state - Current state
     * @param {string} payload - Error message
     * @returns {object} - New state
     */
    setError(state, payload) {
        return {
            ...state,
            error: payload,
            loading: false
        };
    },
    /**
     * Get filtered reports
     * @param {object} state - Current state
     * @returns {array} - Filtered reports
     */
    getFilteredReports(state) {
        let filtered = [...state.list];
        // Filter by status
        if (state.filters.status !== 'all') {
            filtered = filtered.filter(r => r.status === state.filters.status);
        }
        // Filter by date range
        if (state.filters.dateFrom) {
            filtered = filtered.filter(r => new Date(r.date) >= new Date(state.filters.dateFrom));
        }
        if (state.filters.dateTo) {
            filtered = filtered.filter(r => new Date(r.date) <= new Date(state.filters.dateTo));
        }
        // Sort
        filtered.sort((a, b) => {
            const aVal = a[state.filters.sortBy];
            const bVal = b[state.filters.sortBy];
            
            if (state.filters.sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        return filtered;
    },
    /**
     * Get paginated reports
     * @param {object} state - Current state
     * @returns {array} - Paginated reports
     */
    getPaginatedReports(state) {
        const filtered = this.getFilteredReports(state);
        const { page, limit } = state.pagination;
        const start = (page - 1) * limit;
        const end = start + limit;
        
        return filtered.slice(start, end);
    }
};
export default ReportState;