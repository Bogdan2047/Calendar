import React, { useEffect, useState } from "react";
import { Popup } from "../popup/popup";
import add from "../../assets/add.png";
import { Notes } from "../notes/notes";
import right from "../../assets/right.png";
import left from "../../assets/left.png";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";

import { getAllCountriesFetch } from "../../store/country/getAllCountries";
import { getCountryHolidayFetch } from "../../store/country/getCountryHoliday";
import {
  AllCountriesData,
  CountriyHolidaysData,
  NoteType,
  NoticeType,
} from "../interface/interface";
import { useAppDispatch } from "../hooks/hooks";
import { getAllHolidayFetch } from "../../store/country/allHolidays";

interface DayInfo {
  day: number;
  month: "prev" | "current" | "next";
}

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [getNotice, setGetNotice] = useState<NoticeType[]>([]);
  const [notice, setNotice] = useState<NoticeType[] | null>(null);
  const [showCountry, setShowCountry] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>("");
  const [countryName, setCountryName] = useState<string>("");
  const [currentNotice, setCurrentNotice] = useState<any>(null);
  const [showNotes, setShowNotes] = useState<boolean>(false);

  const { allCountries } = useSelector(
    (state: AllCountriesData) => state.toolkit.allCountries
  );
  const { holidays } = useSelector(
    (state: CountriyHolidaysData) => state.toolkit.holidays
  );

  const { allHolidays } = useSelector(
    (state: CountriyHolidaysData) => state.toolkit.allHolidays
  );

  const dispatch = useAppDispatch();

  const daysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getDaysInPreviousMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const createWeekRows = () => {
    const days: DayInfo[] = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    let firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    firstDayOfMonth = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;
    const daysInPreviousMonth = getDaysInPreviousMonth(
      currentMonth,
      currentYear
    );

    for (let i = firstDayOfMonth - 1; i > 0; i--) {
      days.unshift({
        day: daysInPreviousMonth - i + 1,
        month: "prev",
      });
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push({
        day,
        month: "current",
      });
    }

    const totalCells = Math.ceil(days.length / 7) * 7;
    const extraDays = totalCells - days.length;

    if (days.length + extraDays > 35) {
    } else {
      for (let i = 1; i <= extraDays; i++) {
        days.push({
          day: i,
          month: "next",
        });
      }
    }

    const weekRows: DayInfo[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekRows.push(days.slice(i, i + 7));
    }

    return weekRows;
  };

  const renderWeekDays = () => {
    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        {weekDays.map((day, index) => (
          <div
            key={index}
            style={{ width: "14.28%", textAlign: "center", color: "white" }}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const prevMonth = () => {
    setCurrentMonth(currentMonth - 1);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(currentMonth + 1);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    }
  };

  useEffect(() => {
    dispatch(getAllCountriesFetch());
    dispatch(getAllHolidayFetch());

    const noticeItem = localStorage.getItem("notice");
    const countryItem = localStorage.getItem("country");

    const notice = noticeItem ? JSON.parse(noticeItem) : null;
    const country = countryItem ? JSON.parse(countryItem) : null;

    if (notice) {
      setNotice(notice);
    }

    if (country) {
      setCountryCode(country.code);
      setCountryName(country.name);
    }
  }, []);

  useEffect(() => {
    if (countryCode.length > 0)
      dispatch(getCountryHolidayFetch({ countryCode }));
  }, [countryCode]);

  useEffect(() => {
    if (
      getNotice.length > 0 &&
      getNotice.some((item: NoticeType) => item.note && item.note.length > 0)
    ) {
      const storedNotices = localStorage.getItem("notice");
      const updateNotice = storedNotices ? JSON.parse(storedNotices) : [];

      getNotice.forEach((item: NoticeType) => {
        if (item.note && item.note.length > 0) {
          updateNotice.push(item);
        }
      });

      localStorage.setItem("notice", JSON.stringify(updateNotice));
      showNotice();
      setGetNotice([]);
    }
  }, [getNotice]);

  const showNotice = () => {
    const noticeItem = localStorage.getItem("notice");

    const notice = noticeItem ? JSON.parse(noticeItem) : null;

    if (notice) {
      setNotice(notice);
    }
  };

  const addeNotice = (day: number, dayIndex: number) => {
    const cellId = dayIndex + day + currentMonth + currentYear;
    let notesForCell: NoticeType[] = [];

    if (notice !== null) {
      notesForCell = notice.filter((item: NoticeType) => item.id === cellId);
    }

    if (notesForCell.length >= 4) {
      alert("Нельзя создать более 4 заметок в одной ячейке.");
      return;
    }

    setShowPopup(true);
    const newNotice: NoticeType = {
      id: cellId,
      day: day,
      month: currentMonth,
      year: currentYear,
      codeCountry: countryCode,
      note: [],
      noteId: Math.floor(1000000 + Math.random() * 9000000),
    };

    setGetNotice((prevNotices) => [...prevNotices, newNotice]);
  };

  const countryHandler = (code: string, name: string) => {
    setCountryCode(code);
    setCountryName(name);
    setShowCountry(false);
    localStorage.setItem("country", JSON.stringify({ code, name }));
  };

  const dragStartHandler = (note: NoticeType) => {
    setCurrentNotice(note);
    console.log("noteBefore", note);
  };

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const dropHandler = (
    e: React.DragEvent<HTMLDivElement>,
    note: NoticeType
  ) => {
    e.preventDefault();

    if (note.id === currentNotice.id) {
      return;
    }

    if (note && notice !== null) {
      const updateNotice = notice.map((item: NoticeType) => {
        if (item.id === note.id) {
          if (item.noteId === note.noteId) {
            return {
              ...item,
              note: currentNotice.note,
              changedOnDay: currentNotice.day,
            };
          }
        }
        if (item.id === currentNotice.id) {
          if (item.noteId === currentNotice.noteId) {
            return {
              ...item,
              note: note.note,
              changedOnDay: note.day,
            };
          }
        }
        return item;
      });
      setNotice(updateNotice);
      localStorage.setItem("notice", JSON.stringify(updateNotice));
    }
  };

  const dropWithoutNoticeHandler = (
    e: React.DragEvent<HTMLDivElement>,
    day: number,
    dayIndex: number
  ) => {
    e.preventDefault();

    const newId = dayIndex + day + currentMonth + currentYear;

    const existingNotice = notice?.find(
      (item: NoticeType) => item.id === newId
    );

    if (existingNotice) {
      return;
    }

    const updateNotice = notice?.map((item: NoticeType) => {
      if (
        item.id === currentNotice.id &&
        item.noteId === currentNotice.noteId
      ) {
        return {
          id: dayIndex + day + currentMonth + currentYear,
          day: day,
          month: currentMonth,
          year: currentYear,
          codeCountry: countryCode,
          note: currentNotice.note,
          noteId: Math.floor(1000000 + Math.random() * 9000000),
        };
      }
      return item;
    });

    setNotice(updateNotice ?? null);

    localStorage.setItem("notice", JSON.stringify(updateNotice));
  };

  const sortNotice = (a: NoticeType, b: NoticeType) => {
    if (a.id === undefined) {
      return b.id === undefined ? 0 : -1;
    } else if (b.id === undefined) {
      return 1;
    }

    return a.id - b.id;
  };

  function downloadCalendarData(jsonData: string) {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "calendarData.json";

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }

  const handleDownloadClick = () => {
    if (notice !== null) {
      const jsonData = JSON.stringify(notice, null, 2);
      downloadCalendarData(jsonData);
    }
  };

  const ScreenshotButton = () => {
    const takeScreenshot = () => {
      html2canvas(document.body).then((canvas) => {
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "screenshot.png";
        a.click();
      });
    };

    return (
      <button
        style={{
          borderStyle: "none",
          backgroundColor: "transparent",
          cursor: "pointer",
          color: "white",
        }}
        onClick={takeScreenshot}
      >
        Сделать скриншот
      </button>
    );
  };

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "Black",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 10,
          paddingInline: 10,
          paddingBottom: 10,
        }}
      >
        <div>
          <button
            onClick={prevMonth}
            style={{
              borderStyle: "none",
              backgroundColor: "black",
              cursor: "pointer",
            }}
          >
            <img src={left} alt="" style={{ width: 25 }} />
          </button>
        </div>
        <div style={{ color: "white" }}>
          Месяц: {currentMonth + 1}, Год: {currentYear}
        </div>
        <div>
          <button
            onClick={nextMonth}
            style={{
              borderStyle: "none",
              backgroundColor: "black",
              cursor: "pointer",
            }}
          >
            <img src={right} alt="" style={{ width: 25 }} />
          </button>
        </div>
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", paddingBottom: 10 }}
      >
        <button
          onClick={() => setShowCountry(true)}
          style={{
            borderStyle: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            color: "white",
          }}
        >
          {countryName ? countryName : "Выбор страны"}
        </button>
      </div>

      {showCountry && (
        <div className="overlay" onClick={() => setShowCountry(false)}>
          <div
            style={{
              height: 400,
              width: 300,
              overflowY: "auto",
              position: "absolute",
              top: 310,
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9,
              border: "1px solid black",
              backgroundColor: "DodgerBlue",
              display: "flex",
              flexDirection: "column",
              borderRadius: "10px",
              paddingTop: 10,
              paddingInline: 10,
              paddingBottom: 10,
            }}
          >
            {allCountries.length > 0 &&
              allCountries.map((item: AllCountriesData) => (
                <div style={{ paddingTop: 2, paddingBottom: 2 }}>
                  <div
                    onClick={() => countryHandler(item.countryCode, item.name)}
                    className="choiceCountry"
                  >
                    <span>{item.name}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {showPopup && (
        <div className="overlay">
          <div
            style={{
              position: "absolute",
              top: 300,
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 6,
            }}
          >
            <Popup setShowPopup={setShowPopup} setGetNotice={setGetNotice} />
          </div>
        </div>
      )}

      {showNotes && currentNotice !== null && (
        <div className="overlay">
          <div
            style={{
              position: "absolute",
              top: 300,
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 6,
            }}
          >
            <Notes
              setShowNotes={setShowNotes}
              currentNotice={currentNotice}
              notice={notice ?? []}
              setNotice={setNotice}
            />
          </div>
        </div>
      )}

      {renderWeekDays()}

      {createWeekRows().map((week, weekIndex) => (
        <div
          key={weekIndex}
          style={{ display: "flex", flexDirection: "row", flexGrow: 1 }}
        >
          {week.map(({ day, month }, dayIndex) => {
            const dateString = `${currentYear}-${String(
              currentMonth + 1
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const holidayNew = holidays.find(
              (holiday: any) => holiday.date === dateString
            );
            const allHolidayNew = allHolidays.find(
              (holiday: any) => holiday.date === dateString
            );
            const isCurrentMonth = month === "current";
            return (
              <div
                key={dayIndex}
                style={{
                  width: "14.28%",
                  height: 140,
                  border: "1px solid black",
                  position: "relative",
                  backgroundColor: isCurrentMonth ? "Blue" : "DarkBlue",
                  color: isCurrentMonth ? "black" : "#a0a0a0",
                  borderRadius: "5px",
                }}
                onDrop={(e) => dropWithoutNoticeHandler(e, day, dayIndex)}
                onDragOver={(e) => dragOverHandler(e)}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 5,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: holidayNew ? "red" : "white",
                      }}
                    >
                      {day}
                    </span>
                  </div>

                  <div>
                    <img
                      src={add}
                      alt=""
                      style={{ cursor: "pointer", width: 25 }}
                      onClick={() => addeNotice(day, dayIndex)}
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    {notice !== null
                      ? notice.sort(sortNotice).map((item: NoticeType) => {
                          if (
                            item.day === day &&
                            item.id ===
                              dayIndex + day + currentYear + currentMonth &&
                            item.year === currentYear &&
                            item.month === currentMonth
                          ) {
                            return item.note?.map(
                              (data: NoteType, i: number) => (
                                <div
                                  onDragStart={(e) => dragStartHandler(item)}
                                  onDragOver={(e) => dragOverHandler(e)}
                                  onDrop={(e) => dropHandler(e, item)}
                                  draggable={true}
                                  onClick={() => setCurrentNotice(item)}
                                  style={{
                                    cursor: "grab",
                                    width: "20%",
                                    paddingLeft: 9,
                                  }}
                                >
                                  <div
                                    style={{
                                      backgroundColor: data.color,
                                      width: `${100 / item.note.length}%`,
                                      height: 10,
                                    }}
                                  ></div>
                                </div>
                              )
                            );
                          }
                        })
                      : null}
                  </div>
                  <div
                    style={{
                      paddingTop: 10,
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {notice !== null && currentNotice
                      ? notice.sort(sortNotice).map((item: NoticeType) => {
                          if (
                            item.noteId === currentNotice.noteId &&
                            item.day === day &&
                            item.id ===
                              dayIndex + day + currentYear + currentMonth &&
                            item.year === currentYear &&
                            item.month === currentMonth
                          ) {
                            return item.note.map((note: NoteType) => {
                              return (
                                <div
                                  style={{
                                    width: "90%",
                                    height: 40,
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setShowNotes(true)}
                                >
                                  <span style={{ paddingLeft: 5 }}>
                                    {(note.title?.length ?? 0) > 22
                                      ? note.title?.slice(0, 22) + "..."
                                      : note.title ?? ""}
                                  </span>
                                </div>
                              );
                            });
                          }
                        })
                      : null}
                  </div>
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: 5,
                    left: 5,
                  }}
                >
                  {holidays.length === 0 ? (
                    <div>
                      <span style={{ color: "white" }}>
                        {allHolidayNew?.name}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span style={{ color: "white" }}>{holidayNew?.name}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingInline: 10,
          paddingTop: 5,
        }}
      >
        <div>{ScreenshotButton()}</div>
        <div>
          {notice !== null && (
            <button
              onClick={handleDownloadClick}
              style={{
                borderStyle: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                color: "white",
              }}
            >
              Скачать данные календаря
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
