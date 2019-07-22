import { takeEvery, take, call, put, fork, select } from 'redux-saga/effects'
import * as actions from '../actions'
import api from '../api';
import { eventChannel } from 'redux-saga';


const getMetrics = state => state.metrics.metrics;

function* aggregateSaga(list) {
    let data = yield select(getMetrics);
    list.map(item => {
        const { metric, at, value } = item;
        const hours = new Date(at).getHours() % 12 || 12;
        const minutes = new Date(at).getMinutes()
        const timeAt = `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`
        data = {
            ...data,
            [at]: {
                ...data[at],
                [metric]: value,
                at: timeAt,
            },
        }
        return null;
    })
    yield put({ type: actions.MULIPLE_METRICS_RECEIVED, metrics: data })
}

function* processDataSaga(newData) {
    console.log(newData)
    const { metric, at, value } = newData
    let data = yield select(getMetrics);
    const oldlatestValue = yield select(state => state.metrics.latestValue)
    const hours = new Date(at).getHours() % 12 || 12;
    const minutes = new Date(at).getMinutes()
    const timeAt = `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`
    data = {
        ...data,
        [at]: {
            ...data[at],
            [metric]: value,
            at: timeAt,
        },
    };
    const latestValue = {
        ...oldlatestValue,
        [metric]: value
    }
    yield put({ type: actions.METRICS_DATA_RECEIVED, metrics: data, latestValue })
}

const createChannel = sub => eventChannel((emit) => {
    const handler = (data) => {
        emit(data);
    };
    sub.subscribe(handler);
    return () => {
        sub.unsubscribe()
    };
})

function* liveUpdates(action) {
    const sub = yield call(api.subscribeLive);
    const subscription = yield call(createChannel, sub);
    while(true) {
        const {data} = yield take(subscription);
        console.log(data)
        yield fork(processDataSaga, data.newMeasurement)
    }
}

function* fetch30MinutesData(action) {
    const { data } = yield call(api.getLast30MinutesData, action.metricName)
    const newData = data.getMeasurements
    yield fork(aggregateSaga, newData)
}

function* watchFetch() {
    yield takeEvery(actions.FETCH_30_MINUTES_DATA, fetch30MinutesData);
}

function* watchStartLiveUpdates() {
    yield takeEvery(actions.START_LIVE_UPDATES, liveUpdates)
}

export default [watchFetch, watchStartLiveUpdates];