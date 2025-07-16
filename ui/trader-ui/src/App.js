import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Select, Table, Typography } from 'antd';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;
const API_BASE_URL = window._env_.API_BASE_URL || 'https://vibe-trading-app-api-gateway.onrender.com/api';

const App = () => {
    const [traders, setTraders] = useState([]);
    const [selectedTrader, setSelectedTrader] = useState('');
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch traders on load
    useEffect(() => {
        axios.get(`${API_BASE_URL}/users/traders`)
            .then(response => {
                setTraders(response.data);
                if (response.data.length > 0) {
                    setSelectedTrader(response.data[0].username);
                }
            })
            .catch(error => console.error("Error fetching traders:", error));
    }, []);

    // Fetch orders when the selected trader changes
    useEffect(() => {
        if (!selectedTrader || traders.length === 0) return;

        // Find the current trader to get their client list
        const currentTrader = traders.find(t => t.username === selectedTrader);
        if (!currentTrader || !currentTrader.clientUsernames) return;

        const fetchOrders = () => {
            setLoading(true);

            // Construct the query string with the trader's clients
            const clientQueryString = currentTrader.clientUsernames.join(',');

            axios.get(`${API_BASE_URL}/orders?clients=${clientQueryString}`)
                .then(response => setAllOrders(response.data))
                .catch(error => console.error("Error fetching all orders:", error))
                .finally(() => setLoading(false));
        };

        fetchOrders(); // Initial fetch for the selected trader
        const interval = setInterval(fetchOrders, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [selectedTrader, traders]);

    const columns = [
        // Add defaultSortOrder to the ID column definition
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id, defaultSortOrder: 'descend' },
        { title: 'Client', dataIndex: 'username', key: 'username' },
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
                    <Title level={3} style={{ color: 'white', margin: 0 }}>FX Vibe - Trader Blotter</Title>
                    <div className="user-selector">
                        <label style={{ color: 'white' }}>Trader:</label>
                        <Select
                            value={selectedTrader}
                            onChange={setSelectedTrader}
                            style={{ width: 200 }}
                            options={traders.map(t => ({ label: t.name, value: t.username }))}
                        />
                    </div>
                </div>
            </Header>
            <Content className="content-layout">
                <Title level={4}>Client Orders</Title>
                <Table
                    columns={columns}
                    dataSource={allOrders}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 20, showSizeChanger: true }}
                    // The incorrect sorter line has been removed from here
                />
            </Content>
        </Layout>
    );
}

export default App;