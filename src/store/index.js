import {writable} from 'svelte/store';
import {chatRoomStream, getLatestMessages} from '../fauna/index.js';

const names = ['Cat', 'Lion', 'Dog', 'Lemur', 'Squirrel', 'Walrus', 'Octopus', 'Shark', 'Elephant'];
const colors = ['blue', 'orange', 'green', 'blueviolet', 'coral'];

export const messages = writable([]);
export const authorName = names[Math.floor(Math.random() * names.length)];
export const authorColor = colors[Math.floor(Math.random() * colors.length)];

let lastUpdateTs;

async function updateMessages () {
	const faunaResults = await getLatestMessages(lastUpdateTs);
	
	const latestMessages = faunaResults.map(item => ({
		ts: item[0],
		authorName: item[1],
		authorColor: item[2],
		message: item[3],
		id: item[4].value.id,
	}));
	
	if (latestMessages.length) {
		messages.update(array => [...array, ...latestMessages]);
		lastUpdateTs = latestMessages[latestMessages.length - 1].ts + 1;
	}
}

chatRoomStream.onUpdate.add(updateMessages);