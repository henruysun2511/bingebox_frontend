"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({ items }: { items: any[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-0">
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="hover:bg-white/5 py-6 cursor-pointer"
                >
                  {item.icon && <item.icon className="size-5 text-blue mr-2 group-hover/collapsible:text-white" />}
                  <span className="text-[15px] font-semibold text-gray-200 group-hover/collapsible:text-white">
                    {item.title}
                  </span>
                  {item.items?.length > 0 && (
                    <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 text-gray-400" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>

              {item.items?.length > 0 && (
                <CollapsibleContent className="data-[state=closed]:animate-none">
                  <SidebarMenuSub className="ml-0 border-none px-0 pb-1">
                    {item.items.map((subItem: any) => {
                      const isSubActive = pathname === subItem.url

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={`
                              w-full justify-start py-5 px-4 rounded-lg transition-all
                              &[data-active=true]:!text-white
                            hover:bg-white/5 hover:text-white
                             text-gray-400
                         not-last-of-type: `}
                            style={isSubActive ? {
                              backgroundColor: 'var(--color-blue)',
                              color: 'white'
                            } : {}}
                          >
                            <Link href={subItem.url} className="w-full">
                              <span className="text-[14px] font-medium">
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}