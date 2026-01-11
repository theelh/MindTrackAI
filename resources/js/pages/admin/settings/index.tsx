import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/* ---------------- TYPES ---------------- */
interface Settings {
  registrationEnabled: boolean
  maintenanceMode: boolean
  freePlanLimit: number
  proPlanLimit: number
  aiEnabled: boolean
  maxPromptLength: number
}

/* ---------------- PAGE ---------------- */
export default function AdminSettings() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/adminDash' },
    { title: t('admin.settings.title'), href: '/admin/settings' },
  ]

  // Fetch settings from backend
  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  const updateSetting = (key: keyof Settings, value: any) => {
    fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
      .then(res => {
        if (!res.ok) throw new Error()
        setSettings(prev => prev ? { ...prev, [key]: value } : prev)
        toast.success('Settings updated')
      })
      .catch(() => toast.error('Update failed'))
  }

  if (loading) return <div>Loading...</div>
  if (!settings) return <div>No settings found</div>

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('admin.settings.title')} />
      <div className="space-y-8 p-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">⚙️ {t('admin.settings.title')}</h1>
          <p className="text-muted-foreground">{t('admin.settings.subtitle')}</p>
        </div>

        {/* GENERAL */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.settings.general')}</CardTitle>
            <CardDescription>{t('admin.settings.generalDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('admin.settings.registration')}</Label>
              <Switch
                checked={settings.registrationEnabled}
                onCheckedChange={v => updateSetting('registrationEnabled', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('admin.settings.maintenance')}</Label>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={v => updateSetting('maintenanceMode', v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* PLANS */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.settings.plans')}</CardTitle>
            <CardDescription>{t('admin.settings.plansDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>{t('admin.settings.freeLimit')}</Label>
              <Input
                type="number"
                value={settings.freePlanLimit}
                onBlur={e => updateSetting('freePlanLimit', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>{t('admin.settings.proLimit')}</Label>
              <Input
                type="number"
                value={settings.proPlanLimit}
                onBlur={e => updateSetting('proPlanLimit', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.settings.ai')}</CardTitle>
            <CardDescription>{t('admin.settings.aiDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('admin.settings.enableAI')}</Label>
              <Switch
                checked={settings.aiEnabled}
                onCheckedChange={v => updateSetting('aiEnabled', v)}
              />
            </div>
            <div>
              <Label>{t('admin.settings.maxPrompt')}</Label>
              <Input
                type="number"
                value={settings.maxPromptLength}
                onBlur={e => updateSetting('maxPromptLength', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* SECURITY */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.settings.security')}</CardTitle>
            <CardDescription>{t('admin.settings.securityDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">{t('admin.settings.forceLogout')}</Button>
            <Button variant="destructive">{t('admin.settings.resetKeys')}</Button>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  )
}