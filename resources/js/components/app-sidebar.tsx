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
import { Link } from '@inertiajs/react';
import { ArrowBigRight, ArrowRightToLine, ArrowRightToLineIcon, BadgeHelpIcon, BookOpen, ChartNoAxesCombinedIcon, CircleDollarSignIcon, Folder, LayoutGrid, Lightbulb, LightbulbIcon, PanelsLeftBottomIcon, PlaneLandingIcon, PlaneTakeoffIcon, Plus, UserPen, UserPenIcon } from 'lucide-react';
import AppLogo from './app-logo';
import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },{
        title: 'My Documents',
        href: '/documents',
        icon: Folder,
    },
    {
        title: 'Upload Document',
        href: '/upload',
        icon: Plus,        
    },
    {
        title: 'Your processes',
        href: '/processes',
        icon: ChartNoAxesCombinedIcon,
    },
    {
        title: 'Services',
        href: '/services',
        icon: ArrowRightToLineIcon,
    },
    {
        title: 'About Us',
        href: '/about',
        icon: BadgeHelpIcon,
    },
];
const mainNavItems2: NavItem[] = [
    {
        title: 'Feed',
        href: '/feed',
        icon: PanelsLeftBottomIcon,
    },{
        title: 'Toughts',
        href: '/toughts',
        icon: LightbulbIcon,
    },
    {
        title: 'Pricing',
        href: '/pricing',
        icon: CircleDollarSignIcon,        
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Contact',
        href: '/contact',
        icon: UserPenIcon,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <NavUser />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <SidebarGroupLabel className="mt-[1rem] mx-[0.5rem] font-semibold uppercase text-[10px]">Resources</SidebarGroupLabel>
                <NavMain items={mainNavItems2} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarGroupLabel className="mt-[1rem] mx-[0.5rem] font-semibold uppercase text-[10px]">Connect</SidebarGroupLabel>
                <NavFooter items={footerNavItems} />
                <InputGroup className="flex items-center border-gray-500/30 bg-sidebar-bg/50 py-2">
                    <InputGroupInput className="font-semibold placeholder:font-semibold placeholder:text-[16px]" placeholder="Search..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </SidebarFooter>
        </Sidebar>
    );
}
