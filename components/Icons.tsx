
import React from 'react';

type IconProps = {
  className?: string;
};

export const SparkleIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-icons-outlined ${className}`} aria-hidden="true">
    auto_awesome
  </span>
);