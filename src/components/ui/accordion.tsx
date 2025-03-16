
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Accordion UI component
 * 
 * A vertically stacked set of interactive headings that reveal/hide sections of content.
 * Based on Radix UI's Accordion primitive.
 */
const Accordion = AccordionPrimitive.Root

/**
 * AccordionItem UI component
 * 
 * An individual item within an accordion.
 * 
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>} props - Component props
 * @param {React.Ref<React.ElementRef<typeof AccordionPrimitive.Item>>} ref - Forwarded ref
 * @returns {JSX.Element} The accordion item
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

/**
 * AccordionTrigger UI component
 * 
 * The clickable header of an accordion item that toggles the visibility of its content.
 * 
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>} props - Component props
 * @param {React.Ref<React.ElementRef<typeof AccordionPrimitive.Trigger>>} ref - Forwarded ref
 * @returns {JSX.Element} The accordion trigger
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

/**
 * AccordionContent UI component
 * 
 * The content section of an accordion item that is shown/hidden when the trigger is clicked.
 * 
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>} props - Component props
 * @param {React.Ref<React.ElementRef<typeof AccordionPrimitive.Content>>} ref - Forwarded ref
 * @returns {JSX.Element} The accordion content
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
