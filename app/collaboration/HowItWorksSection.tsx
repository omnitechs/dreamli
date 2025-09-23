'use client';

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Register and Get Approved",
      description: "Submit your application with portfolio samples and get verified by our team.",
      icon: "ri-user-add-line",
      color: "purple"
    },
    {
      number: "02", 
      title: "Access Project Dashboard",
      description: "Browse available projects with detailed requirements and specifications.",
      icon: "ri-dashboard-line",
      color: "blue"
    },
    {
      number: "03",
      title: "Submit Your Proposal",
      description: "Propose your budget and delivery timeline for projects that interest you.",
      icon: "ri-file-text-line", 
      color: "green"
    },
    {
      number: "04",
      title: "Collaborate & Deliver",
      description: "Work with Dreamli team to complete projects and deliver exceptional results.",
      icon: "ri-team-line",
      color: "orange"
    },
    {
      number: "05",
      title: "Get Paid & Grow",
      description: "Receive fair compensation and build your reputation in our community.",
      icon: "ri-trophy-line",
      color: "pink"
    }
  ];

  const colorClasses = {
    purple: {
      bg: "bg-purple-600",
      light: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-600"
    },
    blue: {
      bg: "bg-blue-600", 
      light: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-600"
    },
    green: {
      bg: "bg-green-600",
      light: "bg-green-50", 
      border: "border-green-100",
      text: "text-green-600"
    },
    orange: {
      bg: "bg-orange-600",
      light: "bg-orange-50",
      border: "border-orange-100", 
      text: "text-orange-600"
    },
    pink: {
      bg: "bg-pink-600",
      light: "bg-pink-50",
      border: "border-pink-100",
      text: "text-pink-600"
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How It <span className="text-purple-600">Works</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Our streamlined process makes it easy to join, collaborate, and succeed on the Dreamli platform.
          </p>
        </div>

        <div className="relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 via-green-200 via-orange-200 to-pink-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => {
              const colors = colorClasses[step.color];
              return (
                <div key={index} className={`${colors.light} ${colors.border} border rounded-3xl p-6 text-center relative`}>
                  <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <i className={`${step.icon} text-2xl text-white`}></i>
                  </div>
                  
                  <div className={`inline-flex items-center justify-center w-8 h-8 ${colors.bg} text-white text-sm font-bold rounded-full mb-4`}>
                    {step.number}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-rocket-line text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              The process is simple and transparent. Join thousands of creative professionals who are already part of the Dreamli community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors whitespace-nowrap">
                <i className="ri-palette-line mr-2"></i>
                Apply as Designer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}