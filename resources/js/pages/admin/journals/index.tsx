import { Head, router, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'

/* ---------- TYPES ---------- */

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  plan: 'free' | 'pro'
  created_at: string
}

/* ---------- PAGE ---------- */

export default function UsersIndex() {
  const { props } = usePage<{ users: User[] }>()
  const { users } = props
  const { t } = useTranslation()

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/adminDash' },
    // { title: 'Users', href: '/admin/users' },
  ]

  /* ---------- ACTIONS ---------- */

  const updateRole = (id: number, role: string) => {
    router.post(`/admin/users/${id}/role`, { role }, {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.users.role_updated')),
      onError: () => toast.error(t('common.error')),
    })
  }

  const updatePlan = (id: number, plan: string) => {
    router.post(`/admin/users/${id}/plan`, { plan }, {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.users.plan_updated')),
      onError: () => toast.error(t('common.error')),
    })
  }

  const deleteUser = (id: number) => {
    router.delete(`/admin/users/${id}`, {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.users.deleted')),
      onError: () => toast.error(t('common.error')),
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('admin.users.title')} />

      <div className="space-y-6 p-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">{t('admin.users.title')}</h1>
          <p className="text-muted-foreground">
            {t('admin.users.subtitle')}
          </p>
        </div>

        {/* TABLE */}
        <div className="rounded-xl border bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.users.name')}</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>{t('admin.users.role')}</TableHead>
                <TableHead>{t('admin.users.plan')}</TableHead>
                <TableHead>{t('admin.users.created')}</TableHead>
                <TableHead className="text-right">{t('admin.users.actions')}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>

                  {/* ROLE */}
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => updateRole(user.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* PLAN */}
                  <TableCell>
                    <Select
                      value={user.plan}
                      onValueChange={(value) => updatePlan(user.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>

                  {/* DELETE */}
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t('admin.users.delete_title')}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('admin.users.delete_desc')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t('common.cancel')}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteUser(user.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {t('common.delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  )
}