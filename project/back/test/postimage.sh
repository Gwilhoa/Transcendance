curl -X POST -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: multipart/form-data" -F "image=@$1" http://localhost:6200/image