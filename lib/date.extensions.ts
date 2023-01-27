export {}

declare global {
  interface Date {
    addDays(days: number): Date;
    getDayRepr(): string;
    getTimeRepr(): string;
    addHours(hours: number): Date;
  }
}

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.getDayRepr = function () {
  let repr = `${this.toISOString().split("T")[0]}`;
  return repr;
};

Date.prototype.getTimeRepr = function () {
  function format(number: number) {
    if (number < 10) return `0${number}`;
    else return `${number}`;
  }

  let hour = this.getHours();
  let minutes = this.getMinutes();

  return `${format(hour)}:${format(minutes)}`;
};

Date.prototype.addHours = function(hours: number) {
  this.setTime(this.getTime() + (hours*60*60*1000));
  return this;
}
