import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


const GET_METRICS = gql`
    query {
        getMetrics
    }
`;

const animatedComponents = makeAnimated();

const MetricSelect = props => {
    const { setSelected } = props;
    const onChange = (metrics) => {
        setSelected(() => metrics ?
            metrics.map(op => op.value)
            :
            []
        );
    };
    return (
        <Query query={GET_METRICS}>
            {({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;
                const options = data.getMetrics.map(metric => ({
                    value: metric,
                    label: metric
                }));
                return (
                    <Select
                        options={options}
                        components={animatedComponents}
                        isMulti
                        onChange={onChange}
                        closeMenuOnSelect={false}
                    />
                );
            }}
        </Query>
    )
}

export default MetricSelect;