import { useCallback } from 'react';

interface RefreshCallbacks {
  refreshDashboard?: () => void;
  refreshPredictions?: () => void;
  refreshRecommendations?: () => void;
  refreshAnomalies?: () => void;
}

let refreshCallbacks: RefreshCallbacks = {};

export const useRefreshData = () => {
  const registerRefreshCallbacks = useCallback((callbacks: RefreshCallbacks) => {
    refreshCallbacks = { ...refreshCallbacks, ...callbacks };
  }, []);

  const refreshAllData = useCallback(() => {
    Object.values(refreshCallbacks).forEach(callback => {
      if (callback) {
        try {
          callback();
        } catch (error) {
          console.error('Error refreshing data:', error);
        }
      }
    });
  }, []);

  return {
    registerRefreshCallbacks,
    refreshAllData
  };
};

export default useRefreshData;
