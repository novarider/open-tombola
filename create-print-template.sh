# Script to fetch all available code from server to hand them over to a printing provider.
# Do not forget to conver the csv file to an xlsx file to make the pictures work

baseUrl=localhost:3333
authCode="YVNpY2hlcnNQYSQkdzByZA=="
endDir=qr-print-template

mkdir qr-print-template
curl -s -H "Authorization: $authCode" $baseUrl/tickets/offline/codes/csv > $endDir/data.csv
for code in `curl -s -H "Authorization: $authCode" $baseUrl/tickets/offline/codes | jq -r '.[]'`
do  curl -s -X POST -H "Authorization: $authCode" --output $endDir/$code.png $baseUrl/tickets/offline/qr/$code
done
