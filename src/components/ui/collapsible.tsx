
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Collapsible component
 * Used to create expandable/collapsible content sections
 * 
 * Based on Radix UI's Collapsible primitive
 */
const Collapsible = CollapsiblePrimitive.Root

/**
 * CollapsibleTrigger component
 * The button that triggers the expand/collapse behavior
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/**
 * CollapsibleContent component
 * The container for content that will be expanded/collapsed
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
