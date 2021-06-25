# Google_Ads__MCC_Ad_Account_Cost_Alert

This short JavaScript Google Ads script checks on the Cost change % between Yesterday and the Day Before per ad account in your MCC and if it finds a value bigger or less than a certain threshold input number, sends you an email alert.

In order for it to function, you have to set it up on MCC level.

It is advised that you schedule the script to run daily at 1AM (in order for the dates to work properly).

🚸 This script is not maintained, so, in time, certain operations or even the entire script may not be functional.


Further notes:
1. The script does not inform about ad accounts that were launched for the first time YESTERDAY. Such ad accounts' data will be visible only when the ad account has been enabled at least for the past two days (and of course the email will be sent when the ad account meets the specified conditions).
