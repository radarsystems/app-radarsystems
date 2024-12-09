import React from "react";
import { Card, Metric, Text, Flex } from "@tremor/react";
import { IoStatsChartOutline } from "react-icons/io5";
import "../../Styles/css/custom-table.css";

const StatsDashboard = ({ stats }) => {
    // Define las estadísticas con sus títulos e íconos
    const kpis = [
        { title: "Total Contactos Únicos", value: stats.total_campaigns, icon: <IoStatsChartOutline size={24} className="text-blue-500" /> },
        { title: "Total contactos en listas", value: stats.total_sends_sms, icon: <IoStatsChartOutline size={24} className="text-green-500" /> },
        { title: "Total Listas Creadas", value: stats.total_sends, icon: <IoStatsChartOutline size={24} className="text-purple-500" /> },
        { title: "Total Campañas Enviadas", value: stats.total_contacts, icon: <IoStatsChartOutline size={24} className="text-yellow-500" /> },
        { title: "Total Emails marketing enviados", value: stats.total_contacts, icon: <IoStatsChartOutline size={24} className="text-red-500" /> },
        { title: "Total Emails Transaccionales enviados", value: stats.total_contacts, icon: <IoStatsChartOutline size={24} className="text-teal-500" /> },
        { title: "Total SMS Marketing enviados", value: stats.total_contacts, icon: <IoStatsChartOutline size={24} className="text-orange-500" /> },
        { title: "Total SMS Transaccionales enviados", value: stats.total_contacts, icon: <IoStatsChartOutline size={24} className="text-gray-500" /> },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
                <Card key={index} className="card">
                    <Flex className="items-center justify-between">
                        <Text className="font-semibold">{kpi.title}</Text>
                        {kpi.icon}
                    </Flex>
                    <Metric className="metric">{kpi.value}</Metric>
                </Card>
            ))}
        </div>
    );
};

export default StatsDashboard;
