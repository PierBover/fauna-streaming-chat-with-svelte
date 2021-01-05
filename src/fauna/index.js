import faunadb from 'faunadb';
import FaunaStream from "./FaunaStream.js";

// We do this so that our FQL code is cleaner
const {Paginate, Match, Filter, Lambda, Index, GT, Var, Create, Collection, Ref, Now, Do, Update} = faunadb.query;

const client = new faunadb.Client({
	secret: FAUNA_SECRET
});

const chatRoomRef = Ref(Collection('ChatRooms'), '1');

export const chatRoomStream = new FaunaStream(client, chatRoomRef);

export async function getLatestMessages (afterTs) {
	const result = await client.query(
		Paginate(
			Filter(
				Match(
					Index('ChatMessages_by_chatRoomRef'),
					chatRoomRef
				),
				Lambda(
					['ref', 'authorName', 'authorColor', 'message', 'ts'],
					GT(
						Var('ts'),
						afterTs
					)
				)
			)
		)
	)
	
	return result.data;
}

export async function createMessage (authorName, authorColor, message) {
	const result = await client.query(
		Do(
			Update(
				chatRoomRef,
				{}
			),
			Create(
				Collection('ChatMessages'),
				{
					data: {
						authorName,
						authorColor,
						message,
						chatRoomRef
					}
				}
			)
		)
	)
	
	return result;
}