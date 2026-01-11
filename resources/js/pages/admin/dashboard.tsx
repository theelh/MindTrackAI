import AppLayout from '@/layouts/app-layout'
import { Head, router } from '@inertiajs/react'
import { type BreadcrumbItem } from '@/types'
import { useTranslation } from 'react-i18next'
import {
  Users,
  Crown,
  UserPlus,
  DollarSign,
  Shield,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

/* ---------------- TYPES ---------------- */

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  plan: 'free' | 'pro'
  created_at: string
}

interface Quote {
  id: number
  text: string
}

interface Stats {
  totalUsers: number
  proUsers: number
  freeUsers: number
  trialUsers: number
  newUsersThisMonth: number
}

interface Payments {
  monthlyRevenue: number
}

interface Props {
  users: {
    data: User[]
  }
  stats: Stats
  payments: Payments
  quotes: Quote[]
}

/* ---------------- COMPONENT ---------------- */

export default function AdminDashboard({
  users,
  stats,
  payments,
  quotes,
}: Props) {
  const { t, i18n } = useTranslation();

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('Admine.breadcrumbs.admin'), href: '/admin/dashboard' },
  ]

  /* -------- ACTIONS -------- */

  const updateRole = (userId: number, role: string) => {
  router.post(
    `/admin/users/${userId}/role`,
    { role },
    {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(t("Admine.toast.userRoleUpdated"))
      },
      onError: () => {
        toast.error(t("Admine.toast.userRoleFailed"))
      },
    }
  )
}


  const updatePlan = (userId: number, plan: string) => {
  router.post(
    `/admin/users/${userId}/plan`,
    { plan },
    {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(t("Admine.toast.userPlanUpdated"))
      },
      onError: () => {
        toast.error(t("Admine.toast.userPlanFailed"))
      },
    }
  )
}


  const deleteUser = (userId: number) => {
  toast.warning(t("Admine.toast.deleteWarning"), {
    action: {
      label: t("Admine.toast.deleteButton"),
      onClick: () => {
        router.delete(`/admin/users/${userId}/delete`, {
          preserveScroll: true,
          onSuccess: () => {
            toast.success(t("Admine.toast.userDeleted"))
          },
          onError: () => {
            toast.error(t("Admine.toast.userDeleteFailed"))
          },
        })
      },
    },
  })
}


  return (
    <>
      <Head title={t("Admine.head.dashboard")} />

      <AppLayout breadcrumbs={breadcrumbs}>
        <main className={`space-y-12 p-6 ${
        i18n.language === "ar" ? "max-w-[63rem]" : "max-w-full"
      }`}>

          {/* ================= STATS ================= */}
          <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <StatCard title={t("Admine.stats.totalUsers")} value={stats.totalUsers} icon={<Users />} />
            <StatCard title={t("Admine.stats.proUsers")} value={stats.proUsers} icon={<Crown />} />
            <StatCard title={t("Admine.stats.freeUsers")} value={stats.freeUsers} icon={<Shield />} />
            <StatCard title={t("Admine.stats.trials")} value={stats.trialUsers} icon={<UserPlus />} />
            <StatCard
              title={t("Admine.stats.monthlyRevenue")}
              value={`$${payments.monthlyRevenue}`}
              icon={<DollarSign />}
            />
          </section>

          {/* ================= USERS TABLE ================= */}
          <section className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-xl font-semibold mb-4">{t("Admine.usersTable.title")}</h2>

            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${
                i18n.language === "ar" ? "text-right justify-end" : "text-left justify-start"
              }`}>
                <thead className={`border-b text-left ${
                    i18n.language === "ar" ? "text-right justify-end" : "text-left justify-start"
                }`}>
                  <tr>
                    <th>{t("Admine.usersTable.columns.name")}</th>
                    <th>{t("Admine.usersTable.columns.email")}</th>
                    <th>{t("Admine.usersTable.columns.role")}</th>
                    <th>{t("Admine.usersTable.columns.plan")}</th>
                    <th>{t("Admine.usersTable.columns.created")}</th>
                    <th>{t("Admine.usersTable.columns.actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {users.data.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{user.name}</td>
                      <td>{user.email}</td>

                      <td>
                        <select
                          value={user.role}
                          onChange={e => updateRole(user.id, e.target.value)}
                          className="border rounded px-2 py-1 cursor-pointer"
                        >
                          <option value="user">{t("Admine.usersTable.roles.user")}</option>
                          <option value="admin">{t("Admine.usersTable.roles.admin")}</option>
                        </select>
                      </td>

                      <td>
                        <select
                          value={user.plan}
                          onChange={e => updatePlan(user.id, e.target.value)}
                          className="border rounded px-2 py-1 cursor-pointer"
                        >
                          <option value="free">{t("Admine.usersTable.plans.free")}</option>
                          <option value="pro">{t("Admine.usersTable.plans.pro")}</option>
                        </select>
                      </td>

                      <td>{new Date(user.created_at).toLocaleDateString()}</td>

                      <td>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 cursor-pointer hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ================= QUOTES ================= */}
          <section className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-xl font-semibold mb-4">{t("Admine.quotes.title")}</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {quotes.map(q => (
                <blockquote
                  key={q.id}
                  className="p-4 border rounded-lg italic text-gray-700"
                >
                  “{q.text}”
                </blockquote>
              ))}
            </div>
          </section>

        </main>
      </AppLayout>
    </>
  )
}

/* ---------------- SMALL COMPONENT ---------------- */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow flex items-center gap-4">
      <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  )
}
