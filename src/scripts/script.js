class CalendarManager {
  constructor() {
    this.setDateRelatedVars(new Date());
  }

  setDateRelatedVars(date) {
    this.currentDate = date;
    this.currentMonth = date.getMonth() + 1;
    this.firstDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();

    this.numberOfDaysInMonth = new Date(
      date.getFullYear(),
      this.currentMonth,
      0
    ).getDate();

    this.numberOfDaysInPreviousMonth = new Date(
      date.getFullYear(),
      this.currentMonth - 1,
      0
    ).getDate();
  }

  #generateDay(dayNumber) {
    const td = document.createElement("td");
    const div = document.createElement("div");
    div.classList.add("day-number");
    div.textContent = String(dayNumber);
    td.appendChild(div);
    return td;
  }
  #addInactiveClassToDay = (day) => {
    day.classList.add("inactive");
    return day;
  };
  #generateFirstSection = () => {
    const daysSectionsWrap = document.createElement("tr");
    daysSectionsWrap.classList.add("days-sections-wrap");
    for (
      let i = this.numberOfDaysInPreviousMonth - this.firstDayOfMonth;
      i < this.numberOfDaysInPreviousMonth;
      i++
    ) {
      daysSectionsWrap.appendChild(
        this.#addInactiveClassToDay(this.#generateDay(i + 1))
      );
    }
    for (let i = 0; i < 7 - this.firstDayOfMonth; i++) {
      daysSectionsWrap.appendChild(this.#generateDay(i + 1));
    }
    return daysSectionsWrap;
  };

  /**
   * Generates a section containing seven days starting from the specified day.
   * @param {number} start - The starting day.
   * @returns {HTMLTableRowElement} - The generated section containing seven days.
   */
  #generateSevenDaySection = (start) => {
    const daysSectionsWrap = document.createElement("tr");
    daysSectionsWrap.classList.add("days-sections-wrap");
    for (let i = start; i < start + 7; i++) {
      daysSectionsWrap.appendChild(this.#generateDay(i + 1));
    }
    return daysSectionsWrap;
  };

  /**
   * Generates the last section of the calendar table.
   *
   * @param {number} start - The starting day of the last section.
   * @returns {HTMLTableRowElement} - The generated HTML table row element representing the last section.
   */
  #generateLastSection = (start) => {
    const daysSectionsWrap = document.createElement("tr");
    daysSectionsWrap.classList.add("days-sections-wrap");
    for (let i = start; i < this.numberOfDaysInMonth; i++) {
      daysSectionsWrap.appendChild(this.#generateDay(i + 1));
    }
    for (let i = 0; i < 7 - (this.numberOfDaysInMonth - start); i++) {
      daysSectionsWrap.appendChild(
        this.#addInactiveClassToDay(this.#generateDay(i + 1))
      );
    }
    return daysSectionsWrap;
  };

  #displayCalendarSectionTitle = () => {
    const textElem = document.querySelector(".calendar-title-container span");
    const currentYear = this.currentDate.toLocaleString("en-US", {
      year: "numeric",
    });
    const currentMonth = this.currentDate.toLocaleString("en-US", {
      month: "long",
    });
    textElem.textContent = `${currentMonth} ${currentYear}`;
  };

  #displayDays = () => {
    const calendarBody = document.querySelector("tbody");
    calendarBody.appendChild(this.#generateFirstSection());
    let lastI = 0;
    for (
      let i = 7 - this.firstDayOfMonth;
      i < this.numberOfDaysInMonth - 7;
      i += 7
    ) {
      calendarBody.appendChild(this.#generateSevenDaySection(i));
      lastI = i;
    }
    calendarBody.appendChild(this.#generateLastSection(lastI + 7));
  };

  resetCalendar = () => {
    const calendarBody = document.querySelector("tbody");
    while (calendarBody.hasChildNodes()) {
      calendarBody.removeChild(calendarBody.lastChild);
    }
  };

  showCalendar = () => {
    this.#displayDays();
    this.#displayCalendarSectionTitle();
  };
}

const calendarManager = new CalendarManager();
calendarManager.showCalendar();

const prevMonthBtn = document.querySelector("#prev-month-btn");
const nextMonthBtn = document.querySelector("#next-month-btn");

prevMonthBtn.addEventListener("click", () => {
  calendarManager.resetCalendar();
  newDate = calendarManager.currentDate;
  newDate.setMonth(calendarManager.currentMonth - 2);
  calendarManager.setDateRelatedVars(newDate);
  calendarManager.showCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  calendarManager.resetCalendar();
  newDate = calendarManager.currentDate;
  newDate.setMonth(calendarManager.currentMonth);
  calendarManager.setDateRelatedVars(newDate);
  calendarManager.showCalendar();
});
