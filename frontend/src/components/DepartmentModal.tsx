import { Modal, Form, Input, Select, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import React from 'react';
const { Option } = Select;

export interface Department {
    id: number;
    name: string;
    description?: string;
    under?: number | null;
}

interface DepartmentModalProps {
    open: boolean;
    onCancel: () => void;
    onFinish: (values: any) => void;
    departments: Department[];
    initialValues?: Partial<Department>;
    isEdit?: boolean;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
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
            form.setFieldsValue(initialValues || {});
        } else {
            form.resetFields();
        }
    }, [open, initialValues, form]);

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            closeIcon={<CloseOutlined />}
            title={isEdit ? "Edit Department" : "Add Department"}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={initialValues}
            >
                <Form.Item
                    label="Department Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter department name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item
                    label="Parent Department"
                    name="under"
                >
                    <Select allowClear placeholder="Select parent department (optional)">
                        <Option value={null}>None</Option>
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

export default DepartmentModal;