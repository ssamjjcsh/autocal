'use client'

import React from 'react'
import DatePicker from 'react-datepicker'
import { ko } from 'date-fns/locale'
import { cn } from '../../utils/cn';
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'

interface CustomDatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function CustomDatePicker({
  date,
  setDate,
  placeholder = "날짜 선택",
  className
}: CustomDatePickerProps) {
  return (
    <div className={cn("w-full", className)}>
      <DatePicker
        selected={date}
        onChange={(date: Date | null) => setDate(date || undefined)}
        locale={ko}
        dateFormat="yyyy년 MM월 dd일"
        placeholderText={placeholder}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        showPopperArrow={false}
        popperClassName="react-datepicker-popper"
        popperPlacement="bottom-start"
        popperModifiers={[]}
      />
    </div>
  )
}

export function CustomDatePickerWithPopover({
  date,
  setDate,
  placeholder = "날짜 선택",
  className
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'yyyy년 MM월 dd일') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DatePicker
          selected={date}
          onChange={(date: Date | null) => {
            setDate(date || undefined)
            setIsOpen(false)
          }}
          locale={ko}
          inline
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex justify-between items-center px-2 py-2">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="px-2 py-1 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                {'<'}
              </button>
              <div className="flex items-center">
                <select
                  value={date.getFullYear()}
                  onChange={({ target: { value } }) => changeYear(Number(value))}
                  className="mx-1 p-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 201 }, (_, i) => new Date().getFullYear() - 100 + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={date.getMonth()}
                  onChange={({ target: { value } }) => changeMonth(Number(value))}
                  className="mx-1 p-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                    <option key={month} value={month}>
                      {ko.localize?.month(month as any, { width: 'wide' })}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="px-2 py-1 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                {'>'}
              </button>
            </div>
          )}
        />
      </PopoverContent>
    </Popover>
  )
}