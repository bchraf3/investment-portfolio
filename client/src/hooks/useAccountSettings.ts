import { useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export interface UserPreferences {
  id?: number;
  userId: string;
  themePreference: "Light" | "Dark" | "System";
  emailNotificationsEnabled: boolean;
  priceAlertNotificationsEnabled: boolean;
  portfolioSummaryNotificationsEnabled: boolean;
  defaultPortfolioView: "Summary" | "Detailed" | "Performance";
  defaultCurrency: string;
  showPerformanceInPercentage: boolean;
}

export const useAccountSettings = () => {
  const { user } = useAuth0();

  const getDefaultPreferences = useCallback((): UserPreferences => ({
    userId: user?.sub || "",
    themePreference: "System",
    emailNotificationsEnabled: true,
    priceAlertNotificationsEnabled: true,
    portfolioSummaryNotificationsEnabled: true,
    defaultPortfolioView: "Summary",
    defaultCurrency: "USD",
    showPerformanceInPercentage: true,
  }), [user?.sub]);

  const [preferences, setPreferences] = useState<UserPreferences>(getDefaultPreferences());

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Memoized action creators
  const createToggleHandler = useCallback((key: keyof UserPreferences) => 
    () => updatePreferences({ [key]: !preferences[key] }),
    [preferences, updatePreferences]
  );

  const createSetter = useCallback(<K extends keyof UserPreferences>(key: K) => 
    (value: UserPreferences[K]) => updatePreferences({ [key]: value }),
    [updatePreferences]
  );

  return {
    preferences,
    updatePreferences,
    
    // Theme actions
    setThemePreference: createSetter("themePreference"),
    toggleThemePreference: () => updatePreferences({ 
      themePreference: preferences.themePreference === "Light" ? "Dark" : "Light" 
    }),
    
    // Notification actions
    toggleEmailNotifications: createToggleHandler("emailNotificationsEnabled"),
    togglePriceAlerts: createToggleHandler("priceAlertNotificationsEnabled"),
    togglePortfolioSummaries: createToggleHandler("portfolioSummaryNotificationsEnabled"),
    
    // Display preferences
    setDefaultPortfolioView: createSetter("defaultPortfolioView"),
    setDefaultCurrency: createSetter("defaultCurrency"),
    togglePerformanceDisplay: createToggleHandler("showPerformanceInPercentage"),
  };
};