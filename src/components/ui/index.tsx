import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Search,
  X,
  Loader2,
  ShieldAlert,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';

export type BrandVariant = 'patient' | 'professional';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
export type SizeVariant = 'sm' | 'md' | 'lg';
export type SemanticTone = 'normal' | 'attention' | 'urgent' | 'info' | 'neutral' | 'wine' | 'blue' | 'gold';

/* ============================================================================
 * 0. STANDARDIZED PAGE HEADER & SECTION HEADER (Section 1 & 6)
 * ========================================================================== */
export const PageHeader: React.FC<{
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
  brand?: BrandVariant;
}> = ({
  badge,
  badgeIcon,
  title,
  description,
  actions,
  onBack,
  backLabel = 'Voltar ao Início',
  brand = 'patient',
}) => (
  <header
    className={`rounded-2xl p-5 sm:p-6 border shadow-2xs transition-all ${
      brand === 'professional'
        ? 'vitta-pearl-white-card'
        : 'bg-white border-[#E6D4AF]/80'
    }`}
  >
    {onBack && (
      <div className="mb-3">
        <button
          type="button"
          onClick={onBack}
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
            brand === 'professional'
              ? 'text-[#0A2647] bg-[#EBF6FF] hover:bg-[#DCEFFE]'
              : 'text-[#5D1425] bg-[#FAF0F2] hover:bg-[#F5DADF] border border-[#EBBEC8]/60'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{backLabel}</span>
        </button>
      </div>
    )}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1.5 max-w-2xl">
        {badge && (
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${
              brand === 'professional'
                ? 'bg-[#DCEFFE] text-[#0A2647] border-[#144272]/30'
                : 'bg-[#FAF0F2] text-[#8D253D] border-[#EBBEC8]'
            }`}
          >
            {badgeIcon}
            <span>{badge}</span>
          </div>
        )}
        <h1
          className={`text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight leading-tight ${
            brand === 'professional' ? 'text-[#0A2647]' : 'text-[#480D1B]'
          }`}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              brand === 'professional' ? 'text-[#144272]' : 'text-stone-600'
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1 md:pt-0">
          {actions}
        </div>
      )}
    </div>
  </header>
);

export const SectionHeader: React.FC<{
  overline?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  brand?: BrandVariant;
}> = ({ overline, title, subtitle, icon, action, brand = 'patient' }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-3.5">
    <div className="space-y-0.5">
      {overline && (
        <span
          className={`text-[10px] font-bold uppercase tracking-widest block ${
            brand === 'professional' ? 'text-[#144272]' : 'text-[#8D253D]'
          }`}
        >
          {overline}
        </span>
      )}
      <div className="flex items-center gap-2">
        {icon && (
          <span
            className={
              brand === 'professional' ? 'text-[#144272]' : 'text-[#8D253D]'
            }
          >
            {icon}
          </span>
        )}
        <h2
          className={`text-base sm:text-lg font-serif font-bold leading-snug ${
            brand === 'professional' ? 'text-[#0A2647]' : 'text-[#480D1B]'
          }`}
        >
          {title}
        </h2>
      </div>
      {subtitle && (
        <p
          className={`text-xs ${
            brand === 'professional' ? 'text-[#144272]/80' : 'text-stone-500'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

/* ============================================================================
 * 1. BUTTON & ICON BUTTON
 * ========================================================================== */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  brand?: BrandVariant;
  size?: SizeVariant;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  brand = 'patient',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses: Record<SizeVariant, string> = {
    sm: 'min-h-[38px] px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'min-h-[44px] px-4 py-2.5 text-xs sm:text-sm rounded-xl gap-2',
    lg: 'min-h-[48px] px-5 py-3 text-sm sm:text-base rounded-2xl gap-2.5',
  };

  const patientVariants: Record<ButtonVariant, string> = {
    primary: 'bg-[#5D1425] hover:bg-[#741C30] text-white border border-[#480D1B] shadow-xs',
    secondary: 'bg-[#FAF0F2] hover:bg-[#F5DFE4] text-[#5D1425] border border-[#EBBEC8]',
    outline: 'bg-white hover:bg-[#FAF6ED] text-[#480D1B] border border-[#E6D4AF]',
    ghost: 'bg-transparent hover:bg-stone-100 text-stone-700 border border-transparent',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-800 shadow-xs',
    gold: 'bg-[#B89243] hover:bg-[#9B7731] text-white border border-[#9B7731] shadow-xs',
  };

  const profVariants: Record<ButtonVariant, string> = {
    primary: 'vitta-metallic-blue-badge hover:brightness-110 text-white',
    secondary: 'vitta-pearl-button text-[#0A2647]',
    outline: 'bg-white hover:bg-[#EBF6FF] text-[#0A2647] border-2 border-[#144272]',
    ghost: 'bg-transparent hover:bg-[#DCEFFE] text-[#0A2647] border border-transparent',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-800',
    gold: 'bg-[#144272] hover:bg-[#0A2647] text-white border border-[#7DD3FC]',
  };

  const styleClass = brand === 'professional' ? profVariants[variant] : patientVariants[variant];

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89243] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap ${sizeClasses[size]} ${styleClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" /> : leftIcon}
      <span className="truncate">{children}</span>
      {!loading && rightIcon}
    </button>
  );
};

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  brand?: BrandVariant;
  variant?: 'outline' | 'ghost' | 'primary';
}

export const IconButton: React.FC<IconButtonProps> = ({
  label,
  brand = 'patient',
  variant = 'outline',
  children,
  className = '',
  ...props
}) => {
  const base =
    brand === 'professional'
      ? variant === 'primary'
        ? 'vitta-metallic-blue-badge text-white'
        : 'vitta-pearl-button text-[#0A2647]'
      : variant === 'primary'
      ? 'bg-[#5D1425] text-white border border-[#480D1B]'
      : 'bg-white hover:bg-[#FAF6ED] text-[#480D1B] border border-[#E6D4AF]';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`min-h-[44px] min-w-[44px] p-2 rounded-xl inline-flex items-center justify-center transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89243] cursor-pointer ${base} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/* ============================================================================
 * 2. CARD, DATA CARD & STAT CARD
 * ========================================================================== */
export const Card: React.FC<{
  children: React.ReactNode;
  brand?: BrandVariant;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ children, brand = 'patient', className = '', padding = 'md' }) => {
  const padMap = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };
  const surface =
    brand === 'professional'
      ? 'vitta-pearl-white-card rounded-2xl'
      : 'bg-white rounded-2xl border border-[#E6D4AF]/80 shadow-2xs';

  return <div className={`${surface} ${padMap[padding]} ${className}`}>{children}</div>;
};

export const StatCard: React.FC<{
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  tone?: SemanticTone;
  icon?: React.ReactNode;
  brand?: BrandVariant;
  onClick?: () => void;
}> = ({ label, value, subtitle, trend, icon, brand = 'patient', onClick }) => {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl transition-all ${
        brand === 'professional'
          ? 'vitta-pearl-white-card hover:brightness-[0.99]'
          : 'bg-white border border-[#E6D4AF]/80 hover:border-[#B89243] shadow-2xs'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`text-xs font-semibold ${
            brand === 'professional' ? 'text-[#144272]' : 'text-stone-600'
          }`}
        >
          {label}
        </span>
        {icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              brand === 'professional'
                ? 'vitta-metallic-blue-badge text-[#7DD3FC]'
                : 'bg-[#FAF0F2] text-[#5D1425] border border-[#EBBEC8]'
            }`}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-2xl sm:text-3xl font-serif font-bold tabular-nums ${
            brand === 'professional' ? 'text-[#0A2647]' : 'text-[#480D1B]'
          }`}
        >
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-700 tabular-nums">{trend}</span>
        )}
      </div>
      {subtitle && (
        <p
          className={`text-xs mt-1.5 pt-2 border-t ${
            brand === 'professional'
              ? 'text-[#144272] border-[#144272]/15'
              : 'text-stone-500 border-stone-100'
          }`}
        >
          {subtitle}
        </p>
      )}
    </Wrapper>
  );
};

export const DataCard: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  brand?: BrandVariant;
  className?: string;
}> = ({ title, subtitle, action, children, brand = 'patient', className = '' }) => (
  <Card brand={brand} className={`space-y-4 ${className}`}>
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b ${
        brand === 'professional' ? 'border-[#144272]/20' : 'border-stone-100'
      }`}
    >
      <div>
        <h3
          className={`text-base sm:text-lg font-serif font-bold ${
            brand === 'professional' ? 'text-[#0A2647]' : 'text-[#480D1B]'
          }`}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className={`text-xs ${
              brand === 'professional' ? 'text-[#144272]' : 'text-stone-500'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
    <div>{children}</div>
  </Card>
);

/* ============================================================================
 * 3. BADGE & AVATAR (WCAG accessible — pairs icon/symbol + text, never color alone)
 * ========================================================================== */
export const Badge: React.FC<{
  children: React.ReactNode;
  tone?: SemanticTone;
  icon?: React.ReactNode;
  className?: string;
}> = ({ children, tone = 'neutral', icon, className = '' }) => {
  const toneClasses: Record<SemanticTone, string> = {
    normal: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    attention: 'bg-amber-50 text-amber-900 border-amber-300',
    urgent: 'bg-rose-50 text-rose-800 border-rose-300',
    info: 'bg-sky-50 text-sky-900 border-sky-300',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    wine: 'bg-[#FAF0F2] text-[#5D1425] border-[#EBBEC8]',
    blue: 'bg-[#DCEFFE] text-[#0A2647] border-[#144272]/40',
    gold: 'bg-[#FAF6ED] text-[#7C5D23] border-[#E6D4AF]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold border whitespace-nowrap ${toneClasses[tone]} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};

export const Avatar: React.FC<{
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  brand?: BrandVariant;
  status?: 'online' | 'busy' | 'offline';
}> = ({ name, src, size = 'md', brand = 'patient', status }) => {
  const [imgError, setImgError] = useState(false);
  const initials =
    name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'V';

  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const bgClass =
    brand === 'professional'
      ? 'vitta-metallic-blue-badge text-white'
      : 'bg-[#5D1425] text-[#FAF6ED] border border-[#B89243]';

  return (
    <div className="relative inline-flex shrink-0">
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={`${sizeMap[size]} rounded-full object-cover border border-[#E6D4AF]`}
        />
      ) : (
        <div
          className={`${sizeMap[size]} ${bgClass} rounded-full flex items-center justify-center font-serif font-bold`}
          aria-label={name}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          title={status === 'online' ? 'Plantão ativo' : status === 'busy' ? 'Em atendimento' : 'Ausente'}
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'busy'
              ? 'bg-amber-500'
              : 'bg-slate-400'
          }`}
        />
      )}
    </div>
  );
};

/* ============================================================================
 * 4. ACCESSIBLE FORM CONTROLS (Input, Select, Textarea, SearchBar)
 * ========================================================================== */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  brand?: BrandVariant;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  brand = 'patient',
  id,
  className = '',
  required,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`;
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-xs font-semibold ${
            brand === 'professional' ? 'text-[#0A2647]' : 'text-[#480D1B]'
          }`}
        >
          {label} {required && <span className="text-rose-600" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
        required={required}
        className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white transition-colors focus:outline-none focus:ring-2 ${
          error
            ? 'border-2 border-rose-500 focus:ring-rose-500/30 text-rose-950'
            : brand === 'professional'
            ? 'border-2 border-[#144272]/60 focus:border-[#0A2647] focus:ring-[#144272]/20 text-[#0A2647]'
            : 'border border-[#E6D4AF] focus:border-[#5D1425] focus:ring-[#5D1425]/20 text-stone-800'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs font-medium text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-help`} className="text-[11px] text-stone-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  brand?: BrandVariant;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  brand = 'patient',
  options,
  id,
  className = '',
  required,
  ...props
}) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`;
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={selectId}
          className={`block text-xs font-semibold ${
            brand === 'professional' ? 'text-[#0A2647]' : 'text-[#480D1B]'
          }`}
        >
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={!!error}
          required={required}
          className={`w-full min-h-[44px] appearance-none px-3.5 py-2.5 pr-9 rounded-xl text-xs sm:text-sm bg-white transition-colors focus:outline-none focus:ring-2 ${
            brand === 'professional'
              ? 'border-2 border-[#144272]/60 focus:border-[#0A2647] focus:ring-[#144272]/20 text-[#0A2647] font-semibold'
              : 'border border-[#E6D4AF] focus:border-[#5D1425] focus:ring-[#5D1425]/20 text-stone-800'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500" />
      </div>
      {error && (
        <p role="alert" className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  brand?: BrandVariant;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  brand = 'patient',
  id,
  className = '',
  required,
  ...props
}) => {
  const areaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`;
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={areaId}
          className={`block text-xs font-semibold ${
            brand === 'professional' ? 'text-[#0A2647]' : 'text-[#480D1B]'
          }`}
        >
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      <textarea
        id={areaId}
        aria-invalid={!!error}
        required={required}
        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white transition-colors focus:outline-none focus:ring-2 ${
          brand === 'professional'
            ? 'border-2 border-[#144272]/60 focus:border-[#0A2647] focus:ring-[#144272]/20 text-[#0A2647]'
            : 'border border-[#E6D4AF] focus:border-[#5D1425] focus:ring-[#5D1425]/20 text-stone-800'
        } ${className}`}
        {...props}
      />
      {error && (
        <p role="alert" className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
};

export const SearchBar: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  brand?: BrandVariant;
  onClear?: () => void;
}> = ({ value, onChange, placeholder = 'Buscar...', brand = 'patient', onClear }) => (
  <div className="relative w-full">
    <Search
      className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
        brand === 'professional' ? 'text-[#144272]' : 'text-stone-400'
      }`}
    />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={`w-full min-h-[44px] pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 ${
        brand === 'professional'
          ? 'border-2 border-[#144272]/60 focus:border-[#0A2647] focus:ring-[#144272]/20 text-[#0A2647]'
          : 'border border-[#E6D4AF] focus:border-[#5D1425] focus:ring-[#5D1425]/20 text-stone-800'
      }`}
    />
    {value && (
      <button
        type="button"
        onClick={() => {
          onChange('');
          onClear?.();
        }}
        aria-label="Limpar busca"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

/* ============================================================================
 * 5. TABS & SEGMENTED CONTROL
 * ========================================================================== */
export const SegmentedControl: React.FC<{
  options: { id: string; label: string; icon?: React.ReactNode }[];
  activeId: string;
  onChange: (id: string) => void;
  brand?: BrandVariant;
}> = ({ options, activeId, onChange, brand = 'patient' }) => (
  <div
    role="tablist"
    className={`inline-flex items-center gap-1 p-1 rounded-xl border overflow-x-auto max-w-full ${
      brand === 'professional'
        ? 'vitta-pearl-blue-subbar border-[#144272]'
        : 'bg-[#FAF6ED] border-[#E6D4AF]'
    }`}
  >
    {options.map((opt) => {
      const isActive = opt.id === activeId;
      return (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(opt.id)}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            isActive
              ? brand === 'professional'
                ? 'vitta-metallic-blue-badge text-white shadow-2xs'
                : 'bg-[#5D1425] text-white shadow-2xs'
              : brand === 'professional'
              ? 'text-[#0A2647] hover:bg-white/70'
              : 'text-stone-600 hover:text-[#5D1425] hover:bg-white/70'
          }`}
        >
          {opt.icon}
          <span>{opt.label}</span>
        </button>
      );
    })}
  </div>
);

export const Tabs = SegmentedControl;

/* ============================================================================
 * 6. ALERT, EMPTY STATE, ERROR STATE, LOADING STATE, SKELETON & CLINICAL BANNER
 * ========================================================================== */
export const Alert: React.FC<{
  tone?: 'normal' | 'attention' | 'urgent' | 'info';
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ tone = 'info', title, description, action }) => {
  const styles = {
    normal: {
      box: 'bg-emerald-50/90 border-emerald-400 text-emerald-950',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />,
      tag: 'Normal',
    },
    attention: {
      box: 'bg-amber-50/95 border-amber-400 text-amber-950',
      icon: <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />,
      tag: 'Atenção',
    },
    urgent: {
      box: 'bg-rose-50/95 border-rose-500 text-rose-950',
      icon: <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0" />,
      tag: 'Urgente',
    },
    info: {
      box: 'bg-sky-50/90 border-sky-300 text-sky-950',
      icon: <Info className="w-5 h-5 text-sky-700 shrink-0" />,
      tag: 'Orientação',
    },
  }[tone];

  return (
    <div
      role={tone === 'urgent' ? 'alert' : 'status'}
      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${styles.box}`}
    >
      <div className="flex items-start gap-3">
        {styles.icon}
        <div>
          <div className="flex items-center gap-2">
            <strong className="text-xs sm:text-sm font-bold">{title}</strong>
          </div>
          {description && <p className="text-xs mt-0.5 leading-relaxed opacity-90">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0 self-end sm:self-center">{action}</div>}
    </div>
  );
};

/**
 * Mandatory Clinical Safety Disclaimer (Section 1, 8, 9, 24)
 * Clearly distinguishes educational/orientative content from professional medical/nursing diagnosis.
 */
export const ClinicalDisclaimerBanner: React.FC<{
  brand?: BrandVariant;
  variant?: BrandVariant;
  onOpenSOS?: () => void;
}> = ({ brand, variant, onOpenSOS }) => {
  const activeBrand = brand || variant || 'patient';
  return (
    <div
      className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
        activeBrand === 'professional'
          ? 'vitta-pearl-blue-subbar border-[#144272] text-[#0A2647]'
          : 'bg-[#FAF6ED] border-[#E6D4AF] text-stone-700'
      }`}
    >
      <div className="flex items-start sm:items-center gap-2.5">
        <Info
          className={`w-4 h-4 shrink-0 mt-0.5 sm:mt-0 ${
            activeBrand === 'professional' ? 'text-[#144272]' : 'text-[#8D253D]'
          }`}
        />
        <span>
          <strong>Aviso de Segurança Clínica:</strong> As informações e escalas deste aplicativo têm caráter educativo e de apoio ao cuidado, não substituindo o diagnóstico médico ou a avaliação presencial da equipe de enfermagem.
        </span>
      </div>
      {onOpenSOS && (
        <button
          type="button"
          onClick={onOpenSOS}
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
        >
          Acionar SOS 24h
        </button>
      )}
    </div>
  );
};

export const EducationalClinicalBanner = ClinicalDisclaimerBanner;

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-12 w-full' }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-xl bg-stone-200/70 dark:bg-stone-800 ${className}`}
  />
);

export const LoadingState: React.FC<{ message?: string; brand?: BrandVariant }> = ({
  message = 'Carregando informações seguras...',
  brand = 'patient',
}) => (
  <div className="p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
    <Loader2
      className={`w-7 h-7 animate-spin ${
        brand === 'professional' ? 'text-[#144272]' : 'text-[#5D1425]'
      }`}
    />
    <p className="text-xs sm:text-sm font-medium text-stone-600">{message}</p>
  </div>
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  brand?: BrandVariant;
}> = ({ title, description, icon, actionLabel, onAction, brand = 'patient' }) => (
  <div
    className={`p-8 rounded-2xl border text-center flex flex-col items-center justify-center space-y-3 ${
      brand === 'professional'
        ? 'vitta-pearl-white-card'
        : 'bg-white border-[#E6D4AF]/70'
    }`}
  >
    {icon && (
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          brand === 'professional'
            ? 'vitta-pearl-blue-subbar text-[#0A2647]'
            : 'bg-[#FAF0F2] text-[#5D1425]'
        }`}
      >
        {icon}
      </div>
    )}
    <h4
      className={`text-base font-serif font-bold ${
        brand === 'professional' ? 'text-[#0A2647]' : 'text-[#480D1B]'
      }`}
    >
      {title}
    </h4>
    <p className="text-xs text-stone-600 max-w-md">{description}</p>
    {actionLabel && onAction && (
      <Button brand={brand} size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
  brand?: BrandVariant;
}> = ({
  title = 'Não foi possível carregar seus dados',
  description = 'Verifique sua conexão com a internet e tente novamente.',
  onRetry,
  brand = 'patient',
}) => (
  <div className="p-6 rounded-2xl bg-rose-50/90 border border-rose-300 text-center space-y-3">
    <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
    <h4 className="text-base font-serif font-bold text-rose-950">{title}</h4>
    <p className="text-xs text-rose-800 max-w-md mx-auto">{description}</p>
    {onRetry && (
      <Button brand={brand} variant="danger" size="sm" onClick={onRetry}>
        Tente novamente
      </Button>
    )}
  </div>
);

/* ============================================================================
 * 7. PROGRESS & TIMELINE
 * ========================================================================== */
export const Progress: React.FC<{
  value: number;
  max?: number;
  label?: string;
  brand?: BrandVariant;
}> = ({ value, max = 100, label, brand = 'patient' }) => {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between text-xs font-medium">
          <span>{label}</span>
          <span className="tabular-nums font-bold">{pct}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-stone-200/80 rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${pct}%` }}
          className={`h-full rounded-full transition-all duration-300 ${
            brand === 'professional' ? 'bg-[#144272]' : 'bg-[#5D1425]'
          }`}
        />
      </div>
    </div>
  );
};

export interface TimelineItemData {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  status?: 'normal' | 'attention' | 'urgent' | 'completed';
  description?: string;
  author?: string;
}

export const Timeline: React.FC<{
  items: TimelineItemData[];
  brand?: BrandVariant;
}> = ({ items, brand = 'patient' }) => (
  <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
    {items.map((item) => {
      const dotColor =
        item.status === 'urgent'
          ? 'bg-rose-600 ring-rose-100'
          : item.status === 'attention'
          ? 'bg-amber-500 ring-amber-100'
          : item.status === 'completed' || item.status === 'normal'
          ? 'bg-emerald-600 ring-emerald-100'
          : brand === 'professional'
          ? 'bg-[#144272] ring-sky-100'
          : 'bg-[#5D1425] ring-rose-100';

      return (
        <div key={item.id} className="relative pl-10">
          <span
            className={`w-3.5 h-3.5 rounded-full ring-4 absolute left-2 top-1.5 ${dotColor}`}
            aria-hidden="true"
          />
          <div
            className={`p-4 rounded-2xl border ${
              brand === 'professional'
                ? 'bg-white border-[#144272]/30'
                : 'bg-white border-[#E6D4AF]/60'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong
                className={`text-xs sm:text-sm font-serif font-bold ${
                  brand === 'professional' ? 'text-[#0A2647]' : 'text-[#480D1B]'
                }`}
              >
                {item.title}
              </strong>
              <span className="text-[11px] font-mono text-stone-500 tabular-nums">{item.date}</span>
            </div>
            {item.subtitle && (
              <span className="text-xs font-medium text-stone-600 block mt-0.5">
                {item.subtitle}
              </span>
            )}
            {item.description && (
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{item.description}</p>
            )}
            {item.author && (
              <span className="text-[11px] text-stone-400 block mt-2 pt-1.5 border-t border-stone-100">
                Registrado por: {item.author}
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

/* ============================================================================
 * 8. MODAL, DRAWER, BOTTOM SHEET & CONFIRMATION DIALOG
 * ========================================================================== */
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  brand?: BrandVariant;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  brand = 'patient',
  maxWidth = 'lg',
}) => {
  if (!isOpen) return null;
  const maxW = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxW} max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl ${
          brand === 'professional'
            ? 'vitta-pearl-blue-bg border-t-2 sm:border-2 border-[#0A2647]'
            : 'bg-[#FDFBF7] border-t sm:border border-[#E6D4AF]'
        }`}
      >
        <div
          className={`px-5 py-4 flex items-center justify-between border-b shrink-0 ${
            brand === 'professional'
              ? 'vitta-pearl-blue-header border-[#144272]'
              : 'bg-white border-[#E6D4AF]/60'
          }`}
        >
          <div className="pr-3">
            <h3
              id="modal-title"
              className={`text-base sm:text-lg font-serif font-bold ${
                brand === 'professional' ? 'text-[#0A2647]' : 'text-[#480D1B]'
              }`}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className={`text-xs mt-0.5 ${
                  brand === 'professional' ? 'text-[#144272]' : 'text-stone-500'
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
          <IconButton label="Fechar janela" brand={brand} onClick={onClose}>
            <X className="w-4 h-4" />
          </IconButton>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">{children}</div>
        {footer && (
          <div
            className={`px-5 py-3.5 border-t shrink-0 flex flex-wrap items-center justify-end gap-2 ${
              brand === 'professional'
                ? 'bg-white/95 border-[#144272]/25'
                : 'bg-white border-stone-200/70'
            }`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const BottomSheet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex flex-col justify-end animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl border-t border-[#E6D4AF] p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4"
      >
        <div className="w-10 h-1.5 bg-stone-300 rounded-full mx-auto -mt-1 mb-2" />
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="font-serif font-bold text-base text-[#480D1B]">{title}</h3>
          <IconButton label="Fechar" onClick={onClose}>
            <X className="w-4 h-4" />
          </IconButton>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export const ConfirmationDialog: React.FC<{
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  brand?: BrandVariant;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  brand = 'patient',
  onConfirm,
  onCancel,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onCancel}
    title={title}
    brand={brand}
    maxWidth="sm"
    footer={
      <>
        <Button brand={brand} variant="outline" size="sm" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          brand={brand}
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{description}</p>
  </Modal>
);
