import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'
import { SharedData } from '@/types'
import AppLogoWelc from './app-logo-welcome'

interface NavItem {
  title: string
  href: string
}

// ✅ Manual route helpers (no Ziggy needed)
const routes = {
  dashboard: '/dashboard',
  adminDashboard: '/adminDash',
  login: '/login',
  register: '/register',
}

const AppTop: React.FC<{ canRegister?: boolean }> = ({ canRegister = true }) => {
  const { t, i18n } = useTranslation()
  const { auth } = usePage<SharedData>().props
  const isRTL: boolean = i18n.language === 'ar'

  const navItems: NavItem[] = [
    { title: t('Menu.nav.home'), href: '/' },
    { title: t('Menu.nav.services'), href: '/services' },
    { title: t('Menu.nav.about'), href: '/about' },
    { title: t('Menu.footer.contact'), href: '/contact' },
  ]

  return (
    <header
      dir={isRTL ? 'rtl' : 'ltr'}
      className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-5xl backdrop-blur-xs"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <AppLogoWelc />
          </Link>

          {/* Main navigation */}
          <nav className="flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-black p-4 py-2 hover:border hover:rounded-2xl hover:border-gray-300 hover:bg-gray-200 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Auth actions */}
          <nav className="flex items-center justify-end gap-4">
            {auth.user ? (
              <Link
                href={
                  auth.user.role === 'admin'
                    ? routes.adminDashboard
                    : routes.dashboard
                }
                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
              >
                {t('Dashboard')}
              </Link>
            ) : (
              <>
                <Link
                  href={routes.login}
                  className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                >
                  {t('Login')}
                </Link>

                {canRegister && (
                  <Link
                    href={routes.register}
                    className="hover:scale-[1.09] hover:border-indigo-400 hover:shadow-xl hover:bg-gradient-to-tl hover:from-black hover:via-indigo-950 hover:to-indigo-600 hover:shadow-black/40 hover:text-white transition-all duration-500 bg-gradient-to-tr shadow-lg shadow-white text-[15px] cursor-pointer rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200"
                  >
                    {t('Register')}
                  </Link>
                )}
              </>
            )}
          </nav>

        </div>
      </div>
    </header>
  )
}

export default AppTop
