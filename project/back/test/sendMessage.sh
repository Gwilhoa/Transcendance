curl http://localhost:6200/channel/message -X POST -d "channel_id=$1&content=$2" -H "Authorization: Bearer $ACCESS_TOKEN"
