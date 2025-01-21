import React from "react";
import { Table, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PoweroffOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { WorkflowTableDetail } from '@/types';
import dayjs from 'dayjs';
import { instanceWithAuth, workflow } from "@Config/backend.routes";
import { toast } from "react-toastify";
import { useMediaQuery } from 'react-responsive';
import Security from "@/Components/Security";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/Context/ContextHooks";

interface WorkflowsTableProps {
    workflows: WorkflowTableDetail[];
    setNeedReload: (value: boolean) => void;
    loading: boolean;
}

const WorkflowsTable: React.FC<WorkflowsTableProps> = ({ workflows, setNeedReload, loading }) => {
    const isSmallScreen = useMediaQuery({ maxWidth: 767 });
    const navigate = useNavigate();
    const { translations } = useUser();

    const handleEdit = (record: WorkflowTableDetail) => {
        navigate(`/workflow/update/${record.ID}`);
    };

    const handleToggleActive = (record: WorkflowTableDetail) => {
        instanceWithAuth.put(workflow.update + `/${record.ID}`, {
            is_active: !record.is_active,
        })
            .then(() => {
                toast.success(translations?.workflow.notifications.success.updated);
            })
            .catch((error) => {
                console.error(error)
                toast.error(translations?.workflow.notifications.error.updateFailed);
            })
            .finally(() => {
                setNeedReload(true);
            })
    };

    const handleDelete = (record: WorkflowTableDetail) => {
        instanceWithAuth.delete(workflow.delete + `/${record.ID}`)
            .then(() => {
                toast.success(translations?.workflow.notifications.success.deleted);
            })
            .catch((error) => {
                console.error(error)
                toast.error(translations?.workflow.notifications.error.deleteFailed);
            })
            .finally(() => {
                setNeedReload(true);
            })
    };

    const handleTrigger = (record: WorkflowTableDetail) => {
        instanceWithAuth.get(workflow.trigger + `/${record.ID}`)
            .then(() => {
                toast.success(translations?.workflow.notifications.success.triggered);
            })
            .catch((error) => {
                console.error(error)
                toast.error(translations?.workflow.notifications.error.triggerFailed);
            })
            .finally(() => {
                setNeedReload(true);
            })
    };

    const columns: ColumnsType<WorkflowTableDetail> = [
        {
            title: translations?.workflow.table.columns.name,
            dataIndex: 'name',
            key: 'name',
            fixed: isSmallScreen ? undefined : 'left',
            width: 200,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: translations?.workflow.table.columns.description,
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: translations?.workflow.table.columns.status,
            dataIndex: 'status',
            key: 'status',
            filters: [...new Set(workflows.map(w => w.status))].map(status => ({
                text: status,
                value: status,
            })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: translations?.workflow.table.columns.active,
            dataIndex: 'is_active',
            key: 'is_active',
            render: (active: boolean) => active ? translations?.workflow.table.activeStatus.yes : translations?.workflow.table.activeStatus.no,
            filters: [
                { text: translations?.workflow.table.filters.active, value: true },
                { text: translations?.workflow.table.filters.inactive, value: false },
            ],
            onFilter: (value, record) => record.is_active === value,
        },
        {
            title: translations?.workflow.table.columns.createdAt,
            dataIndex: 'CreatedAt',
            key: 'CreatedAt',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
            sorter: (a, b) => dayjs(a.CreatedAt).unix() - dayjs(b.CreatedAt).unix(),
        },
        {
            title: translations?.workflow.table.columns.updatedAt,
            dataIndex: 'UpdatedAt',
            key: 'UpdatedAt',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
            sorter: (a, b) => dayjs(a.UpdatedAt).unix() - dayjs(b.UpdatedAt).unix(),
        },
        {
            title: translations?.workflow.table.columns.actions,
            key: 'actions',
            fixed: isSmallScreen ? undefined : 'right',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Tooltip title={translations?.workflow.table.tooltips.edit}>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            size="small"
                            aria-label={translations?.workflow.table.ariaLabels.edit}
                        />
                    </Tooltip>
                    <Tooltip title={record.is_active ? translations?.workflow.table.tooltips.deactivate : translations?.workflow.table.tooltips.activate}>
                        <Button
                            icon={<PoweroffOutlined />}
                            onClick={() => handleToggleActive(record)}
                            size="small"
                            type={record.is_active ? 'default' : 'primary'}
                            aria-label={record.is_active ? translations?.workflow.table.ariaLabels.deactivate : translations?.workflow.table.ariaLabels.activate}
                        />
                    </Tooltip>
                    <Tooltip title={translations?.workflow.table.tooltips.trigger}>
                        <Button
                            icon={<PlayCircleOutlined />}
                            onClick={() => handleTrigger(record)}
                            size="small"
                            type="default"
                            aria-label={translations?.workflow.table.ariaLabels.trigger}
                        />
                    </Tooltip>
                    <Tooltip title={translations?.workflow.table.tooltips.delete}>
                        <Button
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                            size="small"
                            danger
                            aria-label={translations?.workflow.table.ariaLabels.delete}
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
                locale={{
                    emptyText: translations?.common.table.noData,
                    filterConfirm: translations?.common.table.ok,
                    filterReset: translations?.common.table.reset,
                    filterTitle: translations?.common.table.filter,
                    selectAll: translations?.common.table.selectAll,
                    sortTitle: translations?.common.table.sort,
                    triggerDesc: translations?.common.table.triggerDesc,
                    triggerAsc: translations?.common.table.triggerAsc,
                    cancelSort: translations?.common.table.cancelSort,
                    filterSearchPlaceholder: translations?.common.table.search,
                }}
            />
        </Security>
    );
};

export default WorkflowsTable;
