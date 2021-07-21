# Google_Ads__MCC_Ad_Account_Cost_Alert

This short JavaScript Google Ads script checks on the Cost change % between Yesterday and the Day Before per ad account in your MCC and if it finds a value bigger or less than a certain threshold input number, sends you an email alert.

In order for it to function, you have to set it up on MCC level. 
Beware that it iterates ad accounts with a specific label (hereby LabelNames CONTAINS 'Script_Generated').

It is advised that you schedule the script to run daily at 1AM (in order for the dates to work properly).

🚸 This script is not maintained, so, in time, certain operations or even the entire script may not be functional.
Also this script has been developed to serve certain use cases. If you want to adapt it to your case, you may have to slightly modify certain pieces of the code (like the SELECTORS).
