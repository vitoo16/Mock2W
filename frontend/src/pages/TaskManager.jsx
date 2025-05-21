import React, { useEffect, useState } from "react";
import {
  Table,
  Select,
  Tag,
  Row,
  Col,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Dropdown,
  Menu,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";
import {
  EditOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  DownOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  GET_TASKS_API,
  GET_USERS_API,
  POST_TASK_API,
  fetchWithAuth,
} from "../config/api";

const { Option } = Select;
const { RangePicker } = DatePicker;



const TaskTable = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [memberOptions, setMemberOptions] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetchWithAuth(GET_USERS_API);
      const data = await response.json();
      if (!response.ok) throw new Error("Lỗi khi tải users");
      // Giả sử API trả về mảng user có trường 'name'
      setMemberOptions(data.map(user => ({ key: user._id, label: user.fullname })));
    } catch (error) {
      setMemberOptions([]);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(GET_TASKS_API);
      const data = await response.json();
      if (!response.ok) throw new Error("Lỗi khi tải tasks");
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberChange = (value, record) => {
    const updatedTasks = tasks.map((task) => {
      if (task._id === record._id) {
        return { ...task, assignedTo: value };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleStatusFilterChange = (value) => {
    setFilteredStatus(value === "all" ? null : value);
  };

  const handleCreateTask = async (values) => {
  const { title, description, assignedTo, dateRange } = values;
  const startDate = dateRange[0].toISOString();
  const dueDate = dateRange[1].toISOString();

  try {
    const response = await fetchWithAuth(POST_TASK_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, assignedTo, startDate, dueDate }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.[0]?.msg || "Lỗi khi tạo task");

    message.success("Tạo task thành công!");
    setIsModalVisible(false);
    form.resetFields();
    fetchTasks();
  } catch (err) {
    message.error(err.message || "Lỗi không xác định");
  }
};

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:3001/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Xóa task thất bại");
      message.success("Đã xóa task");
      fetchTasks();
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleSoftDeleteTask = async (taskId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:3001/tasks/${taskId}/soft-delete`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Ẩn task thất bại");
      message.success("Đã ẩn task");
      fetchTasks();
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      const response = await fetchWithAuth(`http://localhost:3001/tasks/${taskId}/update-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Cập nhật trạng thái thất bại");
      message.success("Trạng thái đã cập nhật");
      fetchTasks();
    } catch (err) {
      message.error(err.message);
    }
  };

  const columns = [
    {
      title: "Task Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Member",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (assignedTo) => {
    // assignedTo có thể là 1 id hoặc mảng id
    const ids = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    const names = ids
      .map(id => {
        const member = memberOptions.find(m => m.key === id);
        return member ? member.label : id;
      })
      .join(", ");
    return <span>{names}</span>;
  }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let color = "blue";
        if (status === "in progress") color = "orange";
        else if (status === "done") color = "green";
        return (
          <Dropdown menu={{ items: [
  { key: 'todo', label: <span onClick={() => handleUpdateStatus(record._id, "todo")}>To Do</span> },
  { key: 'in progress', label: <span onClick={() => handleUpdateStatus(record._id, "in progress")}>In Progress</span> },
  { key: 'done', label: <span onClick={() => handleUpdateStatus(record._id, "done")}>Done</span> },
]}}>
  <Tag color={color} style={{ cursor: "pointer" }}>{status?.toUpperCase()} <DownOutlined /></Tag>
</Dropdown>
        );
      },
    },
    {
  title: "Hành động",
  key: "actions",
  render: (_, record) => (
    <Dropdown
      menu={{
        items: [
          {
            key: "delete",
            icon: <DeleteOutlined />,
            danger: true,
            label: (
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa task này?"
                onConfirm={() => handleDeleteTask(record._id)}
              >
                Xóa
              </Popconfirm>
            ),
          },
          {
            key: "softdelete",
            icon: <EyeInvisibleOutlined />,
            label: (
              <span onClick={() => handleSoftDeleteTask(record._id)}>
                Ẩn (Soft Delete)
              </span>
            ),
          },
        ],
      }}
    >
      <Button type="link">
        Tuỳ chọn <DownOutlined />
      </Button>
    </Dropdown>
  ),
},
  ];

  const filteredTasks = filteredStatus ? tasks.filter((task) => task.status === filteredStatus) : tasks;

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginRight: 8 }}>
            + Tạo Task
          </Button>
          <Button type="primary" danger icon={<UserOutlined />} onClick={() => navigate("/users")}>
            Quản lý người dùng
          </Button>
        </Col>
        <Col>
          <Select defaultValue="all" style={{ width: 200 }} onChange={handleStatusFilterChange}>
            <Option value="all">Tất cả</Option>
            <Option value="todo">Chưa bắt đầu</Option>
            <Option value="in_progress">Đang thực hiện</Option>
            <Option value="done">Đã hoàn thành</Option>
          </Select>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredTasks.map((task) => ({ ...task, key: task._id }))}
          rowKey="_id"
        />
      </Spin>

      <Modal
        title="Tạo Task Mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTask}>
  <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
    <Input />
  </Form.Item>
  <Form.Item name="description" label="Mô tả">
    <Input.TextArea rows={3} />
  </Form.Item>
  <Form.Item name="dateRange" label="Thời gian" rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}>
    <RangePicker showTime />
  </Form.Item>
  <Form.Item name="assignedTo" label="Thành viên" rules={[{ required: true, message: "Vui lòng chọn thành viên" }]}>
    <Select mode="multiple" placeholder="Chọn thành viên">
      {memberOptions.map((member) => (
        <Option key={member.key} value={member.key}>{member.label}</Option>
      ))}
    </Select>
  </Form.Item>
</Form>
      </Modal>
    </div>
  );
};

export default TaskTable;
