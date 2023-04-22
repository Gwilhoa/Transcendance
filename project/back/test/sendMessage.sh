curl http://localhost:3000/channel/message -X POST -d "channel_id=$2&content=$3" -H "Authorization: Bearer $1"
