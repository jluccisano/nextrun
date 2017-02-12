angular.module('mockModule').value('mockUser', {
	id: '1',
	email: 'foo@bar.com',
	username: 'foo',
	role: {
		bitMask: 1,
		title: 'public'
	}
});