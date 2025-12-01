import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from "@/components/ui/sonner";
import FlashMessage from '@/components/FlashMessage';
import { usePage } from '@inertiajs/react';
import Chatbot from '@/components/chatbot';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  [key: string]: any;
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
  const page = usePage<{ flash?: { success?: string; error?: string } }>();
  const flash = page.props.flash || {};

  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {/* Flash messages */}
      {flash.success && <FlashMessage message={flash.success} type="success" />}
      {flash.error && <FlashMessage message={flash.error} type="error" />}

      {children}
      {/* Chatbot global */}
      <Chatbot />
      {/* Toaster messages */}
      <Toaster richColors position="top-right" />
    </AppLayoutTemplate>
  );
};
