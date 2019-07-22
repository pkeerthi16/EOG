import React from 'react'
import {
    Grid,
    makeStyles,
} from '@material-ui/core'
import * as actions from '../../store/actions'
import MetricSelect from './components/MetricSelect';
import Chart from './components/Chart';
import { connect } from 'react-redux'
import CardSection from './components/CardSection';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
        background: 'white',
    },
    chartContainer: {
        width: '100vw',
        height: '100vh'
    }
}));


const MetricGraph = ({ startLiveUpdates, getPastData, latestValue, metrics, ...props }) => {
    const classes = useStyles(props);
    const [axes, setVisible] = React.useState({
        pressure: false,
        temp: false,
        percentage: false
    })
    const [selectedMetrics, setSelectedMetrics] = React.useState([])
    React.useEffect(() => {
        startLiveUpdates()
    }, [startLiveUpdates])
    const getYAxisID = (metric) => {
        if (metric.toLowerCase().endsWith('pressure')) {
            return 1
        } else if (metric.toLowerCase().endsWith('temp')) {
            return 2
        } else {
            return 0
        }
    }
    const handleSelect = (selected) => {
        const metricSelected = selected();
        if(selectedMetrics.length < metricSelected.length) {
            getPastData(metricSelected[metricSelected.length-1])
        }
        setVisible({
            pressure: metricSelected.some(m => getYAxisID(m) === 1),
            temp: metricSelected.some(m => getYAxisID(m) === 2),
            percentage: metricSelected.some(m => getYAxisID(m) === 0)
        })
        setSelectedMetrics(selected)
    }
    return (
        <main className={classes.root}>
            <Grid container>
                <Grid container item xs={12} spacing={4}>
                    <Grid item container spacing={2} className={classes.valueGrid}>
                        <Grid item lg={7} md={6} xs={12}>
                            <Grid container spacing={2}>
                                <CardSection selectedMetrics={selectedMetrics} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={5}>
                            <MetricSelect setSelected={handleSelect} selectedMetrics={selectedMetrics} />
                        </Grid>
                    </Grid>
                    
                    <Grid className={classes.chartContainer} item container xs={12} justify='center' alignItems='center'>
                        <Chart
                            selectedMetrics={selectedMetrics}
                            getYAxisID={getYAxisID}
                            axes={axes}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </main>
    )
}

const mapDispatch = dispatch => ({
    startLiveUpdates: () => {
        dispatch({
            type: actions.START_LIVE_UPDATES
        })
    },
    getPastData: (metricName) => {
        dispatch({
            type: actions.FETCH_30_MINUTES_DATA,
            metricName
        })
    }
})

export default connect(
    ()=>({}),
    mapDispatch
)(MetricGraph)
