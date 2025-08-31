import ValuePreview from '@/components/ValuePreview'

export default function FormPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-alira-porcelain/20 via-white to-alira-porcelain/20">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-alira-onyx mb-6">
            Get Your Business Case Preview
          </h1>
          <p className="text-xl text-alira-onyx/70 max-w-3xl mx-auto">
            See your customized business case structure in minutes, then get the complete version delivered to your inbox
          </p>
        </div>
        
        <ValuePreview />
      </div>
    </main>
  )
}
