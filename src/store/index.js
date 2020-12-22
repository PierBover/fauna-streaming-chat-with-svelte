import {writable} from 'svelte/store';
import {chatRoomStream, getLatestMessages} from '../fauna/index.js';

const names = ['Cat', 'Lion', 'Dog', 'Lemur', 'Squirrel', 'Walrus', 'Octopus', 'Shark', 'Elephant'];
const colors = ['blue', 'orange', 'green', 'blueviolet', 'coral'];

export const messages = writable([]);
export const authorName = names[Math.floor(Math.random() * names.length)];
export const authorColor = colors[Math.floor(Math.random() * colors.length)];

const nowMicroseconds = Date.now() * 1000;
const fiveMinutesMicroseconds = 1000000 * 60 * 5;
let lastUpdateTs = nowMicroseconds - fiveMinutesMicroseconds;

async function updateMessages () {
	const faunaResults = await getLatestMessages(lastUpdateTs);
	
	const latestMessages = faunaResults.map(item => ({
		id: item[0].value.id,
		authorName: item[1],
		authorColor: item[2],
		message: item[3],
		ts: item[4]
	}));
	
	if (latestMessages.length) {
		messages.update(array => [...array, ...latestMessages]);
		lastUpdateTs = latestMessages[latestMessages.length - 1].ts;
	}
}

chatRoomStream.onUpdate.add(updateMessages);