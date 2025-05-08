import React from "react";

const features = [
  {
    title: "All-in-One Dashboard",
    icon: "⏱️",
    description:
      "Tired of juggling multiple insurance apps? Our dashboard puts all your policies in one place. It’s like having a personal insurance command center at your fingertips.",
  },
  {
    title: "AI-Powered Insights",
    icon: "📊",
    description:
      "Think of this as your insurance sidekick. Our AI analyzes your coverage and suggests smart tweaks to save you money without sacrificing protection.",
  },
  {
    title: "Interactive Policy Chat",
    icon: "💬",
    description:
      "Got a burning insurance question at 2 AM? Our chatbot’s got you covered. It’s like texting a super-smart insurance friend, minus the awkward small talk.",
  },
  {
    title: "Streamlined Claims",
    icon: "📄",
    description:
      "Filing a claim shouldn’t feel like solving a Rubik’s cube. We’ve made it so simple, you might actually look forward to it. (Okay, maybe that’s a stretch.)",
  },
  {
    title: "Proactive Alerts",
    icon: "🔔",
    description:
      "We’re like your insurance early warning system. Get a heads-up on everything from policy renewals to potential coverage gaps. No more “oops, I forgot” moments.",
  },
  {
    title: "Risk Assessment",
    icon: "🛡️",
    description:
      "Ever wonder what keeps insurance agents up at night? Our risk tool gives you a peek behind the curtain, helping you spot and squash potential problems.",
  },
  {
    title: "Family Coverage Management",
    icon: "👨‍👩‍👧‍👦",
    description:
      "Managing your family’s insurance just got a whole lot easier. It’s like having a family command center, minus the arguments over the remote control.",
  },
  {
    title: "Secure Document Storage",
    icon: "🔒",
    description:
      "Say goodbye to that overflowing filing cabinet. Store all your insurance docs in our Fort Knox-like digital vault. It’s ultra-secure, yet easier to access than your own garage.",
  },
];

const Features = () => {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center rounded-b-xl">
        <div className="text-xl font-bold text-blue-900">
          <span className="text-blue-700">Insure</span>Smart
        </div>
        <nav className="space-x-6 text-gray-600 text-sm">
          <a href="#features" className="hover:text-blue-700">
            Features
          </a>
          <a href="#blog" className="hover:text-blue-700">
            Blog
          </a>
          <a href="#faq" className="hover:text-blue-700">
            FAQ
          </a>
          <button className="px-4 py-1 border border-blue-700 rounded-full text-blue-700 hover:bg-blue-50">
            Login
          </button>
          <button className="px-4 py-1 bg-blue-700 text-white rounded-full hover:bg-blue-800">
            Sign Up
          </button>
        </nav>
      </header>
  <section className="text-center py-16 bg-gradient-to-r from-blue-100 via-white to-blue-100">
    <h1 className="text-4xl font-bold text-blue-900 mb-4">
      Insurance, Simplified
    </h1>
    <p className="max-w-2xl mx-auto text-gray-600 text-lg">
      Say goodbye to insurance headaches. InsureSmart brings you a suite of tools that make
      managing your policies a breeze. Let’s explore how we’re changing the game.
    </p>
  </section>

  {/* What's Inside */}
  <section className="py-12 px-6">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-8">What's Inside</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map(({ title, icon }) => (
          <div
            key={title}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition"
          >
            <div className="text-3xl mb-2 text-blue-600">{icon}</div>
            <div className="text-blue-700 font-medium text-center">{title}</div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Feature Highlights */}
  <section className="py-12 px-4 max-w-4xl mx-auto">
    <h2 className="text-xl font-semibold text-center mb-12">Features You’ll Love</h2>
    {features.map(({ title, icon, description }, index) => (
      <div key={index} className="bg-white rounded-xl shadow-lg mb-8 p-6 flex gap-4">
        <div className="text-3xl text-blue-600">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    ))}
  </section>

  {/* CTA */}
  <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-12 text-center">
    <h2 className="text-xl font-semibold mb-4">Ready to Make Insurance Less of a Headache? 🧠</h2>
    <p className="mb-6">
      Join thousands who have made sense of their insurance with InsureSmart. We'll help you understand your coverage, 
      spot ways to save, and stay on top of changes.
    </p>
    <button className="bg-white text-blue-800 font-semibold px-6 py-2 rounded-full hover:bg-blue-100">
      GET YOUR FREE INSURANCE CHECKUP
    </button>
    <p className="text-sm mt-4">
      More questions? Check out our <a href="#faq" className="underline">FAQ</a>
    </p>
  </section>

  {/* Footer */}
  <footer className="bg-white py-8 px-4 text-sm text-gray-600">
    <div className="text-center text-xs mt-6">© 2025 InsureSmart. All rights reserved.</div>
  </footer>
</div>
); };
export default Features;