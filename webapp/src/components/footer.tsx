"use client"

import { FileText } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { motion } from "framer-motion"

export function Footer() {
    return (
      <footer className="bg-sidebar border-t border-sidebar-border py-12 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <motion.div 
                  className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </motion.div>
                <span className="text-xl font-bold text-sidebar-foreground">YourApp</span>
              </div>
              <p className="text-sidebar-foreground/70 mb-4">
                A modern platform that helps you build, scale, and grow your business with powerful tools and intuitive design.
              </p>
              <div className="flex space-x-4">
                <motion.a 
                  href="#" 
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faTwitter} className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <h4 className="font-semibold text-sidebar-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sidebar-foreground/70">
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <a href="/contact" className="hover:text-sidebar-foreground transition-colors">
                    Contact Us
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <a href="/about" className="hover:text-sidebar-foreground transition-colors">
                    About Us
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <a href="/faq" className="hover:text-sidebar-foreground transition-colors">
                    FAQ
                  </a>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <h4 className="font-semibold text-sidebar-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sidebar-foreground/70">
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <a href="/privacy" className="hover:text-sidebar-foreground transition-colors">
                    Privacy Policy
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <a href="/terms" className="hover:text-sidebar-foreground transition-colors">
                    Terms of Service
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <a href="/accessibility" className="hover:text-sidebar-foreground transition-colors">
                    Accessibility Statement
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div 
            className="border-t border-sidebar-border mt-8 pt-8 text-center text-sidebar-foreground/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p>&copy; {new Date().getFullYear()} YourApp. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    )
}