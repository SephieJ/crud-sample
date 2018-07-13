import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Ping from '@/components/Ping';
import Books from '@/components/Books';

Vue.use(Router);

export default new Router({

	modes: 'history',
  	routes: [
		{
			path: '/ping',
			name: 'Ping',
			component: Ping
		},
		{
			path: '/',
			name: 'Ping',
			component: Books,
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
