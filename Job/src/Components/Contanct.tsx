import type { FC } from "react";
const Contanct: FC = () => {
  
  return (
    <>
                
    <section id="contact">
    <div  className="min-h-screen bg-gray-100 ">

      {/* Hero Section */}
      <section   className="bg-linear-to-r from-cyan-500 to-blue-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Contact Us
          </h1>

          <p className="text-lg max-w-2xl mx-auto">
            Have questions about jobs, recruitment, or AI-powered matching?
            Our team is ready to help.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10">

          {/* Left Side */}
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-3xl font-bold mb-6">
              Get In Touch
            </h2>

            <div className="space-y-6">

              <div>
                <h3 className="font-semibold text-lg">
                  📍 Address
                </h3>
                <p className="text-gray-600">
                  TalentBridge AI, Chennai, Tamil Nadu, India
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  📞 Phone
                </h3>
                <p className="text-gray-600">
                  +91 98765 43210
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  📧 Email
                </h3>
                <p className="text-gray-600">
                  support@aijobportal.com
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  🕒 Working Hours
                </h3>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM
                </p>
              </div>

            </div>

          </div>

          {/* Right Side */}
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-3xl font-bold mb-6">
              Send Message
            </h2>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <textarea
                rows={5}
                placeholder="Your Message"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>
          © 2026 AI Job Portal. All Rights Reserved.
        </p>
      </footer>

    </div>
    </section>
    </>
  );
};

export default Contanct;