"use client";

import { useState, useRef, useEffect } from "react";

interface ProfileButtonProps {
  userName?: string;
  userEmail?: string;
  onProfileClick?: () => void;
  onThemeClick?: () => void;
  onLogout?: () => void;
}

export default function ProfileButton({
  userName = "Guest User",
  userEmail,
  onProfileClick,
  onThemeClick,
  onLogout,
}: ProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // TODO: CUSTOMIZATION POINT - Button Styles
  const buttonStyles = {
    container:
      "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
    containerHover: "hover:bg-gray-100",
    avatar:
      "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
    avatarBg: "bg-gradient-to-br from-primary to-green-600",
    avatarText: "text-white",
    userName: "text-sm font-medium text-gray-700",
    chevron: "w-4 h-4 text-gray-500 transition-transform",
  };

  // TODO: CUSTOMIZATION POINT - Popover Styles
  const popoverStyles = {
    container: "absolute right-0 mt-2 w-64 rounded-xl shadow-xl border z-50",
    containerBg: "bg-white",
    containerBorder: "border-gray-200",

    // Header section
    header: "px-4 py-3 border-b",
    headerBorder: "border-gray-100",
    headerName: "font-semibold text-gray-900",
    headerEmail: "text-sm text-gray-500 mt-0.5",

    // Menu items
    menuItem:
      "flex items-center space-x-3 px-4 py-3 transition-colors cursor-pointer",
    menuItemHover: "hover:bg-gray-50",
    menuIcon: "w-5 h-5",
    menuIconColor: "text-gray-600",
    menuText: "text-sm font-medium text-gray-700",
    menuDescription: "text-xs text-gray-500 mt-0.5",

    // Logout item (special styling)
    logoutItem:
      "flex items-center space-x-3 px-4 py-3 border-t transition-colors cursor-pointer",
    logoutBorder: "border-gray-100",
    logoutHover: "hover:bg-red-50",
    logoutIcon: "w-5 h-5 text-red-600",
    logoutText: "text-sm font-medium text-red-600",
  };

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleProfileClick = () => {
    setIsOpen(false);
    onProfileClick?.();
    // TODO: Implement profile navigation or modal
    console.log("Profile clicked - Implement your profile logic here");
  };

  const handleThemeClick = () => {
    setIsOpen(false);
    onThemeClick?.();
    // TODO: Implement theme toggle logic
    console.log("Theme clicked - Implement your theme logic here");
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout?.();
    // TODO: Implement logout logic
    console.log("Logout clicked - Implement your logout logic here");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonStyles.container} ${buttonStyles.containerHover}`}
      >
        {/* Avatar */}
        <div
          className={`${buttonStyles.avatar} ${buttonStyles.avatarBg} ${buttonStyles.avatarText}`}
        >
          {getInitials(userName)}
        </div>

        {/* User Name */}
        <span className={buttonStyles.userName}>{userName}</span>

        {/* Chevron Icon */}
        <svg
          className={`${buttonStyles.chevron} ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          ref={popoverRef}
          className={`${popoverStyles.container} ${popoverStyles.containerBg} ${popoverStyles.containerBorder}`}
        >
          {/* Header with user info */}
          <div
            className={`${popoverStyles.header} ${popoverStyles.headerBorder}`}
          >
            <div className={popoverStyles.headerName}>{userName}</div>
            {userEmail && (
              <div className={popoverStyles.headerEmail}>{userEmail}</div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile Option */}
            <div
              onClick={handleProfileClick}
              className={`${popoverStyles.menuItem} ${popoverStyles.menuItemHover}`}
            >
              <svg
                className={`${popoverStyles.menuIcon} ${popoverStyles.menuIconColor}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div className="flex-1">
                <div className={popoverStyles.menuText}>Profile</div>
                <div className={popoverStyles.menuDescription}>
                  Manage your account
                </div>
              </div>
            </div>

            {/* Theme Option */}
            <div
              onClick={handleThemeClick}
              className={`${popoverStyles.menuItem} ${popoverStyles.menuItemHover}`}
            >
              <svg
                className={`${popoverStyles.menuIcon} ${popoverStyles.menuIconColor}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              <div className="flex-1">
                <div className={popoverStyles.menuText}>Theme</div>
                <div className={popoverStyles.menuDescription}>
                  Customize appearance
                </div>
              </div>
            </div>
          </div>

          {/* Logout Option (separated) */}
          <div
            onClick={handleLogoutClick}
            className={`${popoverStyles.logoutItem} ${popoverStyles.logoutBorder} ${popoverStyles.logoutHover}`}
          >
            <svg
              className={popoverStyles.logoutIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <div className={popoverStyles.logoutText}>Logout</div>
          </div>
        </div>
      )}
    </div>
  );
}
