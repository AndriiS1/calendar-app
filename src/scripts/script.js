const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const firstDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
).getDay();

const numberOfDaysInMonth = new Date(
  currentDate.getFullYear(),
  currentMonth,
  0
).getDate();

const numberOfDaysInPreviousMonth = new Date(
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

const makeInactiveDay = (day) => {
  day.classList.add("inactive");
  return day;
};

/**
 * Generates the first section of the calendar.
 * @returns {HTMLElement} The generated HTML element representing the first section of the calendar.
 */
const generateFirstSection = () => {
  const daysSectionsWrap = document.createElement("tr");
  daysSectionsWrap.classList.add("days-sections-wrap");
  for (
    let i = numberOfDaysInPreviousMonth - firstDayOfMonth;
    i < numberOfDaysInPreviousMonth;
    i++
  ) {
    daysSectionsWrap.appendChild(makeInactiveDay(generateDay(i + 1)));
  }
  for (let i = 0; i < 7 - firstDayOfMonth; i++) {
    daysSectionsWrap.appendChild(generateDay(i + 1));
  }
  return daysSectionsWrap;
};

const generateSevenDaySection = (start) => {
  const daysSectionsWrap = document.createElement("tr");
  daysSectionsWrap.classList.add("days-sections-wrap");
  for (let i = start; i < start + 7; i++) {
    daysSectionsWrap.appendChild(generateDay(i + 1));
  }
  return daysSectionsWrap;
};

const generateLastSection = (start) => {
  const daysSectionsWrap = document.createElement("tr");
  daysSectionsWrap.classList.add("days-sections-wrap");
  for (let i = start; i < numberOfDaysInMonth; i++) {
    daysSectionsWrap.appendChild(generateDay(i + 1));
  }
  for (let i = 0; i < 7 - (numberOfDaysInMonth - start); i++) {
    daysSectionsWrap.appendChild(makeInactiveDay(generateDay(i + 1)));
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

const initializeCalendar = () => {
  displayDays();
  displayCalendarSectionTitle();
};

document.addEventListener("DOMContentLoaded", initializeCalendar);
