const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

router.get('/get', departmentController.getAllDepartments);
router.post('/create', departmentController.createDepartment);
router.put('/update/:id', departmentController.updateDepartment);
router.delete('/delete/:id', departmentController.deleteDepartment);
module.exports = router;