"use client"

import { motion } from "framer-motion"
import { Accessibility, Eye, Ear, Hand, Brain, CheckCircle, AlertCircle, Users, Globe, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const accessibilityFeatures = [
  {
    icon: Eye,
    title: "Visual Accessibility",
    features: [
      "High contrast mode support",
      "Scalable text and interface elements",
      "Screen reader compatibility",
      "Keyboard navigation support",
      "Color-blind friendly design"
    ]
  },
  {
    icon: Ear,
    title: "Auditory Accessibility",
    features: [
      "Audio content transcripts",
      "Visual indicators for audio cues",
      "Volume control options",
      "Subtitles and captions",
      "Alternative text for audio elements"
    ]
  },
  {
    icon: Hand,
    title: "Motor Accessibility",
    features: [
      "Large click targets",
      "Keyboard-only navigation",
      "Voice control support",
      "Customizable interaction timing",
      "Alternative input methods"
    ]
  },
  {
    icon: Brain,
    title: "Cognitive Accessibility",
    features: [
      "Clear and simple language",
      "Consistent navigation patterns",
      "Progress indicators",
      "Error prevention and recovery",
      "Customizable interface complexity"
    ]
  }
]

const standards = [
  {
    standard: "WCAG 2.1 AA",
    description: "Web Content Accessibility Guidelines Level AA compliance",
    status: "Compliant"
  },
  {
    standard: "Section 508",
    description: "U.S. federal accessibility standards compliance",
    status: "Compliant"
  },
  {
    standard: "ADA",
    description: "Americans with Disabilities Act compliance",
    status: "Compliant"
  },
  {
    standard: "EN 301 549",
    description: "European accessibility standard compliance",
    status: "Compliant"
  }
]

const testingMethods = [
  {
    method: "Automated Testing",
    description: "Regular automated accessibility scans using industry-standard tools",
    frequency: "Daily"
  },
  {
    method: "Manual Testing",
    description: "Expert manual testing by accessibility specialists",
    frequency: "Monthly"
  },
  {
    method: "User Testing",
    description: "Testing with users who have disabilities",
    frequency: "Quarterly"
  },
  {
    method: "Third-Party Audits",
    description: "Independent accessibility audits by certified professionals",
    frequency: "Annually"
  }
]

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Accessibility className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Accessibility Statement
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We are committed to ensuring that our platform is accessible to everyone, 
            regardless of ability or technology used to access our services.
          </p>
        </motion.div>

        {/* Commitment */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Commitment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                At YourApp, we believe that technology should be inclusive and accessible to everyone. 
                We are committed to providing a platform that can be used by people with diverse abilities, 
                including those who use assistive technologies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We continuously work to improve the accessibility of our platform and ensure compliance 
                with international accessibility standards. Our goal is to provide an equal experience 
                for all users, regardless of their abilities or the technologies they use.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  WCAG 2.1 AA Compliant
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Section 508 Compliant
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  International Standards
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Accessibility Features */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Accessibility Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {accessibilityFeatures.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <category.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Standards Compliance */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Standards Compliance
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {standards.map((standard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{standard.standard}</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {standard.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{standard.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testing Methods */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Testing and Validation
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testingMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{method.method}</CardTitle>
                      <Badge variant="outline">{method.frequency}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{method.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Known Issues */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                Known Issues and Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                While we strive to maintain the highest accessibility standards, we acknowledge 
                that there may be areas for improvement. We are continuously working to address 
                any accessibility barriers and enhance the user experience for all users.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Current Focus Areas
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Enhanced keyboard navigation for complex interactions</li>
                  <li>• Improved screen reader compatibility for dynamic content</li>
                  <li>• Better color contrast in certain interface elements</li>
                  <li>• Mobile accessibility improvements</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="bg-muted/50 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Accessibility Feedback
          </h2>
          <p className="text-muted-foreground mb-6">
            We welcome feedback on the accessibility of our platform. If you encounter 
            any accessibility barriers or have suggestions for improvement, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              Report Accessibility Issue
            </Button>
            <Button variant="outline">
              Accessibility Feedback
            </Button>
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Accessibility Team: accessibility@yourapp.com</p>
            <p>Response time: Within 2 business days</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
