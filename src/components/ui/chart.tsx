'use client'

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: HH:MM:SS
const formatTime = (value: number) => {
  const date = new Date(value)
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

const Chart = RechartsPrimitive

type ChartContainerProps = React.ComponentProps<"div">

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "[--chart-padding:1rem] [--chart-gap:1rem] flex aspect-video justify-center text-xs",
      className
    )}
    {...props}
  />
))
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  }
>((
  {
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
  },
  ref
) => {
  const [firstPayload] = payload ?? []
  const { name, payload: pl } = firstPayload ?? {}
  const nameFormatter = React.useCallback(
    (value: string, pl: any) => {
      return nameKey && pl[nameKey] ? pl[nameKey] : value
    },
    [nameKey]
  )

  if (active && payload && payload.length) {
    const finalLabel = labelKey && pl[labelKey] ? pl[labelKey] : label

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-slate-200 border-slate-200/50 bg-white px-2.5 py-1.5 text-xs shadow-xl dark:border-slate-800 dark:border-slate-800/50 dark:bg-slate-950",
          className
        )}
      >
        {!hideLabel && finalLabel ? (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter ? labelFormatter(finalLabel, payload) : finalLabel}
          </div>
        ) : null}
        <div className="grid gap-1.5">
          {payload.map((item, i) => {
            const key = `${item.name}-${i}`
            const itemColor = color || item.color || "#888888"
            const finalName = nameFormatter(item.name as string, item.payload)

            return (
              <div
                key={key}
                className="grid grid-cols-[auto,1fr,auto] items-center gap-2.5"
              >
                {!hideIndicator && (
                  <div
                    className={cn("h-2.5 w-2.5 shrink-0 rounded-[2px]", {
                      "rounded-full": indicator === "dot",
                      "bg-slate-300": indicator === "line",
                    })}
                    style={{
                      backgroundColor: itemColor,
                    }}
                  />
                )}
                <div className="flex-1">
                  {formatter ? formatter(item.value, finalName, item, i, payload) : finalName}
                </div>
                <div className="font-medium text-slate-950 dark:text-slate-50">
                  {formatter
                    ? null
                    : item.value}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    hideIcon?: boolean
    payload?: RechartsPrimitive.LegendPayload
  }
>(({ className, hideIcon = false, payload }, ref) => {
  if (!payload || !payload.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", className)}
    >
      {payload.map((item) => {
        const { value, color } = item
        const key = `${value}`

        return (
          <div
            key={key}
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
          >
            {!hideIcon && (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: color }}
              />
            )}
            {value}
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegendContent"

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  formatTime,
}