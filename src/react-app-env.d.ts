/// <reference types="react-scripts" />

// Type declaration for framer-motion
declare module 'framer-motion' {
  import * as React from 'react';
  
  export interface MotionProps extends React.HTMLAttributes<HTMLElement> {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
    whileFocus?: any;
    whileInView?: any;
    viewport?: any;
    drag?: any;
    dragConstraints?: any;
    dragElastic?: any;
    dragMomentum?: any;
    onDrag?: any;
    onDragStart?: any;
    onDragEnd?: any;
    layout?: any;
    layoutId?: string;
    layoutDependency?: any;
    layoutRoot?: any;
    custom?: any;
    variants?: any;
    inherit?: boolean;
    style?: React.CSSProperties;
    transformValues?: any;
    children?: React.ReactNode;
  }
  
  export const motion: {
    div: React.ForwardRefExoticComponent<MotionProps & React.RefAttributes<HTMLDivElement>>;
    span: React.ForwardRefExoticComponent<MotionProps & React.RefAttributes<HTMLSpanElement>>;
    [key: string]: React.ForwardRefExoticComponent<MotionProps & React.RefAttributes<any>>;
  };
  
  export const AnimatePresence: React.FC<{
    children?: React.ReactNode;
    initial?: boolean;
    exitBeforeEnter?: boolean;
    mode?: "sync" | "wait" | "popLayout";
    custom?: any;
    onExitComplete?: () => void;
  }>;
  
  export * from 'framer-motion';
}
