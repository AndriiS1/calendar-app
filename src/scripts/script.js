const currentDate = new Date();
let currentMonth = currentDate.getMonth() + 1;
let firstDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
).getDay();

let numberOfDaysInMonth = new Date(
  currentDate.getFullYear(),
  currentMonth,
  0
).getDate();

let numberOfDaysInPreviousMonth = new Date(
  currentDate.getFullYear(),
  currentMonth - 1,
  0
).getDate();

const generateDay = (dayNumber) => {
  const td = document.createElement("td");
  const div = document.createElement("div");
  div.classList.add("day-number");
  div.textContent = String(dayNumber);
  td.appendChild(div);
  return td;
};

const addInactiveClassToDay = (day) => {
  day.classList.add("inactive");
  return day;
};

/**
 * Generates the first section of the calendar.
 * @returns {HTMLTableRowElement} The generated HTML element representing the first section of the calendar.
 */
const generateFirstSection = () => {
  const daysSectionsWrap = document.createElement("tr");
  daysSectionsWrap.classList.add("days-sections-wrap");
  for (
    let i = numberOfDaysInPreviousMonth - firstDayOfMonth;
    i < numberOfDaysInPreviousMonth;
    i++
  ) {
    daysSectionsWrap.appendChild(addInactiveClassToDay(generateDay(i + 1)));
  }
  for (let i = 0; i < 7 - firstDayOfMonth; i++) {
    daysSectionsWrap.appendChild(generateDay(i + 1));
  }
  return daysSectionsWrap;
};

/**
 * Generates a section containing seven days starting from the specified day.
 * @param {number} start - The starting day.
 * @returns {HTMLTableRowElement} - The generated section containing seven days.
 */
const generateSevenDaySection = (start) => {
  const daysSectionsWrap = document.createElement("tr");
  daysSectionsWrap.classList.add("days-sections-wrap");
  for (let i = start; i < start + 7; i++) {
    daysSectionsWrap.appendChild(generateDay(i + 1));
  }
  return daysSectionsWrap;
};

/**
 * Generates the last section of the calendar table.
 *
 * @param {number} start - The starting day of the last section.
 * @returns {HTMLTableRowElement} - The generated HTML table row element representing the last section.
 */
const generateLastSection = (start) => {
  const daysSectionsWrap = document.createElement("tr");
  daysSectionsWrap.classList.add("days-sections-wrap");
  for (let i = start; i < numberOfDaysInMonth; i++) {
    daysSectionsWrap.appendChild(generateDay(i + 1));
  }
  for (let i = 0; i < 7 - (numberOfDaysInMonth - start); i++) {
    daysSectionsWrap.appendChild(addInactiveClassToDay(generateDay(i + 1)));
  }
  return daysSectionsWrap;
};

const displayCalendarSectionTitle = () => {
  const textElem = document.querySelector(".calendar-title-container span");
  const currentYear = currentDate.toLocaleString("en-US", { year: "numeric" });
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });
  textElem.textContent = `${currentMonth} ${currentYear}`;
};

const displayDays = () => {
  const calendarBody = document.querySelector("tbody");
  calendarBody.appendChild(generateFirstSection());
  let lastI = 0;
  for (let i = 7 - firstDayOfMonth; i < numberOfDaysInMonth - 7; i += 7) {
    calendarBody.appendChild(generateSevenDaySection(i));
    lastI = i;
  }
  calendarBody.appendChild(generateLastSection(lastI + 7));
};

const resetCalendar = () => {
  const calendarBody = document.querySelector("tbody");
  while (calendarBody.hasChildNodes()) {
    calendarBody.removeChild(calendarBody.lastChild);
  }
};

const initializeCalendar = () => {
  displayDays();
  displayCalendarSectionTitle();
};

initializeCalendar();

const prevMonthBtn = document.querySelector("#prev-month-btn");
const nextMonthBtn = document.querySelector("#next-month-btn");

prevMonthBtn.addEventListener("click", () => {
  resetCalendar();
  currentDate.setMonth(currentMonth - 2);
  currentMonth = currentDate.getMonth() + 1;
  firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  numberOfDaysInMonth = new Date(
    currentDate.getFullYear(),
    currentMonth,
    0
  ).getDate();

  numberOfDaysInPreviousMonth = new Date(
    currentDate.getFullYear(),
    currentMonth - 1,
    0
  ).getDate();
  initializeCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  resetCalendar();
  currentDate.setMonth(currentMonth);
  console.log(currentMonth);
  currentMonth = currentDate.getMonth() + 1;
  firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  numberOfDaysInMonth = new Date(
    currentDate.getFullYear(),
    currentMonth,
    0
  ).getDate();

  numberOfDaysInPreviousMonth = new Date(
    currentDate.getFullYear(),
    currentMonth - 1,
    0
  ).getDate();
  initializeCalendar();
});
