var dates = {
  compare: function (a, b) {
    function compDates(a, b) {
      return a.getDate() - b.getDate();
    }
    function compMonths(a, b) {
      return a.getMonth() - b.getMonth();
    }
    function compYr(a, b) {
      return a.getFullYear() - b.getFullYear();
    }
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    // NOTE: The code inside isFinite does an assignment (=).
    if (compYr(a, b) > 0) {
      return 1;
    } else if (compYr(a, b) < 0) {
      return -1;
    } else {
      if (compMonths(a, b) > 0) {
        return 1;
      } else if (compMonths(a, b) < 0) {
        return -1;
      } else {
        if (compDates(a, b) > 0) {
          return 1;
        } else if (compDates(a, b) < 0) {
          return -1;
        } else {
          return 0;
        }
      }
    }
  },
};

export default dates;