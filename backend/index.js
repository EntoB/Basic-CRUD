const express = require('express');
const cors = require('cors');

const employeeRoutes = require('./routes/employee');
const departmentRoutes = require('./routes/department');
const { sequelize } = require('./models');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/employees', employeeRoutes);
app.use('/departments', departmentRoutes);

app.get('/', (req, res) => {
    res.send('Server root');
});

sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });