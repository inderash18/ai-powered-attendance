import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Enterprise Card Component
 * Features: Elevation, hover states, loading states, glassmorphism
 */
export const EnterpriseCard = ({
  children,
  title,
  subtitle,
  icon: Icon,
  variant = 'default',
  elevation = 'md',
  hoverable = false,
  loading = false,
  className = '',
  headerAction,
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-neutral-200',
    glass: 'glass border border-white/20',
    gradient: 'bg-gradient-to-br from-primary-50 to-white border border-primary-100',
    elevated: 'bg-white shadow-xl border-0',
  };

  const elevations = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`
        rounded-2xl overflow-hidden transition-all duration-200
        ${variants[variant]}
        ${elevations[elevation]}
        ${hoverable ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Header */}
      {(title || Icon) && (
        <div className="px-6 py-5 border-b border-neutral-100 bg-gradient-to-r from-neutral-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-neutral-900 tracking-tight">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-sm font-medium text-neutral-600">Loading...</p>
            </div>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
};

EnterpriseCard.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  variant: PropTypes.oneOf(['default', 'glass', 'gradient', 'elevated']),
  elevation: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  hoverable: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  headerAction: PropTypes.node,
};

/**
 * Advanced Button Component
 * Features: Multiple variants, sizes, loading states, icons
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300',
    outline: 'bg-transparent border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400',
    ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
    danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 shadow-sm',
    success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-base rounded-xl',
    lg: 'px-6 py-3.5 text-lg rounded-xl',
    xl: 'px-8 py-4 text-xl rounded-2xl',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Advanced Badge Component
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon: Icon,
  className = '',
}) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    info: 'bg-info-100 text-info-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-success-500' : 'bg-current'}`} />
      )}
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  dot: PropTypes.bool,
  icon: PropTypes.elementType,
  className: PropTypes.string,
};

/**
 * Advanced Input Component
 */
export const Input = ({
  label,
  error,
  helpText,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 rounded-xl border transition-all duration-200
            ${Icon && iconPosition === 'left' ? 'pl-11' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-11' : ''}
            ${error
              ? 'border-error-300 focus:border-error-500 focus:ring-4 focus:ring-error-100'
              : 'border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
            }
            bg-white text-neutral-900 placeholder:text-neutral-400
            focus:outline-none
            ${className}
          `}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-error-600 flex items-center gap-1">
          <span className="font-medium">⚠</span> {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-neutral-500">{helpText}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helpText: PropTypes.string,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
};

/**
 * Stat Card Component
 */
export const StatCard = ({
  label,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  loading = false,
}) => {
  const trendColors = {
    up: 'text-success-600 bg-success-50',
    down: 'text-error-600 bg-error-50',
    neutral: 'text-neutral-600 bg-neutral-50',
  };

  return (
    <EnterpriseCard variant="elevated" hoverable>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-3xl font-bold text-neutral-900 mt-2 tracking-tight">
            {loading ? (
              <span className="inline-block w-24 h-8 bg-neutral-200 rounded animate-pulse" />
            ) : (
              value
            )}
          </p>
          {change && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mt-3 ${trendColors[trend]}`}>
              <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>
              {change}
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
        )}
      </div>
    </EnterpriseCard>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
  icon: PropTypes.elementType,
  loading: PropTypes.bool,
};
