import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Col, Row, Typography } from 'antd';
import { useTheme } from '../theme/ThemeProvider';

const { Title } = Typography;

const LineChart = ({ coinHistory, currentPrice, coinName }) => {
    const { mode } = useTheme();
    const coinPrice = [];
    const coinTimestamp = [];

    for (let i = coinHistory?.data?.history?.length - 1; i >= 0; i--) {
        coinPrice.push(coinHistory?.data?.history[i].price);
        coinTimestamp.push(new Date(coinHistory?.data?.history[i].timestamp * 1000).toLocaleDateString());
    }

    const tickColor = mode === 'dark' ? '#98a1b3' : '#5b6473';
    const gridColor = mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const change = coinHistory?.data?.change;
    const isNegative = String(change).trim().startsWith('-');

    const data = {
        labels: coinTimestamp,
        datasets: [
            {
                label: `Price of ${coinName} in USD`,
                data: coinPrice,
                fill: true,
                tension: 0.3,
                backgroundColor: 'rgba(247, 166, 0, 0.12)',
                borderColor: '#f7a600',
                pointBackgroundColor: '#f7a600',
                pointRadius: 0,
                pointHoverRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: tickColor } },
        },
        scales: {
            y: {
                ticks: { color: tickColor, beginAtZero: true },
                grid: { color: gridColor },
            },
            x: {
                ticks: { color: tickColor, maxTicksLimit: 8 },
                grid: { color: gridColor },
            },
        },
    };

    return (
        <>
            <Row className='chart-header'>
                <Title level={2} className='chart-title'>{coinName} Price Chart</Title>
                <Col className='price-container'>
                    <Title
                        level={5}
                        className={`price-change${isNegative ? ' is-negative' : ''}`}
                    >
                        {change}%
                    </Title>
                    <Title level={5} className='current-price'>Current {coinName} Price: ${currentPrice}</Title>
                </Col>
            </Row>
            <div className='chart-canvas'>
                <Line data={data} options={options} />
            </div>
        </>
    );
};

export default LineChart;
