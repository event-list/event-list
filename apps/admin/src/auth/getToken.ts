import { getCookie } from 'cookies-next';

export default function getToken({ req, res }) {
  return getCookie('merchantToken', { req, res });
}
