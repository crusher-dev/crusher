aws --endpoint-url=http://192.168.99.104:4566 s3 mb s3://crusher-videos
aws --endpoint-url=http://192.168.99.104:4566 s3api put-bucket-acl --bucket crusher-videos --acl public-read

