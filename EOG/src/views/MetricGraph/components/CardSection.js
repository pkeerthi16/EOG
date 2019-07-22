import React from 'react';
import MetricCard from './MetricCard';
import {connect} from 'react-redux';

const CardSection = ({selectedMetrics, latestValue}) => {
    return <>
    {selectedMetrics.map((s, key) => (
        <MetricCard key={key}
            currentValue={latestValue[s]}
            title={s}
        />
    ))}
    </>
}

const mapState = state => ({
    latestValue: state.metrics.latestValue,
})

export default connect(
    mapState,
    () => ({})
)(CardSection)