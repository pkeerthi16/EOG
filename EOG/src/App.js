import React from 'react'
import createStore from './store'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import 'react-toastify/dist/ReactToastify.css'
import Wrapper from './components/Wrapper'
import MetricGraph from './views/MetricGraph/MetricGraph';
import api from './store/api';
import { ApolloProvider } from 'react-apollo';

const { client } = api;
const store = createStore()
const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            main: 'rgb(39,49,66)',
        },
        secondary: {
            main: 'rgb(197,208,222)',
        },
        background: {
            main: 'rgb(226,231,238)',
        },
    },
})

const App = props => (
    <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ApolloProvider client={client}>
            <Provider store={store}>
                <Wrapper>
                    <ToastContainer />
                    <MetricGraph />
                </Wrapper>
            </Provider>
        </ApolloProvider>
    </MuiThemeProvider>
)

export default App
