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

  #displayNotes = () => {
    const dayCells = document.querySelectorAll("td");
    for (let dayCell of dayCells) {
      if (!dayCell.classList.contains("inactive")) {
        const dayNumber = Number(
          dayCell.querySelector(".day-number").textContent
        );
        const specificDayDate = this.generateNoteDate(dayNumber);
        const result = JSON.parse(
          localStorage.getItem("userNotes")
        ).notes.filter((item) => {
          const itemDate = new Date(item.date);
          return (
            itemDate.getFullYear() === specificDayDate.getFullYear() &&
            itemDate.getMonth() === specificDayDate.getMonth() &&
            itemDate.getDate() === specificDayDate.getDate()
          );
        });
        result?.forEach((n) => {
          const noteDiv = document.createElement("div");
          noteDiv.classList.add("day-note");
          noteDiv.textContent = String(n.description);
          dayCell.appendChild(noteDiv);
        });
      }
    }
  };

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
    calendarBody.innerHTML = "";
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

  generateNoteDate = (dayNumber) => {
    const date = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      dayNumber,
      0
    );
    date.setMinutes(date.getMinutes() - this.currentDate.getTimezoneOffset());
    return date;
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
    this.#displayNotes();
  };
}

class LocalStorageManager {
  constructor() {
    this.userNotes = JSON.parse(localStorage.getItem("userNotes")) || {
      notes: [],
    };
    this.#updateStorage();
    console.log(this.userNotes);
  }

  #updateStorage = () => {
    localStorage.setItem("userNotes", JSON.stringify(this.userNotes));
  };

  addNoteToStorage = (date, description) => {
    this.userNotes.notes.push({
      date,
      description,
    });
    this.#updateStorage();
  };
}

const calendarManager = new CalendarManager();
const localStorageManager = new LocalStorageManager();
calendarManager.showCalendar();

const prevMonthBtn = document.querySelector("#prev-month-btn");
const nextMonthBtn = document.querySelector("#next-month-btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  modal.querySelector(".modal-content").innerHTML = "";
};

const displayPrevMonth = function () {
  calendarManager.resetCalendar();
  newDate = calendarManager.currentDate;
  newDate.setMonth(calendarManager.currentMonth - 2);
  calendarManager.setDateRelatedVars(newDate);
  calendarManager.showCalendar();
  assignAddNoteForEachDay();
};

const displayNextMonth = function () {
  calendarManager.resetCalendar();
  newDate = calendarManager.currentDate;
  newDate.setMonth(calendarManager.currentMonth);
  calendarManager.setDateRelatedVars(newDate);
  calendarManager.showCalendar();
  assignAddNoteForEachDay();
};

const addNoteHandler = function (dayNumber) {
  const description = document.querySelector(".modal-input").value;
  localStorageManager.addNoteToStorage(
    calendarManager.generateNoteDate(dayNumber),
    description
  );
  closeModal();
  calendarManager.showCalendar();
  assignAddNoteForEachDay();
};

const createModalContent = function (dayNumber) {
  const currentYear = calendarManager.currentDate.toLocaleString("en-US", {
    year: "numeric",
  });
  const currentMonth = calendarManager.currentDate.toLocaleString("en-US", {
    month: "long",
  });
  const html = `<div class="modal-title">Add a note to <SetProperDayOfWeek>, ${currentMonth} ${dayNumber}, ${currentYear}.</div>
  <input class="modal-input" />
  <button class="add-note-btn">submit</button>`;
  modal.querySelector(".modal-content").insertAdjacentHTML("afterbegin", html);

  const addNoteBtn = document.querySelector(".add-note-btn");
  addNoteBtn.addEventListener("click", () => {
    addNoteHandler(dayNumber);
  });
};

const assignAddNoteForEachDay = function () {
  const allDaysCells = document.querySelectorAll("td");
  allDaysCells.forEach((e) => {
    if (!e.classList.contains("inactive")) {
      e.addEventListener("click", function () {
        openModal();
        createModalContent(
          Number(this.querySelector(".day-number").textContent)
        );
      });
    }
  });
};

assignAddNoteForEachDay();

overlay.addEventListener("click", closeModal);

prevMonthBtn.addEventListener("click", displayPrevMonth);

nextMonthBtn.addEventListener("click", displayNextMonth);
