curl http://localhost:3000/channel/message -X GET -d "channel_id=$1" -H "authorization: bearer $ACCESS_TOKEN"
