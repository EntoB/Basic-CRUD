const { Department, Employee } = require('../models');
const { Op } = require('sequelize');

exports.getAllDepartments = async (req, res) => {
    const { parentId, minEmployees, maxEmployees, search, page = 1, pageSize = 10 } = req.query;
    const where = {};
    if (parentId) where.under = parentId;
    if (search) where.name = { [Op.like]: `%${search}%` };

    const offset = (page - 1) * pageSize;

    try {
        const { rows: departments, count } = await Department.findAndCountAll({
            where,
            offset,
            limit: Number(pageSize),
        });

        const departmentIds = departments.map(dep => dep.id);
        const employeeCounts = await Employee.findAll({
            attributes: ['departmentId'],
            where: {
                departmentId: { [Op.in]: departmentIds }
            }
        });

        const countMap = {};
        employeeCounts.forEach(emp => {
            countMap[emp.departmentId] = (countMap[emp.departmentId] || 0) + 1;
        });

        let departmentsWithCount = departments.map(dep => {
            const total_employees = countMap[dep.id] || 0;
            return { ...dep.toJSON(), total_employees };
        });

        if (minEmployees || maxEmployees) {
            departmentsWithCount = departmentsWithCount.filter(dep => {
                if (minEmployees && dep.total_employees < Number(minEmployees)) return false;
                if (maxEmployees && dep.total_employees > Number(maxEmployees)) return false;
                return true;
            });
        }

        res.json({ items: departmentsWithCount, total: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createDepartment = async (req, res) => {
    try {
        const { name, description, under } = req.body;
        const department = await Department.create({
            name,
            description,
            under: under === null ? null : under
        });
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, under } = req.body;
        const [updated] = await Department.update(
            { name, description, under: under === null ? null : under },
            { where: { id } }
        );
        if (updated) {
            const updatedDepartment = await Department.findByPk(id);
            res.json(updatedDepartment);
        } else {
            res.status(404).json({ error: 'Department not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Department.destroy({ where: { id } });
        if (deleted) {
            res.json({ message: 'Department deleted' });
        } else {
            res.status(404).json({ error: 'Department not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};