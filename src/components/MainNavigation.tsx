
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Home, User, BookOpen, Award, Bell, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/badge";

const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLanguage();
  const { userData } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  isActive('/home') && "bg-accent text-accent-foreground"
                )}
                onClick={() => navigate('/home')}
              >
                <Home className="h-4 w-4 mr-2" />
                {translate('home')}
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <BookOpen className="h-4 w-4 mr-2" />
                {translate('learn')}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-accu-tech-blue/20 to-accu-tech-blue/5 p-6 no-underline outline-none focus:shadow-md"
                        onClick={() => navigate('/learn/how-it-works')}
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          {translate('howitworks')}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {translate('learnAboutDevice')}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        onClick={() => navigate('/learn/benefits')}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">{translate('benefits')}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {translate('benefitsDescription')}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        onClick={() => navigate('/learn/safety')}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">{translate('safety')}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {translate('safetyDescription')}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  isActive('/plan') && "bg-accent text-accent-foreground"
                )}
                onClick={() => navigate('/plan')}
              >
                <Award className="h-4 w-4 mr-2" />
                {translate('plan')}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/10 hover:bg-white/20 rounded-full h-9 w-9 relative"
              >
                <Bell className="h-5 w-5" />
                {userData.achievements.some(a => a.unlocked && !a.seen) && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500"></Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="py-2 px-3 font-medium">{translate('notifications')}</div>
              {userData.achievements.filter(a => a.unlocked && !a.seen).length > 0 ? (
                userData.achievements
                  .filter(a => a.unlocked && !a.seen)
                  .map((achievement) => (
                    <DropdownMenuItem key={achievement.id} className="py-2">
                      <div className="flex items-center">
                        <div className="mr-2">{achievement.icon}</div>
                        <div>
                          <div className="font-medium text-sm">{translate('achievementUnlocked')}</div>
                          <div className="text-xs text-muted-foreground">{translate(achievement.title)}</div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
              ) : (
                <div className="py-2 px-3 text-sm text-muted-foreground">{translate('noNotifications')}</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/10 hover:bg-white/20 rounded-full h-9 w-9"
            onClick={() => navigate('/profile')}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border z-50 md:hidden">
          <div className="p-4 space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                navigate('/home');
                setMobileMenuOpen(false);
              }}
            >
              <Home className="h-4 w-4 mr-2" />
              {translate('home')}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                navigate('/learn/how-it-works');
                setMobileMenuOpen(false);
              }}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {translate('learn')}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                navigate('/plan');
                setMobileMenuOpen(false);
              }}
            >
              <Award className="h-4 w-4 mr-2" />
              {translate('plan')}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                navigate('/profile');
                setMobileMenuOpen(false);
              }}
            >
              <User className="h-4 w-4 mr-2" />
              {translate('profile')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MainNavigation;
