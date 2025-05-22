import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

type CalendarPopupProps = {
    showOnlyCalendar?: boolean;
};

const CalendarPopup: React.FC<CalendarPopupProps> = ({ showOnlyCalendar }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [showCalendar, setShowCalendar] = useState(showOnlyCalendar ?? false);
    const calendarRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!showOnlyCalendar) {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    calendarRef.current &&
                    !calendarRef.current.contains(event.target as Node)
                ) {
                    setShowCalendar(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showOnlyCalendar]);

    if (showOnlyCalendar) {
        return (
            <div ref={calendarRef}>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                        setStartDate(date);
                    }}
                    inline
                />
            </div>
        );
    }

    return (
        <div className="relative inline-block" ref={calendarRef}>
            <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="p-2 rounded hover:bg-gray-200"
            >
                <FaCalendarAlt size={20} />
            </button>
            {showCalendar && (
                <div className="absolute z-10 mt-2">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                            setShowCalendar(false);
                        }}
                        inline
                    />
                </div>
            )}
        </div>
    );
};

export default CalendarPopup;
