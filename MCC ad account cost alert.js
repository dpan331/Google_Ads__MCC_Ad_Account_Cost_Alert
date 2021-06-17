//created by Dimitrios Panourgias, June 2021

//Please provide the following user input:
costThreshold = 20;
email = "your.email@here.com";

function main() {
  Logger.log("MCC ad account cost alert");
  Logger.log("=========================");
  adAccountCostChecker(costThreshold, email);
}

function adAccountCostChecker(costThreshold, email) {
  var accountSelector = AdsManagerApp.accounts().withCondition("Impressions > 0")
     .forDateRange("LAST_7_DAYS")
  var accountIterator = accountSelector.get();
  
  var accountList = [];
  var yesterdaySpend = [];
  var dayBeforeYesterdaySpend = [];
  var now = new Date();
  var MILLIS_PER_DAY = 1000 * 60 * 60 * 24 * 2;
  var dayBeforeRAW = new Date(now.getTime() - MILLIS_PER_DAY);
  var dayBefore = Utilities.formatDate(dayBeforeRAW, 'Etc/GMT', 'YYYYMMdd');
  
  while (accountIterator.hasNext()) {
    var account = accountIterator.next();
    AdsManagerApp.select(account);
    
    var reportYesterday = AdsApp.report(
        'SELECT AccountDescriptiveName, Cost ' +
        'FROM   ACCOUNT_PERFORMANCE_REPORT ' +
        'WHERE  Impressions > 0 ' +
        'DURING YESTERDAY');
    var rowsYesterday = reportYesterday.rows();
    while (rowsYesterday.hasNext()) {
      var rowYesterday = rowsYesterday.next();
      var accountName = rowYesterday["AccountDescriptiveName"];
      accountList.push(accountName);
      var accountCost = rowYesterday["Cost"];
      yesterdaySpend.push(accountCost);
    }
    
    var reportDayBeforeYesterday = AdsApp.report(
        'SELECT AccountDescriptiveName, Cost ' +
        'FROM   ACCOUNT_PERFORMANCE_REPORT ' +
        'WHERE  Impressions > 0 ' +
        'DURING ' + dayBefore + ', ' + dayBefore);
    var rowsDayBeforeYesterday = reportDayBeforeYesterday.rows();
    while (rowsDayBeforeYesterday.hasNext()) {
      var rowDayBeforeYesterday = rowsDayBeforeYesterday.next();
      var accountName = rowDayBeforeYesterday["AccountDescriptiveName"];
      var accountCost = rowDayBeforeYesterday["Cost"];
      dayBeforeYesterdaySpend.push(accountCost);
    }
  }
  
  var diff = [];
  var diffPerc = [];
  var i = 0;
  var j = 0;
  var acc;
  var accEmail = [];
  var diffEmail = [];
  var diffPercEmail = [];
  var yestEmail = [];
  var dayBefEmail = [];
  
  for (acc in accountList) {
    var diffTemp = (yesterdaySpend[i] - dayBeforeYesterdaySpend[i]).toFixed(2);
    diff.push(diffTemp);
    var diffPercTemp = (((yesterdaySpend[i] / dayBeforeYesterdaySpend[i]) - 1) * 100).toFixed();
    diffPerc.push(diffPercTemp);
    
    Logger.log(accountList[i] + " difference was equal to " + diff[i] + " and " + diffPerc[i] +
               "% from " + dayBeforeYesterdaySpend[i] + " to " + yesterdaySpend[i]);
    
    if (diffPerc[i] > costThreshold || diffPerc[i] < -costThreshold) {
      j = j + 1;
      accEmail.push(accountList[i]);
      diffEmail.push(diff[i]);
      diffPercEmail.push(diffPerc[i]);
      yestEmail.push(yesterdaySpend[i]);
      dayBefEmail.push(dayBeforeYesterdaySpend[i]);  
    }
    
    i = i + 1;
  }
  
  var now = new Date();
  var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
  var yestRAW = new Date(now.getTime() - MILLIS_PER_DAY);
  var dayBefRAW = new Date(now.getTime() - MILLIS_PER_DAY * 2);
  var yest = Utilities.formatDate(yestRAW, 'Etc/GMT', 'dd-MM-yyyy');
  var dayBef = Utilities.formatDate(dayBefRAW, 'Etc/GMT', 'dd-MM-yyyy');
  var cells = [];
  var table = "<html><body><br><table border=1><tr><th>Ad accounts</th><th>Difference</th><th>Difference %</th><th>Cost " + dayBef + 
              "</th><th>Cost " + yest +"</tr></br>";
  for (var u = 0; u < accEmail.length; u++){
          table = table + "<tr></tr>" + "<td>"+ accEmail[u] +"</td>" + 
                          "<td>"+ diffEmail[u] + " €" + "</td>" + 
                          "<td>"+ diffPercEmail[u] + "%" +"</td>" + 
                          "<td>"+ dayBefEmail[u] + " €" + "</td>"+ 
                          "<td>"+ yestEmail[u] + " €" + "</td>";
  }
  table=table+"</table></body></html>";


  if (j !== 0) {
    MailApp.sendEmail({
    to: email, 
    subject: "GAds Cost alert",
    htmlBody: table});
  }

}
