import { Home } from '../Pages/Home';
import { Faqs } from '../Pages/Faqs';
import { Changes } from '../Pages/Changes';
import { Profile } from '../Pages/Profile';

const loggedRoutes = [
    {
        title: 'Faqs',
        path: '/Faqs',
        component: Faqs,
        exact: true
    },
    {
        title: 'Profile',
        path: '/Profile',
        component: Profile,
        exact: true
    },
    {
        title: 'Changes',
        path: '/Changes',
        component: Changes,
        exact: true
    },
    {
        title: 'Home',
        path: '/',
        component: Home,
        exact: true
    }
]

export default loggedRoutes;