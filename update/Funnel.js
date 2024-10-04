"use client"

import { useState } from 'react'
import { Funnel, FunnelChart, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const [activeIndex, setActiveIndex] = useState(-1)

  const data = [
    { name: "Clics Totales", value: 5000, fill: "#000000" },
    { name: "Facebook", value: 3000, fill: "#1E40AF" },
    { name: "Instagram", value: 1500, fill: "#9333EA" },
    { name: "YouTube", value: 500, fill: "#DC2626" },
  ]

  const getPercent = (value: number) => {
    const total = data[0].value
    return Math.round((value / total) * 100)
  }

  const renderCustomizedLabel = (props: any) => {
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Embudo de Conversión - Acortador de Enlaces</CardTitle>
        <CardDescription>Estadísticas de tráfico por plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip 
                formatter={(value, name) => [`${value} (${getPercent(value)}%)`, name]}
                labelStyle={{ color: '#000' }}
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
      </CardContent>
    </Card>
  )
}