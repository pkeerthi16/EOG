import * as actions from '../actions'

const initialState = {
    metrics: {},
    latestValue: {},
}

const multipleMetricsReceived = (state, action) => {
    const data = action.metrics;
    return {
        ...state,
        metrics: data,
    };
}

const metricsReceived = (state, action) => {
    const {metrics, latestValue} = action;
    return {
        ...state,
        metrics,
        latestValue
    };
}

const handlers = {
    [actions.METRICS_DATA_RECEIVED]: metricsReceived,
    [actions.MULIPLE_METRICS_RECEIVED]: multipleMetricsReceived,
}

export default (state = initialState, action) => {
    const handler = handlers[action.type]
    if (typeof handler === 'undefined') return state
    return handler(state, action)
}
