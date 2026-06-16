"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { popoverStyles, buttonStyles } from "./ProfileMenu.styles";

interface ProfileMenuProps {
  onProfileClick?: () => void;
  onThemeClick?: () => void;
  onLogout?: () => void;
}

export default function ProfileMenu({
  onProfileClick,
  onThemeClick,
  onLogout,
}: ProfileMenuProps) {
  const { user, loading } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
  };

  const handleInfoClick = () => {
    setIsOpen(false);
    onProfileClick?.();
  };

  const handleThemeClick = () => {
    setIsOpen(false);
    onThemeClick?.();
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout?.();
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={buttonStyles.container}
      >
        {/* Avatar */}
        <div className={buttonStyles.avatar}>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName ?? undefined}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            user?.displayName && getInitials(user.displayName)
          )}
        </div>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div ref={popoverRef} className={popoverStyles.container}>
          {/* Header */}
          <div className={popoverStyles.header}>
            {/* Avatar */}
            <div className={buttonStyles.avatar}>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? undefined}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                user?.displayName && getInitials(user.displayName)
              )}
            </div>

            <div>
              <div className={popoverStyles.headerName}>
                {user?.displayName}
              </div>
              {user?.email && (
                <div className={popoverStyles.headerEmail}>{user.email}</div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile */}
            <div
              onClick={handleProfileClick}
              className={popoverStyles.menuItem}
            >
              <svg
                className={popoverStyles.menuIcon}
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
              <div className={popoverStyles.menuText}>Profile</div>
            </div>

            {/* About */}
            <div onClick={handleInfoClick} className={popoverStyles.menuItem}>
              <svg
                className={popoverStyles.menuIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              <div className={popoverStyles.menuText}>About</div>
            </div>

            {/* Report Issues */}
            <div onClick={handleThemeClick} className={popoverStyles.menuItem}>
              <svg
                className={popoverStyles.menuIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
              <div className={popoverStyles.menuText}>Report Issues</div>
            </div>
          </div>

          {/* Logout */}
          <div onClick={handleLogoutClick} className={popoverStyles.logoutItem}>
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
