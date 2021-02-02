const AWS_CONFIG = {
	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID : 'AKIAIEQN54PTYHMYGXVA',
	AWS_S3_REGION: process.env.AWS_S3_REGION ? process.env.AWS_S3_REGION : 'us-east-1',
	AWS_S3_VIDEO_BUCKET: process.env.AWS_S3_VIDEO_BUCKET ? process.env.AWS_S3_VIDEO_BUCKET : 'crusher-videos',
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : 'p77qG8tt8Pkm4a8eFUtOx5I5IzDzQCsoReX1pJOe',
};

module.exports = {
	AWS_CONFIG
};
