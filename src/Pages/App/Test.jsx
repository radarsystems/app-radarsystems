import React, { useState } from 'react'
import { Funnel, FunnelChart, Tooltip, ResponsiveContainer, LabelList } from "recharts"

export default function Test() {
  const [activeIndex, setActiveIndex] = useState(-1)

  const data = [
    { name: "Clics Totales", value: 5000, fill: "#000000" },
    { name: "Facebook", value: 3000, fill: "#1E40AF" },
    { name: "Instagram", value: 1500, fill: "#9333EA" },
    { name: "YouTube", value: 500, fill: "#DC2626" },
  ]

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
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">Embudo de Conversión - Acortador de Enlaces</h2>
        <p className="text-gray-600 mb-4">Estadísticas de tráfico por plataforma</p>
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
      </div>
    </div>
  )
}