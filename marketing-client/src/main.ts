import './style.css';
import { LoginPage } from './pages/LoginPage';
import { MainPage } from './pages/MainPage';
import { Router } from './router';

const app = document.querySelector<HTMLDivElement>('#app')!;
const router = new Router(app);

router.addRoute('/', () => {
  return LoginPage(() => {
    router.navigate('/dashboard');
  });
});

router.addRoute('/dashboard', () => {
  return MainPage();
});

router.init();

