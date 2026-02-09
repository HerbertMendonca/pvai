// Temporary file to hold the new menu rendering logic
// This will be integrated into DashboardLayout.tsx

function MenuItemWithSubmenu({ item, location, setLocation, isCollapsed }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isActive = location === item.path || (hasSubmenu && item.submenu.some((sub: any) => location === sub.path));
  const isSubmenuActive = hasSubmenu && item.submenu.some((sub: any) => location === sub.path);

  if (!hasSubmenu) {
    return (
      <SidebarMenuItem key={item.path}>
        <SidebarMenuButton
          isActive={isActive}
          onClick={() => setLocation(item.path)}
          tooltip={item.label}
          className={`h-10 transition-all font-normal`}
        >
          <item.icon
            className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
          />
          <span>{item.label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem key={item.path}>
      <SidebarMenuButton
        isActive={isSubmenuActive}
        onClick={() => setIsOpen(!isOpen)}
        tooltip={item.label}
        className={`h-10 transition-all font-normal`}
      >
        <item.icon
          className={`h-4 w-4 ${isSubmenuActive ? "text-primary" : ""}`}
        />
        <span>{item.label}</span>
        {!isCollapsed && (
          isOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />
        )}
      </SidebarMenuButton>
      {isOpen && !isCollapsed && (
        <div className="ml-6 mt-1 space-y-1">
          {item.submenu.map((subItem: any) => {
            const isSubActive = location === subItem.path;
            return (
              <button
                key={subItem.path}
                onClick={() => setLocation(subItem.path)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  isSubActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50"
                }`}
              >
                {subItem.label}
              </button>
            );
          })}
        </div>
      )}
    </SidebarMenuItem>
  );
}

// Replace the menu rendering section with:
<SidebarContent className="gap-0">
  <SidebarMenu className="px-2 py-1">
    {menuItems.map(item => (
      <MenuItemWithSubmenu
        key={item.path}
        item={item}
        location={location}
        setLocation={setLocation}
        isCollapsed={isCollapsed}
      />
    ))}
  </SidebarMenu>
</SidebarContent>
