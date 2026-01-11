import { Head, router, usePage } from '@inertiajs/react'
import { toast } from 'sonner'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { useTranslation } from 'react-i18next'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

import { Trash2, FileText, ExternalLink } from 'lucide-react'

interface Journal {
  id: number
  text_content: string
  media_path?: string
  user: {
    name: string
  }
}

export default function JournalIndex() {
  const { props } = usePage<{ journals: Journal[] }>()
  const { journals } = props
  const { t, i18n } = useTranslation()

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('Admine.breadcrumbs.admin'), href: '/admin' },
    { title: t('Journals.breadcrumbs.journals'), href: '/admin/journals' },
  ]

  const deleteJournal = (journalId: number) => {
    router.delete(`/admin/journals/${journalId}`, {
        preserveScroll: true,
        onSuccess: () => {
        toast.success(t("Journals.actions.toast.deleted"))
        },
        onError: () => {
        toast.error(t("Journals.actions.toast.faild"))
        },
    })
    }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t("Journals.head.journals")} />

      <div className={`space-y-6 p-6 ${
        i18n.language === "ar" ? "max-w-[63rem]" : "max-w-full"
      }`}>
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("Journals.header.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("Journals.header.description")}
          </p>
        </div>

        {/* Empty State */}
        {journals.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <FileText className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                {t("Journals.emptyState.message")}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Journals Grid */}
        <div className={`grid gap-6 ${
          i18n.language === "ar" ? "grid-cols-1" : "grid-cols-2"
        }`}>
          {journals.map((journal) => (
            <Card key={journal.id} className="transition hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">
                      {journal.user.name}
                    </CardTitle>
                    <CardDescription>
                      {t("Journals.journalCard.journalEntry")} #{journal.id}
                    </CardDescription>
                  </div>

                  <Badge variant="secondary">{t("Journals.journalCard.badge")}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Journal Content */}
                <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {journal.text_content}
                </p>

                {/* Media */}
                {journal.media_path && (
                  <a
                    href={`${journal.media_path}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    {t("Journals.journalCard.media")} <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {/* Actions */}
                <div className="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("Journals.actions.deleteButton")}
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("Journals.actions.deleteConfirmTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("Journals.actions.deleteConfirmDescription")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("Journals.actions.cancel")}</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                variant="destructive"
                                onClick={() => deleteJournal(journal.id)}
                            >
                                {t("Journals.actions.confirmDelete")}
                            </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}