import { Login } from '../Pages/Login';
import { Home } from '../Pages/Home';
import { Faqs } from '../Pages/Faqs';
import { Recover } from '../Pages/Recover';
import { Register } from '../Pages/Register';

const routes = [
    {
        title: 'Faqs',
        path: '/Faqs',
        component: Faqs,
        exact: true
    },
    {
        title: 'Recover',
        path: '/Recover',
        component: Recover,
        exact: true
    },
    {
        title: 'Register',
        path: '/Register',
        component: Register,
        exact: true
    },
    {
        title: 'Login',
        path: '/Login',
        component: Login,
        exact: true
    },
    {
        title: 'Home',
        path: '/',
        component: Home,
        exact: true
    }
]

export default routes;