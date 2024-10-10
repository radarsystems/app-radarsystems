import React, { useState } from 'react'
import { Funnel, FunnelChart, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import "../../Styles/css/Funnel.css"

export default function FunnelStats({ data }) {
    const [activeIndex, setActiveIndex] = useState(-1)


    const getPercent = (value) => {
        const total = data[0].value
        return Math.round((value / total) * 100)
    }

    const renderCustomizedLabel = (props) => {
        const { x, y, width, height, value, index } = props
        const radius = 10
        const fontSize = 12
        const lineHeight = 20
        const isActive = index === activeIndex

        return (
            <g>
                <text
                    x={x + width + radius * 2}
                    y={y + height / 2}
                    fill="#000"
                    fontSize={fontSize}
                    fontWeight={isActive ? "bold" : "normal"}
                    textAnchor="start"
                    dominantBaseline="middle"
                >
                    <tspan x={x + width + radius * 2} dy="-1em">{data[index].name}</tspan>
                    <tspan x={x + width + radius * 2} dy={lineHeight}>{value} ({getPercent(value)}%)</tspan>
                </text>
            </g>
        )
    }

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                    <Tooltip
                        formatter={(value, name) => [`${value} (${getPercent(value)}%)`, name]}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '10px'
                        }}
                    />

                    <Funnel
                        dataKey="value"
                        data={data}
                        isAnimationActive
                        activeIndex={activeIndex}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(-1)}
                    >
                        <LabelList
                            position="right"
                            content={renderCustomizedLabel}
                        />
                    </Funnel>
                </FunnelChart>
            </ResponsiveContainer>
        </div>
    )
}