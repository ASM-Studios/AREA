import React from "react";
import { Table, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PoweroffOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { WorkflowTableDetail } from '@/types';
import dayjs from 'dayjs';
import { instanceWithAuth, workflow } from "@Config/backend.routes";
import { toast } from "react-toastify";
import { useMediaQuery } from 'react-responsive';
import Security from "@/Components/Security";

interface WorkflowsTableProps {
    workflows: WorkflowTableDetail[];
    setNeedReload: (value: boolean) => void;
    loading: boolean;
}

const WorkflowsTable: React.FC<WorkflowsTableProps> = ({ workflows, setNeedReload, loading }) => {
    const isSmallScreen = useMediaQuery({ maxWidth: 767 });

    const handleEdit = (record: WorkflowTableDetail) => {
        console.log('Edit workflow:', record);
        // TODO: Add edit logic here
    };

    const handleToggleActive = (record: WorkflowTableDetail) => {
        console.log('Toggle active status:', record);
        // TODO: Add toggle active logic here
    };

    const handleDelete = (record: WorkflowTableDetail) => {
        instanceWithAuth.delete(workflow.delete + `/${record.ID}`)
            .then(() => {
                toast.success('Workflow deleted');
            })
            .catch((error) => {
                console.error(error)
                toast.error('Failed to delete workflow');
            })
            .finally(() => {
                setNeedReload(true);
            })
    };

    const columns: ColumnsType<WorkflowTableDetail> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: isSmallScreen ? undefined : 'left',
            width: 200,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [...new Set(workflows.map(w => w.status))].map(status => ({
                text: status,
                value: status,
            })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Active',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (active: boolean) => active ? 'Yes' : 'No',
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value, record) => record.is_active === value,
        },
        {
            title: 'Created At',
            dataIndex: 'CreatedAt',
            key: 'CreatedAt',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
            sorter: (a, b) => dayjs(a.CreatedAt).unix() - dayjs(b.CreatedAt).unix(),
        },
        {
            title: 'Updated At',
            dataIndex: 'UpdatedAt',
            key: 'UpdatedAt',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
            sorter: (a, b) => dayjs(a.UpdatedAt).unix() - dayjs(b.UpdatedAt).unix(),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: isSmallScreen ? undefined : 'right',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit workflow">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            size="small"
                            aria-label="Edit workflow"
                            disabled={true} // TODO: Implement this feature
                        />
                    </Tooltip>
                    <Tooltip title={record.is_active ? 'Deactivate workflow' : 'Activate workflow'}>
                        <Button
                            icon={<PoweroffOutlined />}
                            onClick={() => handleToggleActive(record)}
                            size="small"
                            type={record.is_active ? 'default' : 'primary'}
                            aria-label={record.is_active ? 'Deactivate workflow' : 'Activate workflow'}
                            disabled={true} // TODO: Implement this feature
                        />
                    </Tooltip>
                    <Tooltip title="Delete workflow">
                        <Button
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                            size="small"
                            danger
                            aria-label="Delete workflow"
                        />
                    </Tooltip>
                </Space>
            ),
        }
    ];

    return (
        <Security>
            <Table
                columns={columns}
                dataSource={workflows}
                rowKey="ID"
                pagination={false}
                scroll={{ x: 1200 }}
                sticky={{
                    offsetHeader: 0,
                    offsetScroll: 0,
                }}
                loading={loading}
            />
        </Security>
    );
};

export default WorkflowsTable;
