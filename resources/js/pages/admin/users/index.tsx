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
import { PageProps } from '@inertiajs/core'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  plan: 'free' | 'pro'
  created_at: string
}

interface UsersProps extends PageProps  {
  users?: User[]
}

export default function UsersIndex() {
  const { props } = usePage<UsersProps>()
  const { users } = props
  const { t } = useTranslation()

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('admin.dashboard'), href: '/adminDash' },
    { title: t('admin.users.title'), href: '/admin/users' },
  ]

  const updateRole = (id: number, role: string) => {
    router.post(`/admin/users/${id}/role`, { role }, {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.users.roleUpdated')),
      onError: () => toast.error(t('admin.users.roleFailed')),
    })
  }

  const updatePlan = (id: number, plan: string) => {
    router.post(`/admin/users/${id}/plan`, { plan }, {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.users.planUpdated')),
      onError: () => toast.error(t('admin.users.planFailed')),
    })
  }

  const deleteUser = (id: number) => {
    router.delete(`/admin/users/${id}`, {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.users.deleted')),
      onError: () => toast.error(t('common.error')),
    })
  }

  if (!users || users.length === 0) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={t('admin.users.title')} />
        <div className="p-6">
          <h1 className="text-3xl font-bold">{t('admin.users.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('admin.users.subtitle')}</p>
          <p className="mt-6 text-center text-gray-500">{t('admin.users.noUsers')}</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('admin.users.title')} />
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold">{t('admin.users.title')}</h1>
        <p className="text-muted-foreground">{t('admin.users.subtitle')}</p>

        <div className="rounded-xl border bg-white shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.users.name')}</TableHead>
                <TableHead>{t('admin.users.email')}</TableHead>
                <TableHead>{t('admin.users.role')}</TableHead>
                <TableHead>{t('admin.users.plan')}</TableHead>
                <TableHead>{t('admin.users.created')}</TableHead>
                <TableHead className="text-right">{t('admin.users.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Select value={user.role} onValueChange={(value) => updateRole(user.id, value)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">{t('admin.users.roleUser')}</SelectItem>
                        <SelectItem value="admin">{t('admin.users.roleAdmin')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Select value={user.plan} onValueChange={(value) => updatePlan(user.id, value)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">{t('admin.users.planFree')}</SelectItem>
                        <SelectItem value="pro">{t('admin.users.planPro')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>

                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('admin.users.deleteTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>{t('admin.users.deleteDesc')}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button variant="destructive" onClick={() => deleteUser(user.id)}>
                              {t('common.delete')}
                            </Button>
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