const Cookie = process.client ? require('js-cookie') : undefined;

export default function ({ redirect }) {
  if (!Cookie.get('user_id')) {
    return redirect('/login');
  }
}
