import { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Row, Col, Modal, Select, InputNumber, Input, message } from 'antd';
import EmployeeModal from '../components/EmployeeModal';
import { Department } from '../components/DepartmentModal';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    Employee,
    setDepartmentId,
    setMinAge,
    setMaxAge,
    setSearch,
    setPage,
    setPageSize
} from '../store/employeesSlice';
import { fetchDepartments } from '../store/departmentsSlice';
import { RootState, AppDispatch } from '../store';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Employees = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const employees = useSelector((state: RootState) => state.employees.items);
    const departments = useSelector((state: RootState) => state.departments.items) as Department[];
    const loading = useSelector((state: RootState) => state.employees.loading);
    const filters = useSelector((state: RootState) => state.employees.filters);
    const total = useSelector((state: RootState) => state.employees.total);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editEmployee, setEditEmployee] = useState<Employee | undefined>(undefined);

    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch, filters.departmentId, filters.minAge, filters.maxAge, filters.search, filters.page, filters.pageSize]);

    const handleEdit = (id: number) => {
        const emp = employees.find(e => e.id === id);
        setEditEmployee(emp);
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this employee?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                await dispatch(deleteEmployee(id));
                message.success('Employee deleted successfully');
            },
        });
    };

    const handleAdd = () => {
        setEditEmployee({ id: 0, name: '', dateOfBirth: '', departmentId: 0 });
        setIsEdit(false);
        setIsModalOpen(true);
    };

    const handleFinish = async (values: any) => {
        if (isEdit && editEmployee) {
            await dispatch(updateEmployee({ ...editEmployee, ...values }));
            message.success('Employee updated successfully');
        } else {
            await dispatch(addEmployee(values));
            message.success('Employee added successfully');
        }
        setIsModalOpen(false);
        setEditEmployee(undefined);
        setIsEdit(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditEmployee(undefined);
        setIsEdit(false);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Age',
            key: 'age',
            render: (_: any, record: Employee) => {
                if (!record.dateOfBirth) return '';
                const dob = dayjs(record.dateOfBirth);
                const now = dayjs();
                return now.diff(dob, 'year');
            },
        },
        {
            title: 'Department',
            dataIndex: 'departmentId',
            key: 'departmentId',
            render: (id: number) => {
                const dep = departments.find(d => d.id === id);
                return dep ? dep.name : '';
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Employee) => (
                <Space>
                    <Button type="primary" onClick={() => handleEdit(record.id)}>
                        Edit
                    </Button>
                    <Button danger onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Row justify="center" style={{ marginTop: 60 }}>
                <Col xs={24} sm={22} md={18} lg={14}>
                    <Row align="middle" style={{ marginBottom: 24 }}>
                        <Col flex="80px">
                            <Button
                                type="default"
                                size="large"
                                onClick={() => navigate('/')}
                            >
                                Back
                            </Button>
                        </Col>
                        <Col flex="auto" style={{ textAlign: 'center' }}>
                            <Title level={2} style={{ margin: 0 }}>Employees</Title>
                        </Col>
                        <Col flex="120px" style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                size="large"
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                onClick={handleAdd}
                            >
                                Add Employee
                            </Button>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col>
                            <Select
                                showSearch
                                style={{ width: 300, marginRight: 8 }}
                                placeholder="Filter by Department"
                                optionFilterProp="label"
                                onChange={value => {
                                    dispatch(setDepartmentId(value));
                                    dispatch(setPage(1));
                                }}
                                allowClear
                                value={filters.departmentId ?? null}
                                filterOption={(input, option) =>
                                    typeof option?.label === 'string' &&
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                <Select.Option value={null} label="All Departments">All Departments</Select.Option>
                                {departments.map(dep => (
                                    <Select.Option key={dep.id} value={dep.id} label={dep.name}>
                                        {dep.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col>
                            <InputNumber
                                placeholder="Min Age"
                                style={{ width: 100, marginRight: 8 }}
                                onChange={value => {
                                    dispatch(setMinAge(value));
                                    dispatch(setPage(1));
                                }}
                                min={0}
                                value={filters.minAge || undefined}
                            />
                        </Col>
                        <Col>
                            <InputNumber
                                placeholder="Max Age"
                                style={{ width: 100, marginRight: 8 }}
                                onChange={value => {
                                    dispatch(setMaxAge(value));
                                    dispatch(setPage(1));
                                }}
                                min={0}
                                value={filters.maxAge || undefined}
                            />
                        </Col>
                        <Col>
                            <Input
                                placeholder="Search Employee"
                                style={{ width: 200, marginRight: 8 }}
                                onChange={e => {
                                    dispatch(setSearch(e.target.value));
                                    dispatch(setPage(1));
                                }}
                                value={filters.search}
                            />
                        </Col>
                    </Row>
                    <Table
                        dataSource={employees}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: filters.page,
                            pageSize: filters.pageSize,
                            total,
                            showSizeChanger: true,
                            onChange: (page, pageSize) => {
                                dispatch(setPage(page));
                                dispatch(setPageSize(pageSize));
                            },
                        }}
                    />
                </Col>
            </Row>
            <EmployeeModal
                open={isModalOpen}
                onCancel={handleCancel}
                onFinish={handleFinish}
                departments={departments}
                initialValues={editEmployee}
                isEdit={isEdit}
            />
        </>
    );
};

export default Employees;