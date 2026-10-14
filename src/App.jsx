import { useState } from 'react'
import {
  loginApi,
  sendVerifyMessageApi,
  verifyMessageApi,
  registerApi,
  forgotPasswordApi,
} from './Api/authApi'
import './App.css'

const initialForm = {
  name: '',
  phoneOrGmail: '',
  phoneNumber: '',
  gmail: '',
  password: '',
  confirmPassword: '',
  code: '',
  rememberMe: false,
}

const pageTitles = {
  login: 'ورود به حساب کاربری',
  register: 'ایجاد حساب کاربری',
  verify: 'تأیید کد ثبت‌نام',
  forgot: 'بازیابی رمز عبور',
}

const submitLabels = {
  login: 'ورود به حساب کاربری',
  register: 'ارسال کد تأیید',
  verify: 'تأیید کد و تکمیل ثبت‌نام',
  forgot: 'ارسال درخواست بازیابی',
}

function getApiMessage(data) {
  if (Array.isArray(data?.errors)) {
    const errors = data.errors
      .map((item) => item.msg || item.message)
      .filter(Boolean)

    if (errors.length) return errors.join('، ')
  }

  return (
    data?.message ||
    data?.title ||
    'درخواست انجام نشد. لطفاً دوباره تلاش کن.'
  )
}

function App() {
  const [page, setPage] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (event) => {
    const { name, value, type, checked } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const changePage = (nextPage) => {
    setPage(nextPage)
    setError('')
    setMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (loading) return

    const phoneNumber = form.phoneNumber.trim()
    const gmail = form.gmail.trim()
    const contact = form.phoneOrGmail.trim()

    if (page === 'login') {
      if (!contact || !form.password) {
        setError('لطفاً ایمیل یا شماره موبایل و رمز عبور را وارد کن.')
        return
      }
    }

    if (page === 'register') {
      if (
        !form.name.trim() ||
        !phoneNumber ||
        !gmail ||
        !form.password ||
        !form.confirmPassword
      ) {
        setError('لطفاً تمام فیلدهای ثبت‌نام را تکمیل کن.')
        return
      }

      if (!/^\d{10,15}$/.test(phoneNumber)) {
        setError('شماره موبایل را با ارقام انگلیسی و بدون فاصله وارد کن.')
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gmail)) {
        setError('لطفاً یک ایمیل معتبر وارد کن.')
        return
      }

      if (form.password.length < 8) {
        setError('رمز عبور باید حداقل ۸ کاراکتر باشد.')
        return
      }

      if (form.password !== form.confirmPassword) {
        setError('تکرار رمز عبور با رمز عبور یکسان نیست.')
        return
      }
    }

    if (page === 'verify') {
      if (!phoneNumber || !gmail || !form.code.trim()) {
        setError('شماره موبایل، ایمیل و کد تأیید باید وارد شده باشند.')
        return
      }
    }

    if (page === 'forgot' && !contact) {
      setError('ایمیل یا شماره موبایل را وارد کن.')
      return
    }

    setLoading(true)

    try {
      let response

      if (page === 'login') {
        response = await loginApi({
          phoneOrGmail: contact,
          password: form.password,
          rememberMe: form.rememberMe,
        })
      } else if (page === 'register') {
        // مرحله اول: ارسال کد به ایمیل
        response = await sendVerifyMessageApi({
          gmail,
        })

        if (response?.data?.success === false) {
          throw new Error(getApiMessage(response.data))
        }

        setPage('verify')
        setMessage(
          response?.data?.message ||
            'درخواست ارسال کد ثبت شد. کد تأیید را وارد کن.'
        )
        return
      } else if (page === 'verify') {
        // مرحله دوم: تأیید کد
        response = await verifyMessageApi({
          phoneNumber,
          verifyCode: form.code.trim(),
        })

        if (response?.data?.success === false) {
          throw new Error(getApiMessage(response.data))
        }

        // مرحله سوم: ثبت‌نام پس از تأیید کد
        response = await registerApi({
          password: form.password,
          gmail,
          phoneNumber,
        })

        if (response?.data?.success === false) {
          throw new Error(getApiMessage(response.data))
        }

        setMessage(
          response?.data?.message ||
            'ثبت‌نام با موفقیت انجام شد. اکنون می‌توانی وارد شوی.'
        )

        setForm((previous) => ({
          ...previous,
          password: '',
          confirmPassword: '',
          code: '',
        }))

        setPage('login')
        return
      } else if (page === 'forgot') {
        response = await forgotPasswordApi({
          phoneOrGmail: contact,
        })
      }

      if (response?.data?.success === false) {
        throw new Error(getApiMessage(response.data))
      }

      setMessage(
        response?.data?.message || 'درخواست با موفقیت انجام شد.'
      )
    } catch (err) {
      console.error('Authentication error:', err)

      setError(
        err.response?.data
          ? getApiMessage(err.response.data)
          : err.message ||
              'خطایی رخ داد. اتصال اینترنت و سرور را بررسی کن.'
      )
    } finally {
      setLoading(false)
    }
  }

  const renderFields = () => {
    if (page === 'login') {
      return (
        <>
          <label className="field-label" htmlFor="phoneOrGmail">
            ایمیل یا شماره موبایل
          </label>
          <input
            id="phoneOrGmail"
            name="phoneOrGmail"
            value={form.phoneOrGmail}
            onChange={updateField}
            placeholder="ایمیل یا شماره موبایل"
            autoComplete="username"
            required
          />

          <label className="field-label" htmlFor="password">
            رمز عبور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            placeholder="رمز عبور"
            autoComplete="current-password"
            required
          />

          <div className="form-options">
            <label className="remember-option">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={updateField}
              />
              مرا به خاطر بسپار
            </label>

            <button
              type="button"
              className="text-button"
              onClick={() => changePage('forgot')}
            >
              فراموشی رمز عبور
            </button>
          </div>
        </>
      )
    }

    if (page === 'register') {
      return (
        <>
          <label className="field-label" htmlFor="name">
            نام و نام خانوادگی
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="نام و نام خانوادگی"
            autoComplete="name"
            required
          />

          <label className="field-label" htmlFor="phoneNumber">
            شماره موبایل
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={form.phoneNumber}
            onChange={updateField}
            placeholder="مثلاً 09123456789"
            autoComplete="tel"
            required
          />

          <label className="field-label" htmlFor="gmail">
            ایمیل
          </label>
          <input
            id="gmail"
            name="gmail"
            type="email"
            value={form.gmail}
            onChange={updateField}
            placeholder="ایمیل"
            autoComplete="email"
            required
          />

          <label className="field-label" htmlFor="password">
            رمز عبور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            placeholder="حداقل ۸ کاراکتر"
            autoComplete="new-password"
            required
          />

          <label className="field-label" htmlFor="confirmPassword">
            تکرار رمز عبور
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={updateField}
            placeholder="تکرار رمز عبور"
            autoComplete="new-password"
            required
          />
        </>
      )
    }

    if (page === 'verify') {
      return (
        <>
          <p className="form-description">
            کد ارسال‌شده به ایمیل را وارد کن. شماره موبایلی که در
            ثبت‌نام نوشتی نیز برای تأیید ارسال می‌شود.
          </p>

          <label className="field-label" htmlFor="code">
            کد تأیید
          </label>
          <input
            id="code"
            name="code"
            value={form.code}
            onChange={updateField}
            placeholder="کد تأیید"
            autoComplete="one-time-code"
            required
          />
        </>
      )
    }

    if (page === 'forgot') {
      return (
        <>
          <p className="form-description">
            ایمیل یا شماره موبایلی که با آن ثبت‌نام کرده‌ای وارد کن.
          </p>

          <label className="field-label" htmlFor="phoneOrGmail">
            ایمیل یا شماره موبایل
          </label>
          <input
            id="phoneOrGmail"
            name="phoneOrGmail"
            value={form.phoneOrGmail}
            onChange={updateField}
            placeholder="ایمیل یا شماره موبایل"
            required
          />
        </>
      )
    }

    return null
  }

  return (
    <div className="app-shell" dir="rtl">
      <header className="site-header">
        <a className="brand" href="/" aria-label="صفحه اصلی">
          <span className="brand-mark">ل</span>
          <span>لوگو</span>
        </a>

        <button
          className="header-account"
          onClick={() => changePage('login')}
          type="button"
        >
          <span aria-hidden="true">♙</span>
          ورود به حساب کاربری
        </button>
      </header>

      <main className="main-area">
        <section className="auth-scene">
          <div className="gradient-panel">
            <div className="auth-card">
              <h1>{pageTitles[page]}</h1>

              <form onSubmit={handleSubmit}>
                {renderFields()}

                {message && (
                  <p className="status-message" role="status">
                    {message}
                  </p>
                )}

                {error && (
                  <p className="error-message" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="submit-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'لطفاً صبر کن...' : submitLabels[page]}
                </button>
              </form>

              <div className="card-bottom">
                {page === 'login' && (
                  <p>
                    حساب کاربری نداری؟
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => changePage('register')}
                    >
                      ثبت‌نام
                    </button>
                  </p>
                )}

                {(page === 'register' || page === 'verify') && (
                  <p>
                    قبلاً ثبت‌نام کرده‌ای؟
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => changePage('login')}
                    >
                      ورود
                    </button>
                  </p>
                )}

                {page === 'forgot' && (
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => changePage('login')}
                  >
                    بازگشت به ورود
                  </button>
                )}
              </div>
            </div>

            <nav className="side-navigation" aria-label="صفحات حساب">
              <button
                type="button"
                className={page === 'register' ? 'active' : ''}
                onClick={() => changePage('register')}
              >
                ثبت‌نام
              </button>

              <button
                type="button"
                className={page === 'login' ? 'active' : ''}
                onClick={() => changePage('login')}
              >
                ورود
              </button>
            </nav>

            <span className="decorative-dot" aria-hidden="true">
              ✦
            </span>

            <span className="panel-caption">
              به خانواده ما خوش آمدی
            </span>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App