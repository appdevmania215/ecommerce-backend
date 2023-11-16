"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundUpNumber = exports.getMonthStartDates = exports.getFormattedDate = exports.isBeforeToday = exports.getLastweek = exports.getDateRange = exports.checkIfDateIsExpired = exports.reCreateDate = exports.getTimeDiff = void 0;
const getTimeDiff = (date) => {
    const now = new Date();
    const oldDate = new Date(date);
    // @ts-ignore
    return Math.floor(Math.abs(now - oldDate) / 36e5);
};
exports.getTimeDiff = getTimeDiff;
const reCreateDate = (date) => {
    return new Date(date).toLocaleString('default', { month: 'short', year: 'numeric', day: '2-digit' });
};
exports.reCreateDate = reCreateDate;
const checkIfDateIsExpired = (date) => {
    const now = new Date();
    const endDate = new Date(date);
    return endDate > now;
    // return Math.floor(Math.abs(    now - oldDate )   / 36e5)
};
exports.checkIfDateIsExpired = checkIfDateIsExpired;
const getDateRange = (type) => {
    let futureDays;
    let additionalDays;
    if (type === 'Express') {
        futureDays = 1;
        additionalDays = 5;
    }
    else {
        futureDays = 8;
        additionalDays = 16;
    }
    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() + futureDays);
    end.setDate(end.getDate() + additionalDays);
    const startDateString = start.getDate();
    const endDateString = end.getDate();
    const startMonthString = start.toLocaleString('default', { month: 'long' });
    const yearString = start.getFullYear();
    return `${startDateString} - ${endDateString} ${startMonthString}, ${yearString}`;
};
exports.getDateRange = getDateRange;
const getLastweek = (number) => {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - number);
    let lastWeekMonth = lastWeek.getMonth() + 1;
    let lastWeekDay = lastWeek.getDate();
    let lastWeekYear = lastWeek.getFullYear();
    let lastWeekDisplay = lastWeekMonth + "/" + lastWeekDay + "/" + lastWeekYear;
    return new Date(lastWeekDisplay);
};
exports.getLastweek = getLastweek;
const isBeforeToday = (date) => {
    return new Date(date.toDateString()) < new Date(new Date().toDateString());
};
exports.isBeforeToday = isBeforeToday;
const getFormattedDate = () => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = dateFormatter.format(today);
    return formattedDate;
};
exports.getFormattedDate = getFormattedDate;
const getMonthStartDates = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const startDates = [];
    for (let month = 0; month <= currentDate.getMonth(); month++) {
        const startDate = new Date(currentYear, month, 1);
        startDates.push(startDate);
    }
    // Add start of next month if not in December
    if (currentDate.getMonth() !== 11) {
        const nextMonthStartDate = new Date(currentYear, currentDate.getMonth() + 1, 1);
        startDates.push(nextMonthStartDate);
    }
    return startDates;
};
exports.getMonthStartDates = getMonthStartDates;
const roundUpNumber = (num) => {
    const roundedNum = Math.ceil(num / 1000) * 1000;
    return roundedNum;
};
exports.roundUpNumber = roundUpNumber;
