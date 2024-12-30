import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { Dialog, DialogTrigger, DialogContent } from "./components/ui/dialog";

interface Event {
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  category: "work" | "personal" | "others";
  date: Date;
}

function CalendarApp(): JSX.Element {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEventIndex, setEditingEventIndex] = useState<number | null>(
    null
  );
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const onDateClick = (day: Date) => setSelectedDate(day);

  const renderHeader = (): JSX.Element => (
    <div className="flex justify-between items-center py-4 bg-gray-200 rounded-lg px-4">
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={onPrevMonth}
      >
        &lt; Previous
      </button>
      <h2 className="text-lg font-bold text-gray-800">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={onNextMonth}
      >
        Next &gt;
      </button>
    </div>
  );

  const renderDays = (): JSX.Element => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 bg-gray-100 rounded-lg">
        {days.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = (): JSX.Element => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        days.push(
          <div
            className={`px-2 py-4 text-center border cursor-pointer ${
              isSameMonth(day, monthStart)
                ? "bg-white text-gray-800"
                : "bg-gray-50 text-gray-400"
            } ${
              isSameDay(day, selectedDate)
                ? "bg-blue-200 text-blue-900 font-bold"
                : ""
            } ${
              isToday(day) ? "bg-yellow-200 text-black font-bold" : ""
            } hover:bg-blue-100`}
            key={day.toISOString()}
            onClick={() => onDateClick(cloneDay)}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const addEvent = (event: Event) => {
    const isOverlap = events.some(
      (existingEvent) =>
        existingEvent.date.getTime() === event.date.getTime() &&
        ((event.startTime >= existingEvent.startTime &&
          event.startTime < existingEvent.endTime) ||
          (event.endTime > existingEvent.startTime &&
            event.endTime <= existingEvent.endTime))
    );

    if (isOverlap) {
      alert("Event times overlap. Please choose different times.");
      return;
    }
    setEvents([...events, event]);
  };

  const eventsForSelectedDay = events.filter(
    (event) => selectedDate && isSameDay(new Date(event.date), selectedDate)
  );

  const updateEvent = (index: number, updatedEvent: Event) => {
    const updatedEvents = [...events];
    updatedEvents[index] = updatedEvent;
    setEvents(updatedEvents);
    setEditingEventIndex(null);
  };

  const handleDeleteEvent = (index: number) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  const exportToCSV = () => {
    const csv = events
      .map(
        (event) =>
          `${event.name},${event.startTime},${event.endTime},${
            event.description || "N/A"
          },${event.category},${format(event.date, "MMMM dd, yyyy")}`
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `events-${format(currentMonth, "MMMM-yyyy")}.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {selectedDate && (
        <Dialog>
          <DialogTrigger>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              View/Add Events
            </button>
          </DialogTrigger>
          <DialogContent>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Events for {format(selectedDate, "MMMM d, yyyy")}
            </h3>

            <div className="mb-4">
              {eventsForSelectedDay.map((event, index) => (
                <div
                  key={index}
                  className={`text-gray-700 mb-2 flex justify-between items-center bg-white p-4 rounded-lg shadow-md`}
                  style={{
                    borderLeft: `5px solid ${
                      event.category === "work"
                        ? "blue"
                        : event.category === "personal"
                        ? "green"
                        : "orange"
                    }`,
                  }}
                >
                  <div>
                    <strong>{event.name}</strong>
                    <p className="text-sm text-gray-500">
                      {event.startTime} - {event.endTime}
                    </p>
                    {event.description && (
                      <p className="text-sm text-gray-400">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setEditingEventIndex(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteEvent(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <EventForm
              onAddEvent={addEvent}
              onUpdateEvent={updateEvent}
              selectedDate={selectedDate}
              editingEventIndex={editingEventIndex}
              initialValues={
                editingEventIndex !== null
                  ? eventsForSelectedDay[editingEventIndex]
                  : undefined
              }
            />

            <button
              onClick={exportToCSV}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Export to CSV
            </button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface EventFormProps {
  onAddEvent: (event: Event) => void;
  onUpdateEvent: (index: number, updatedEvent: Event) => void;
  selectedDate: Date;
  editingEventIndex: number | null;
  initialValues?: {
    name: string;
    startTime: string;
    endTime: string;
    description?: string;
    category: "work" | "personal" | "others";
  };
}

function EventForm({
  onAddEvent,
  onUpdateEvent,
  selectedDate,
  editingEventIndex,
  initialValues,
}: EventFormProps): JSX.Element {
  const [name, setName] = useState(initialValues?.name || "");
  const [startTime, setStartTime] = useState(initialValues?.startTime || "");
  const [endTime, setEndTime] = useState(initialValues?.endTime || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [category, setCategory] = useState(initialValues?.category || "work");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      name,
      startTime,
      endTime,
      description,
      category,
      date: selectedDate,
    };

    if (editingEventIndex !== null) {
      onUpdateEvent(editingEventIndex, newEvent);
    } else {
      onAddEvent(newEvent);
    }

    setName("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setCategory("work");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input
        type="text"
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        placeholder="Event Description (Optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value as "work" | "personal" | "others")
        }
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="others">Others</option>
      </select>
      <button
        type="submit"
        className={`w-full px-4 py-2 rounded-lg ${
          editingEventIndex !== null
            ? "bg-green-500 hover:bg-green-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        {editingEventIndex !== null ? "Update Event" : "Add Event"}
      </button>
    </form>
  );
}

export default CalendarApp;
