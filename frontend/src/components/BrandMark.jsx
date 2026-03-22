import clsx from 'clsx'

import { siteConfig } from '../siteConfig'

function BrandMark({
  className,
  iconClassName,
  titleClassName,
  subtitleClassName,
  showText = true,
  showSubtitle = true,
}) {
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <div
        className={clsx(
          'flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-[#0f172a] shadow-lg shadow-slate-900/10',
          iconClassName,
        )}
      >
        <img src={siteConfig.logoPath} alt={`${siteConfig.appName} logo`} className="h-[72%] w-[72%] object-contain" />
      </div>
      {showText && (
        <div className="min-w-0">
          <p className={clsx('truncate font-display text-lg font-bold text-ink', titleClassName)}>{siteConfig.appName}</p>
          {showSubtitle && (
            <p className={clsx('truncate text-xs text-slate-500', subtitleClassName)}>{siteConfig.tagline}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default BrandMark
