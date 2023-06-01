// src/pages/api/auth/[...nextauth].ts

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { UserInfo } from 'remult'

// NOTE: User info shape, defined by Remult

// export interface UserInfo {
// 	id: string
// 	name?: string
// 	roles?: string[]
// }

/*  // NOTES \\

NextAuth still takes to the route instead of intercepting and checking previous to routing like middleware does.

Can potentially use it inside the middleware?


!! Currently even though this is an API route, the Session shows the data on the client side. !!


*/

const validUsers: UserInfo[] = [
	{ id: '1', name: 'Jane', roles: ['admin'] },
	{ id: '2', name: 'Steve' },
]
export function findUserById(id: string | undefined) {
	return validUsers.find((user) => user.id === id)
}

export default NextAuth({
	providers: [
		Credentials({
			credentials: {
				name: {
					placeholder: 'Try Steve or Jane',
				},
			},
			authorize: (info) =>
				validUsers.find((user) => user.name === info?.name) || null,
		}),
	],
	callbacks: {
		session: ({ session, token }) => ({
			...session,
			user: findUserById(token?.sub),
		}),
	},
})
