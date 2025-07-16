import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Select, Form, InputNumber, Button, Table, Divider, Typography } from 'antd';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;
const API_BASE_URL = window._env_.API_BASE_URL || 'https://vibe-trading-app-api-gateway.onrender.com/api';

const App = () => {
    const [form] = Form.useForm();
    const [clients, setClients] = useState([]);
    const [currencyPairs, setCurrencyPairs] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch initial config data
    useEffect(() => {
        axios.get(`${API_BASE_URL}/users/clients`)
            .then(response => {
                setClients(response.data);
                if (response.data.length > 0) {
                    // Set the selected client in the state, which controls the dropdown's value
                    setSelectedClient(response.data[0].username);
                    // The line that caused the error has been removed from here
                }
            })
            .catch(error => console.error("Error fetching clients:", error));

        axios.get(`${API_BASE_URL}/config/currency-pairs`)
            .then(response => {
                setCurrencyPairs(response.data.map(pair => ({ label: pair, value: pair })));
                if (response.data.length > 0) {
                    form.setFieldsValue({ currencyPair: response.data[0] });
                }
            })
            .catch(error => console.error("Error fetching currency pairs:", error));
    }, [form]);

    // Fetch orders when selected client changes
    useEffect(() => {
        if (selectedClient) {
            setLoading(true);
            axios.get(`${API_BASE_URL}/orders/user/${selectedClient}`)
                .then(response => setOrders(response.data))
                .catch(error => console.error("Error fetching orders:", error))
                .finally(() => setLoading(false));
        }
    }, [selectedClient]);

    const onFinish = (values) => {
        const orderRequest = { ...values, username: selectedClient };
        axios.post(`${API_BASE_URL}/orders`, orderRequest)
            .then(response => {
                setOrders([response.data, ...orders]);
                form.resetFields(['direction', 'size', 'price']);
            })
            .catch(error => console.error("Error placing order:", error));
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id, defaultSortOrder: 'descend' },
        { title: 'Pair', dataIndex: 'currencyPair', key: 'currencyPair' },
        { title: 'Direction', dataIndex: 'direction', key: 'direction' },
        { title: 'Size', dataIndex: 'size', key: 'size', render: (val) => val.toLocaleString() },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (val) => val.toFixed(4) },
        { title: 'Status', dataIndex: 'status', key: 'status' },
    ];

    return (
        <Layout>
            <Header>
                <div className="header-content">
                    <Title level={3} style={{ color: 'white', margin: 0 }}>FX Vibe - Client Platform</Title>
                    <div className="user-selector">
                        <label style={{ color: 'white' }}>Client:</label>
                        <Select
                            value={selectedClient}
                            onChange={setSelectedClient}
                            style={{ width: 200 }}
                            options={clients.map(c => ({ label: c.name, value: c.username }))}
                        />
                    </div>
                </div>
            </Header>
            <Content className="content-layout">
                <div className="form-container">
                    <Title level={4}>Place New Order</Title>
                    <Form form={form} layout="inline" onFinish={onFinish} initialValues={{ direction: 'BUY', size: 100000, price: 1.0750 }}>
                        <Form.Item name="currencyPair" label="Pair" rules={[{ required: true }]}>
                            <Select
                                showSearch
                                style={{ width: 120 }}
                                options={currencyPairs}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                        <Form.Item name="direction" label="Direction" rules={[{ required: true }]}>
                            <Select style={{ width: 100 }}>
                                <Select.Option value="BUY">BUY</Select.Option>
                                <Select.Option value="SELL">SELL</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="size" label="Size" rules={[{ required: true }]}>
                            <InputNumber style={{ width: 150 }} step={1000} />
                        </Form.Item>
                        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                            <InputNumber style={{ width: 120 }} step={0.0001} stringMode precision={4} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Submit Order</Button>
                        </Form.Item>
                    </Form>
                </div>
                <Divider />
                <Title level={4}>Your Orders</Title>
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Content>
        </Layout>
    );
}

export default App;