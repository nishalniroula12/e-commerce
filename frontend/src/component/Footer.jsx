import React from 'react'

const Footer = () => {
  return (
    <div>
          <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">

            {/* Brand */}
            <div>
              <h4 className="text-white text-lg font-bold mb-3">🛒 MyStore</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your one-stop destination for quality products at the best prices. Shop with confidence.
              </p>
              <div className="flex gap-3 mt-4">
                {["Facebook", "Instagram", "Twitter"].map((s) => (
                  <button
                    key={s}
                    className="bg-gray-800 hover:bg-emerald-600 text-gray-300 hover:text-white w-9 h-9 rounded-full flex items-center justify-center transition duration-200 text-xs font-bold"
                  >
                    {s[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-white font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                {["Home", "Products", "Categories", "About Us", "Contact"].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => nav(`/${link.toLowerCase().replace(" ", "-")}`)}
                      className="hover:text-emerald-400 transition duration-150"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h5 className="text-white font-semibold mb-4">Customer Service</h5>
              <ul className="space-y-2 text-sm">
                {["My Account", "Track Order", "Returns & Refunds", "FAQs", "Privacy Policy"].map((link) => (
                  <li key={link}>
                    <button className="hover:text-emerald-400 transition duration-150">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="text-white font-semibold mb-4">Contact Us</h5>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">📍</span>
                  <span>Kathmandu, Nepal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>📞</span>
                  <span>+977-9800000000</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✉️</span>
                  <span>support@mystore.com.np</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🕐</span>
                  <span>Sun–Fri, 9am – 6pm</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} MyStore. All rights reserved.</p>
            <div className="flex gap-4">
              <button className="hover:text-emerald-400 transition">Terms</button>
              <button className="hover:text-emerald-400 transition">Privacy</button>
              <button className="hover:text-emerald-400 transition">Sitemap</button>
            </div>
          </div>
        </div>
      </footer>

      
    </div>
  )
}

export default Footer
