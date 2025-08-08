import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import React from 'react';
import { Department } from './DepartmentModal';
import { Employee } from '../store/employeesSlice';

const { Option } = Select;

interface EmployeeModalProps {
    open: boolean;
    onCancel: () => void;
    onFinish: (values: any) => void;
    departments: Department[];
    initialValues?: Partial<Employee>;
    isEdit?: boolean;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
    open,
    onCancel,
    onFinish,
    departments,
    initialValues,
    isEdit = false,
}) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (open) {
            if (isEdit && initialValues) {
                const { dateOfBirth, ...rest } = initialValues;
                form.setFieldsValue(rest);
            } else {
                form.resetFields();
            }
        }
    }, [open, initialValues, isEdit, form]);

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            closeIcon={<CloseOutlined />}
            title={isEdit ? "Edit Employee" : "Add Employee"}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={isEdit && initialValues ? (() => {
                    const { dateOfBirth, ...rest } = initialValues;
                    return rest;
                })() : initialValues}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter employee name' }]}
                >
                    <Input />
                </Form.Item>
                {!isEdit && (
                    <Form.Item
                        label="Date of Birth"
                        name="dateOfBirth"
                        rules={[{ required: true, message: 'Please select date of birth' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                )}
                <Form.Item
                    label="Department"
                    name="departmentId"
                    rules={[{ required: true, message: 'Please select a department' }]}
                >
                    <Select placeholder="Select department">
                        {departments.map(dep => (
                            <Option key={dep.id} value={dep.id}>{dep.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {isEdit ? "Save Changes" : "Add"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EmployeeModal;