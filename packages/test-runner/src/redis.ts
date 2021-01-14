import { generateUid } from '../../crusher-shared/utils/helper';
import { REDDIS } from '../config/database';
import IORedis from 'ioredis';
let offset = 9999999999;

const client = new IORedis({ port: REDDIS.port, host: REDDIS.host, password: REDDIS.password });

const uid = generateUid();
const getOffset = () => {
	return offset;
};

client.incr("instance_index").then(instanceIndex => {
	setInterval(async () => {
		await client.set(`instance:${instanceIndex}`, instanceIndex, 'ex', 60)
		await client.keys("instance:*").then((keys)=>{
			const indexKeys = keys.map((key)=> {return key.split(":")[1]}).map((key)=>(parseInt(key)));
			const sortedIndexKeys = indexKeys.sort().findIndex(key => (key === instanceIndex));
			offset = 5 * (sortedIndexKeys);
		})
	}, 2000);
});

export {getOffset}
