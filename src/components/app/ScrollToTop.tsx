
import { useScrollToTop } from "@/hooks/useScrollToTop";

/**
 * ScrollToTop component
 * 
 * This component scrolls the window to the top on route changes.
 * 
 * @returns {null} This component doesn't render anything
 */
export const ScrollToTop = () => {
  useScrollToTop();
  return null;
};
