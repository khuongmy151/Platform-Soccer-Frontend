import { useEffect, useRef, useState } from "react";

export default function DateSelector({ onApply }) {
  const scrollRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [pickerDate, setPickerDate] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Tạo danh sách ngày trong năm hiện tại
  const daysInYear = [];
  const dateCursor = new Date(currentYear, 0, 1);
  while (dateCursor.getFullYear() === currentYear) {
    daysInYear.push({
      dayName: dateCursor
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase(),
      dayNumber: dateCursor.getDate().toString(),
      monthName: dateCursor
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase(),
      fullDateString: dateCursor.toDateString(),
      isoDate: dateCursor.toISOString().slice(0, 10), // thêm để đồng bộ picker
      isToday: dateCursor.toDateString() === new Date().toDateString(),
    });
    dateCursor.setDate(dateCursor.getDate() + 1);
  }

  // Cuộn đến một ngày cụ thể trên thanh ngang
  const scrollToDate = (dateString) => {
    if (scrollRef.current) {
      const targetElement = scrollRef.current.querySelector(
        `button[data-date="${dateString}"]`,
      );
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }
  };

  // Khi selectedDate thay đổi, cuộn đến ngày đó
  useEffect(() => {
    if (selectedDate) {
      scrollToDate(selectedDate);
    }
  }, [selectedDate]);

  // Xử lý kéo thả chuột để cuộn
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Xử lý khi nhấn Apply
  const handleApply = () => {
    // Gọi callback truyền ngày dạng YYYY-MM-DD ra ngoài
    onApply(pickerDate);

    // Cập nhật hiển thị trên thanh (tô sáng ngày tương ứng)
    const selected = new Date(pickerDate);
    setCurrentYear(selected.getFullYear());
    setSelectedDate(selected.toDateString());
  };

  return (
    <div className="w-full bg-surface-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 mb-6 flex flex-col lg:flex-row items-center justify-between gap-4 select-none">
      {/* Thanh cuộn ngang */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className={`flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto py-1 cursor-grab active:cursor-grabbing transition-all ${
          isDragging ? "scale-[0.99]" : ""
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {daysInYear.map((item) => {
          const isActive = selectedDate === item.fullDateString;
          return (
            <button
              key={item.fullDateString}
              data-date={item.fullDateString}
              onClick={() => {
                setPickerDate(item.isoDate);
                setSelectedDate(item.fullDateString);
                // Gọi callback lọc tournament ra ngoài (Dashboard)
                onApply(item.isoDate);
              }}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-22 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[linear-gradient(150deg,#d31027_0%,#ff9482_100%)] text-white shadow-md scale-105 z-10 is-today"
                  : "bg-surface-card text-gray-400 hover:bg-gray-100"
              }`}
            >
              <span
                className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${
                  isActive ? "text-white/90" : "text-gray-500"
                }`}
              >
                {item.monthName}
              </span>
              <span className="text-xl font-black font-display leading-none mb-1">
                {item.dayNumber}
              </span>
              <span
                className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                  isActive ? "bg-white/20 text-white" : "text-gray-500/60"
                }`}
              >
                {item.dayName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Date Picker + Apply */}
      <div className="flex flex-col items-start gap-2 w-full lg:w-auto">
        <label className="text-[9px] font-black text-brand-primary uppercase tracking-widest lg:mr-2">
          Select Date
        </label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={pickerDate}
            onChange={(e) => setPickerDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-surface-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
          <button
            onClick={handleApply}
            className="bg-brand-primary hover:bg-brand-dark text-white text-[11px] font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-widest shadow-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
