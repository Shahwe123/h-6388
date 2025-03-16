
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Collapsible UI component
 * 
 * A component that can be expanded/collapsed to show/hide content.
 * Based on Radix UI's Collapsible primitive.
 */
const Collapsible = CollapsiblePrimitive.Root

/**
 * CollapsibleTrigger UI component
 * 
 * The button or element that triggers the expand/collapse action.
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/**
 * CollapsibleContent UI component
 * 
 * The content area that will be shown/hidden when the collapsible is expanded/collapsed.
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
