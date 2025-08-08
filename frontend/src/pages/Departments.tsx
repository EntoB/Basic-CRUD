import { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Row, Col, Modal, Input, message, InputNumber } from 'antd';
import DepartmentModal, { Department } from '../components/DepartmentModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../store/departmentsSlice';
import { RootState, AppDispatch } from '../store';
import { setMinEmployees, setMaxEmployees, setSearch, setPage, setPageSize } from '../store/departmentsSlice';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Departments = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();
    const departments = useSelector((state: RootState) => state.departments.items) as Department[];
    const loading = useSelector((state: RootState) => state.departments.loading);
    const filters = useSelector((state: RootState) => state.departments.filters);
    const total = useSelector((state: RootState) => state.departments.total);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editDepartment, setEditDepartment] = useState<Department | undefined>(undefined);

    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch, filters.parentId, filters.minEmployees, filters.maxEmployees, filters.search, filters.page, filters.pageSize]);

    const handleEdit = (id: number) => {
        const dep = departments.find(d => d.id === id);
        setEditDepartment(dep);
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this department?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                await fetch(`http://localhost:5000/departments/delete/${id}`, {
                    method: 'DELETE',
                });
                dispatch(fetchDepartments());
                message.success('Department deleted successfully');
            },
        });
    };

    const handleAdd = () => {
        setEditDepartment({ id: 0, name: '', description: '', under: null });
        setIsEdit(false);
        setIsModalOpen(true);
    };


    const handleFinish = async (values: any) => {
        if (isEdit && editDepartment) {
            await fetch(`http://localhost:5000/departments/update/${editDepartment.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            message.success('Department updated successfully');
        } else {
            await fetch('http://localhost:5000/departments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            message.success('Department added successfully');
        }
        dispatch(fetchDepartments());
        setIsModalOpen(false);
        setEditDepartment(undefined);
        setIsEdit(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditDepartment(undefined);
        setIsEdit(false);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        {
            title: 'Parent Department',
            dataIndex: 'under',
            key: 'under',
            render: (id: number) => {
                const parent = departments.find(dep => dep.id === id);
                return parent ? parent.name : 'None';
            },
        },
        {
            title: 'Number of Employees',
            dataIndex: 'total_employees',
            key: 'total_employees',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Department) => (
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
                            <Title level={2} style={{ margin: 0 }}>Departments</Title>
                        </Col>
                        <Col flex="120px" style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                size="large"
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                onClick={handleAdd}
                            >
                                Add Department
                            </Button>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col>
                            <Input
                                style={{ width: 300 }}
                                placeholder="Search department"
                                onChange={e => {
                                    dispatch(setSearch(e.target.value));
                                    dispatch(setPage(1));
                                }}
                                value={filters.search}
                            />
                        </Col>
                        <Col>
                            <InputNumber
                                style={{ width: 150, marginLeft: 8 }}
                                placeholder="Min Employees"
                                min={0}
                                onChange={value => {
                                    dispatch(setMinEmployees(value));
                                    dispatch(setPage(1));
                                }}
                                value={filters.minEmployees || undefined}
                            />
                        </Col>
                        <Col>
                            <InputNumber
                                style={{ width: 150, marginLeft: 8 }}
                                placeholder="Max Employees"
                                min={0}
                                onChange={value => {
                                    dispatch(setMaxEmployees(value));
                                    dispatch(setPage(1));
                                }}
                                value={filters.maxEmployees || undefined}
                            />
                        </Col>
                    </Row>
                    <Table
                        dataSource={departments}
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
            <DepartmentModal
                open={isModalOpen}
                onCancel={handleCancel}
                onFinish={handleFinish}
                departments={departments || []}
                initialValues={editDepartment}
                isEdit={isEdit}
            />
        </>
    );
};

export default Departments;