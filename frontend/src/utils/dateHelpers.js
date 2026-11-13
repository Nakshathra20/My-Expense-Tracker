// Helper functions for dates and money.
// Dates are text like "2026-11-02" (year-month-day) in YOUR local time.

export function formatDate(d) {
    const year = d.getFullYear(); // 2026
    const month = String(d.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-11 (january is 0) .padStart(2, "0") -> "05"
    const day = String(d.getDate()).padStart(2, "0"); // 2 -> "02"
    return year + "-" + month + "-" + day; // "2026-05-02"
  }
  
  export function getToday() {
    return formatDate(new Date()); // today's date in the format "2026-05-02"
  }
  
  export function getYesterday() { 
    const d = new Date();
    d.setDate(d.getDate() - 1); // setDate(d.getDate() - 1) -> subtract 1 day from today's date
    return formatDate(d);
  }
  
  export function getMonthKey() { // this function is used to get the current month in the format "2026-05"
    return getToday().slice(0, 7); // slice(0, 7) -> get the first 7 characters of the date (year and month)
  }
  
  // How many days this month has (28, 30 or 31)
  export function getDaysInMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(); // getDate() -> get the number of days in the current month.
  }
  
  // "2026-11-02" -> "2 Nov 2026"
  export function prettyDate(dateText) { // this function is used to format the date in the format "2 Nov 2026"
    const [year, month, day] = dateText.split("-"); // split("-") -> split the date into year, month and day
    return new Date(year, month - 1, day).toLocaleDateString("en-IN", { // toLocaleDateString("en-IN", {) -> format the date in the format "2 Nov 2026"
      day: "numeric", // "numeric" -> show the day as a number
      month: "short", // "short" -> show the month as a short name
      year: "numeric",
    });
  }
  

  export function money(number) { // this function is used to format the number in the format "₹150.00"
    return "₹" + Number(number).toFixed(2);// Number(number).toFixed(2) -> format the number to 2 decimal places.
  }
  

  export function sumAmounts(list) { // this function is used to sum up the amounts of a list of expenses.
    let total = 0;
    for (const expense of list) { // which means for each expense in the list, add the amount to the total.
      total = total + expense.amount; // get the amout of expense and add it to the total.
    }
    return Math.round(total * 100) / 100; // Math.round(total * 100) / 100 -> round the total to 2 decimal places.
  }