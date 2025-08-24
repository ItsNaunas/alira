'use client'

export default function HeroCTAs() {
  const handleStartClick = () => {
    document.getElementById('start')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex items-center justify-center pt-4">
      <button
        type="button"
        className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-alira-porcelain bg-alira-onyx rounded-lg hover:bg-alira-onyx/90 focus:outline-none focus:ring-2 focus:ring-alira-onyx focus:ring-offset-2 focus:ring-offset-alira-porcelain transition-all duration-200 active:scale-95"
        onClick={handleStartClick}
      >
        Start your business case
      </button>
    </div>
  )
}
