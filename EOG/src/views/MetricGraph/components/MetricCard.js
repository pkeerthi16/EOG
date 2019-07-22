import React from 'react';
import { Grid, CardContent, Typography, Card } from '@material-ui/core';

export default props =>
    <Grid item md={5} xs={6}>
        <Card elevation={1}>
            <CardContent>
                <Typography variant="h6">
                    {props.title}
                </Typography>
                <Typography variant="h3">
                    {props.currentValue}
                </Typography>
            </CardContent>
        </Card>
    </Grid>