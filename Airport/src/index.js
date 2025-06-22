const express = require('express');
const { serverConfig } = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




const apiRoutes = require('./routes')

app.use('/api', apiRoutes);

app.listen(serverConfig.PORT, () => {
    console.log(`Server is running on port ${serverConfig.PORT}`);
}) 