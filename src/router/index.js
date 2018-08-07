import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Ping from '@/components/Ping';
import Users from '@/components/Users';
import Order from '@/components/Order';
import UserList from '@/components/UserList'

Vue.use(Router);

export default new Router({

	mode: 'history',
  	routes: [
		{
			path: '/ping',
			name: 'Ping',
			component: Ping
		},
		{
	      path: '/order/:id',
	      name: 'Order',
	      component: Order,
	    },
		{
			path: '/user',
			name: 'Users',
			component: Users,
		},
		{
			path: '/',
			name: 'UserList',
			component: UserList,
		},
	],

});

// export default new Router({
// 	routes: [
// 		{
// 			path: '/ping',
// 			name: 'Ping',
// 			component: Ping
// 		},
// 	],
// });
