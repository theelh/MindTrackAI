import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRightToLineIcon, BadgeHelpIcon, BookOpen, ChartNoAxesCombinedIcon, CircleDollarSignIcon, LayoutGrid,  PanelsLeftBottomIcon, Plus, UserPenIcon, UserRoundCogIcon } from 'lucide-react';
import AppLogo from './app-logo';
import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useTranslation } from 'react-i18next';


export function AppSidebar() {
    const { t, i18n } = useTranslation();
    const { props } = usePage<{ auth: { user: { role: string } } }>();
    const isAdmin = props.auth.user.role === 'admin';
    const isRTL = i18n.language === "ar";
    const mainNavItems: NavItem[] = [
        
        // Only show for non-admin users
        ...(!isAdmin ? [
            {
            title: t("Menu.nav.home"),
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: t("Menu.nav.analytics"),
            href: '/emotion/analytics',
            icon: ChartNoAxesCombinedIcon,
        },
            {
                title: t("Menu.nav.journals"),
                href: '/journals',
                icon: BookOpen,
            },
            {
                title: t("Menu.nav.upload"),
                href: '/journal/create',
                icon: Plus,
            },
            {
                title: t("Menu.nav.services"),
                href: '/services',
                icon: ArrowRightToLineIcon,
            },
            {
                title: t("Menu.nav.about"),
                href: '/about',
                icon: BadgeHelpIcon,
            }
        ] : [
            // Admin-specific journal control page
            {
            title: t("Menu.nav.home"),
            href: '/adminDash',
            icon: LayoutGrid,
        },
            {
            title: t("Menu.nav.about"),
            href: '/admin/about',
            icon: BadgeHelpIcon,
        },
            {
                title: t("Admine.journals"),
                href: '/admin/journals',
                icon: BookOpen,
            }
        ]),
    ];
    const mainNavItems2: NavItem[] = [
        ...(!isAdmin ? [
            {
            title: t("Menu.footer.feed"),
            href: '/feed',
            icon: PanelsLeftBottomIcon,
            },
            {
            title: t("Menu.footer.pricing"),
            href: '/plans',
            icon: CircleDollarSignIcon,        
            },
            ] : [
                {
                title: "User Management",
                href: '/admin/users',
                icon: UserRoundCogIcon,        
            },
            ]),        
        
    ];
    
    const footerNavItems: NavItem[] = [
        {
            title: t("Menu.footer.contact"),
            href: '/contact',
            icon: UserPenIcon,
        },
    ];
    return (
        <Sidebar className={`shadow-xl ${
            isRTL ? "z-50" : ""
        }`} collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo/>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <SidebarGroupLabel className="mt-[1rem] tracking-[0.15em] mx-[0.5rem] font-semibold uppercase text-[10px]">{t("Menu.footer.resources")}</SidebarGroupLabel>
                <NavMain items={mainNavItems2} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarGroupLabel className=" tracking-[0.15em] mx-[0.5rem] font-semibold uppercase text-[10px]">{t("Menu.footer.connect")}</SidebarGroupLabel>
                <NavFooter items={footerNavItems} />
                <NavUser />
                <InputGroup className="flex items-center border-gray-500/30 bg-sidebar-bg/50 py-2">
                    <InputGroupInput className="font-normal placeholder:font-semibold placeholder:text-[16px]" placeholder={t("Menu.footer.Search")} />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </SidebarFooter>
        </Sidebar>
    );
}
