curl -X POST -H "authorization: bearer $ACCESS_TOKEN" -d "name=$1&type=$2&password=$3" http://localhost:6200/channel/create
