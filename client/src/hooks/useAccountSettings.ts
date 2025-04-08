import { useState, useCallback, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiService } from "../services/api";

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
  const { user, getAccessTokenSilently } = useAuth0();

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Load preferences from API
  const loadPreferences = useCallback(async () => {
    if (!user?.sub) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const token = await getAccessTokenSilently();
      // Fix: use the correct API endpoint by adding 'api/'
      const data = await apiService.get<UserPreferences>('api/Preferences', token);
      setPreferences(data);
    } catch (err) {
      console.error('Failed to load preferences:', err);
      setError('Failed to load preferences');
      // Fall back to defaults if API call fails
      setPreferences(getDefaultPreferences());
    } finally {
      setIsLoading(false);
    }
  }, [user?.sub, getAccessTokenSilently, getDefaultPreferences]);

  // Save preferences to API
  const savePreferences = useCallback(async () => {
    if (!user?.sub) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const token = await getAccessTokenSilently();
      // Fix: use the correct API endpoint by adding 'api/'
      await apiService.put<void>('api/Preferences', preferences, token);
      return true;
    } catch (err) {
      console.error('Failed to save preferences:', err);
      setError('Failed to save preferences');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.sub, preferences, getAccessTokenSilently]);

  // Load preferences on initial mount or when user changes
  useEffect(() => {
    if (user?.sub) {
      loadPreferences();
    }
  }, [user?.sub, loadPreferences]);

  return {
    preferences,
    updatePreferences,
    isLoading,
    error,
    loadPreferences,
    savePreferences,
    
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