
import { useState } from 'react'
import './App.css'

import {
  loginApi,
  registerApi,
  forgotPasswordApi,
} from './Api/authApi'

function App() {
  const [page, setPage] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function changePage(nextPage) {
    setPage(nextPage)
    setMessage('')
    setError('')
  }

  
async function handleSubmit(event) {
  event.preventDefault()
  setError('')
  setMessage('')

  const cleanEmail = email.trim()

  if (page === 'register' && !name.trim()) {
    setError('لطفاً نام خود را وارد کنید.')
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    setError('لطفاً یک ایمیل معتبر وارد کنید.')
    return
  }

  if (page !== 'forgot' && password.length < 8) {
    setError('رمز عبور باید حداقل ۸ کاراکتر باشد.')
    return
  }

  if (page === 'register' && password !== confirmPassword) {
    setError('رمز عبور و تکرار آن یکسان نیستند.')
    return
  }

  setLoading(true)

  try {
    let response

    if (page === 'login') {
      response = await loginApi({
        email: cleanEmail,
        password,
      })
    } else if (page === 'register') {
      response = await registerApi({
        name: name.trim(),
        email: cleanEmail,
        password,
      })
    } else {
      response = await forgotPasswordApi({
        email: cleanEmail,
      })
    }

    setMessage(
      response.data?.message ||
        (page === 'login'
          ? 'درخواست ورود با موفقیت انجام شد.'
          : page === 'register'
            ? 'درخواست ثبت‌نام با موفقیت انجام شد.'
            : 'درخواست بازیابی رمز با موفقیت ارسال شد.')
    )
  } catch (err) {
    if (!err.response) {
      setError('اتصال به سرور برقرار نشد؛ بک‌اند هنوز آماده نیست یا آدرس آن اشتباه است.')
    } else {
      setError(
        err.response.data?.message ||
          'درخواست ناموفق بود. لطفاً دوباره تلاش کنید.'
      )
    }
  } finally {
    setLoading(false)
  }
}

  const titles = {
    login: 'ورود به حساب کاربری',
    register: 'ایجاد حساب کاربری',
    forgot: 'بازیابی رمز عبور',
  }

  const descriptions = {
    login: 'برای ورود، ایمیل و رمز عبور خود را وارد کنید.',
    register: 'اطلاعات خود را برای ایجاد حساب وارد کنید.',
    forgot: 'ایمیل خود را وارد کنید تا مراحل بازیابی را دنبال کنید.',
  }

  return (
    <main className="site-page" dir="rtl">
      <header className="site-header">
        <button
          className="header-account"
          type="button"
          onClick={() => changePage('login')}
        >
          <span className="user-symbol">♙</span>
          ورود به حساب کاربری
        </button>

        <button
          className="brand"
          type="button"
          onClick={() => changePage('login')}
          aria-label="لوگو، صفحه ورود"
        >
          <span className="brand-symbol">ل</span>
          <span>لوگو</span>
        </button>
      </header>

      <nav className="side-nav" aria-label="منوی حساب کاربری">
        <button
          className={page === 'register' ? 'active' : ''}
          type="button"
          onClick={() => changePage('register')}
        >
          ثبت نام
        </button>
        <button
          className={page === 'login' ? 'active' : ''}
          type="button"
          onClick={() => changePage('login')}
        >
          ورود
        </button>
      </nav>

      <section className="auth-stage">
        <div className="color-panel">
          <div className="decor-circle decor-one" />
          <div className="decor-circle decor-two" />

          <section className="auth-card">
            <div className="mobile-brand">
              <span className="brand-symbol">س</span>
              <span>سوگو</span>
            </div>

            <h1>{titles[page]}</h1>
            <p className="auth-description">{descriptions[page]}</p>

            <form onSubmit={handleSubmit} noValidate>
              {page === 'register' && (
                <label>
                  نام و نام خانوادگی
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="نام خود را وارد کنید"
                    autoComplete="name"
                  />
                </label>
              )}

              <label>
                ایمیل
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ایمیل خود را وارد کنید"
                  autoComplete="email"
                  dir="ltr"
                />
              </label>

              {page !== 'forgot' && (
                <label>
                  رمز عبور
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="حداقل ۸ کاراکتر"
                    autoComplete={
                      page === 'login'
                        ? 'current-password'
                        : 'new-password'
                    }
                  />
                </label>
              )}

              {page === 'register' && (
                <label>
                  تکرار رمز عبور
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="رمز عبور را دوباره وارد کنید"
                    autoComplete="new-password"
                  />
                </label>
              )}

              {page === 'login' && (
                <button
                  className="forgot-link"
                  type="button"
                  onClick={() => changePage('forgot')}
                >
                  رمز عبور را فراموش کرده‌اید؟
                </button>
              )}

              {error && (
                <p className="feedback error" role="alert">
                  {error}
                </p>
              )}

              {message && (
                <p className="feedback success" role="status">
                  {message}
                </p>
              )}

              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'لطفاً صبر کنید...'
                  : page === 'login'
                    ? 'ورود به حساب کاربری'
                    : page === 'register'
                      ? 'ایجاد حساب کاربری'
                      : 'ارسال درخواست بازیابی'}
              </button>
            </form>

            <div className="switch-page">
              {page === 'login' ? (
                <>
                  حساب کاربری ندارید؟{' '}
                  <button
                    type="button"
                    onClick={() => changePage('register')}
                  >
                    ثبت نام کنید
                  </button>
                </>
              ) : page === 'register' ? (
                <>
                  قبلاً ثبت نام کرده‌اید؟{' '}
                  <button
                    type="button"
                    onClick={() => changePage('login')}
                  >
                    وارد شوید
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => changePage('login')}
                >
                  بازگشت به صفحه ورود
                </button>
              )}
            </div>
          </section>
        </div>
      </section>

      <footer>
   
    
      </footer>
    </main>
  )
}

export default App
