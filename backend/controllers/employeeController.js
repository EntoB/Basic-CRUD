const { Employee } = require('../models');
const { Op } = require('sequelize');
exports.getAllEmployees = async (req, res) => {
    const { departmentId, minAge, maxAge, search, page = 1, pageSize = 10 } = req.query;
    const where = {};
    if (
        departmentId !== null &&
        departmentId !== undefined &&
        departmentId !== '' &&
        departmentId !== 'null'
    ) {
        where.departmentId = departmentId;
    }
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (minAge || maxAge) {
        const today = new Date();
        if (minAge) {
            const maxDOB = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
            where.dateOfBirth = { ...where.dateOfBirth, [Op.lte]: maxDOB };
        }
        if (maxAge) {
            const minDOB = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
            where.dateOfBirth = { ...where.dateOfBirth, [Op.gte]: minDOB };
        }
    }
    const offset = (page - 1) * pageSize;
    const { rows, count } = await Employee.findAndCountAll({
        where,
        offset,
        limit: Number(pageSize),
    });
    res.json({ items: rows, total: count });
};

exports.createEmployee = async (req, res) => {
    const employee = await Employee.create(req.body);
    res.json(employee);
};

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, dateOfBirth, departmentId } = req.body;
        const [updated] = await Employee.update(
            { name, dateOfBirth, departmentId },
            { where: { id } }
        );
        if (updated) {
            const updatedEmployee = await Employee.findByPk(id);
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Employee.destroy({ where: { id } });
        if (deleted) {
            res.json({ message: 'Employee deleted' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};